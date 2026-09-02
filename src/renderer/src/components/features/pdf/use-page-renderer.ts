import {
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type ShallowRef,
} from 'vue';
import type {
  PDFDocumentProxy,
  PDFPageProxy,
  PageViewport,
  RenderTask,
} from 'pdfjs-dist/legacy/build/pdf.mjs';
import { toArray } from '@/utils/normalize';
import { createPageBitmapCache } from './page-bitmap-cache';
import { releaseCanvas, releaseChildCanvases } from './utils';

// 页面位图缓存允许占用的最大内存
const maxCacheBytes = 128 * 1024 * 1024;

// 单个页面位图允许包含的最大像素数
const maxPagePixels = 8_000_000;

// 页面渲染允许使用的最大设备像素比
const maxDevicePixelRatio = 2;

// 同时执行的最大页面渲染任务数
const maxConcurrentRenders = 2;

// 尚未读取页面信息时使用的 A4 高宽比
const defaultPageRatio = 297 / 210;

// 滚动视口上下预加载页面的距离
const pagePreloadMargin = '1200px 0px';

// 页面列表项，保存占位尺寸并区分重复页
type PageItem = {
  displayHeight: number;
  displayWidth: number;
  key: string;
  pageNumber: number;
};

// 单次渲染使用的稳定参数快照
type RenderRequest = {
  document: PDFDocumentProxy | null;
  height?: number;
  page?: number | number[];
  rotation: number;
  scale: number;
  width?: number;
};

// 当前页面渲染任务的取消信号
type RenderSignal = {
  isAborted: boolean;
  key: string;
  requestId: number;
  task: RenderTask | null;
};

// 等待进入渲染并发槽位的页面任务
type PendingRender = {
  key: string;
  requestId: number;
  token: string;
};

// 页面位图缓存所属的文档与渲染设置
type CacheContext = {
  document: PDFDocumentProxy;
  settingsKey: string;
};

// 单页展示和输出使用的渲染指标
type PageRenderMetrics = {
  displayHeight: number;
  displayWidth: number;
  outputViewport: PageViewport;
  pageRotation: number;
};

// PDF 页面渲染组合式函数配置
type UsePageRendererOptions = {
  document: MaybeRefOrGetter<PDFDocumentProxy | null>;
  height: MaybeRefOrGetter<number | undefined>;
  onError: (error: Error) => unknown;
  onRendered: () => unknown;
  page: MaybeRefOrGetter<number | number[] | undefined>;
  root: ShallowRef<HTMLDivElement | null>;
  rotation: MaybeRefOrGetter<number>;
  scale: MaybeRefOrGetter<number>;
  width: MaybeRefOrGetter<number | undefined>;
};

// 管理 PDF 页面虚拟化、受限并发渲染与位图缓存
export const usePageRenderer = ({
  document,
  height,
  onError,
  onRendered,
  page,
  root,
  rotation,
  scale,
  width,
}: UsePageRendererOptions) => {
  // 当前展示的页面占位列表
  const pageItems = ref<PageItem[]>([]);

  // 当前预加载区域内需要挂载画布的页面标识
  const visiblePageKeys = ref(new Set<string>());

  // 受内存预算约束的页面位图缓存
  const pageBitmapCache = createPageBitmapCache(maxCacheBytes);

  // 当前页面缓存上下文
  const cacheContext = shallowRef<CacheContext | null>(null);

  // 当前稳定的页面渲染请求
  const currentRequest = shallowRef<RenderRequest | null>(null);

  // 当前页面元素可见性观察器
  const pageObserver = shallowRef<IntersectionObserver | null>(null);

  // 页面标识对应的占位元素
  const pageElements = new Map<string, HTMLElement>();

  // 等待渲染的页面任务队列
  const pendingRenders: PendingRender[] = [];

  // 已加入等待队列的页面任务标识
  const pendingRenderTokens = new Set<string>();

  // 当前执行中的页面渲染任务
  const activeRenders = new Map<string, RenderSignal>();

  // 当前执行中的页面渲染数量
  const activeRenderCount = ref(0);

  // 最新渲染请求编号，用于丢弃过期异步任务
  const renderRequestId = ref(0);

  // 根据外部参数生成稳定的渲染请求快照
  const getRenderRequest = (): RenderRequest => {
    // 当前外部传入的页码参数
    const pageValue = toValue(page);

    // 复制页码数组，避免异步渲染期间被外部原地修改
    const pageSnapshot = Array.isArray(pageValue) ? [...pageValue] : pageValue;

    return {
      document: toValue(document),
      height: toValue(height),
      page: pageSnapshot,
      rotation: toValue(rotation),
      scale: toValue(scale),
      width: toValue(width),
    };
  };

  // 获取当前请求需要展示的完整页码列表
  const getPageNumbers = (request: RenderRequest) => {
    if (!request.document) {
      return [];
    }

    if (request.page !== undefined) {
      return toArray(request.page);
    }

    return Array.from({ length: request.document.numPages }, (_, index) => {
      return index + 1;
    });
  };

  // 根据页面宽高比计算最终展示尺寸
  const getPageDimensions = (request: RenderRequest, ratio: number) => {
    if (request.height && !request.width) {
      return [request.height / ratio, request.height] as const;
    }

    // 优先使用显式宽度，否则使用组件容器宽度
    const displayWidth = request.width ?? root.value?.clientWidth ?? 0;

    return [displayWidth, displayWidth * ratio] as const;
  };

  // 为全部页生成稳定占位尺寸和唯一标识
  const getPageItems = (request: RenderRequest) => {
    // 尚未读取页面信息时使用的默认展示尺寸
    const [displayWidth, displayHeight] = getPageDimensions(
      request,
      defaultPageRatio,
    );

    // 各页码已出现的次数
    const occurrenceCounts = new Map<number, number>();

    return getPageNumbers(request).map((pageNumber) => {
      // 当前页码在列表中的重复序号
      const occurrence = occurrenceCounts.get(pageNumber) ?? 0;
      occurrenceCounts.set(pageNumber, occurrence + 1);

      return {
        displayHeight,
        displayWidth,
        key: `${pageNumber}:${occurrence}`,
        pageNumber,
      };
    });
  };

  // 规范化组件旋转角度并叠加 PDF 页面自身旋转角度
  const getPageRotation = (request: RenderRequest, pdfPage: PDFPageProxy) => {
    // 仅接受 90 度倍数的组件旋转角度
    const normalizedRotation =
      request.rotation % 90 === 0 ? request.rotation : 0;

    return (normalizedRotation + pdfPage.rotate) % 360;
  };

  // 计算受设备像素比和单页像素预算限制的输出视口
  const getPageRenderMetrics = (
    request: RenderRequest,
    pdfPage: PDFPageProxy,
  ): PageRenderMetrics => {
    // 当前页面最终旋转角度
    const pageRotation = getPageRotation(request, pdfPage);

    // 页面是否交换宽高方向
    const isTransposed = Boolean((pageRotation / 90) % 2);

    // PDF 原始页面宽度
    const viewWidth = pdfPage.view[2] - pdfPage.view[0];

    // PDF 原始页面高度
    const viewHeight = pdfPage.view[3] - pdfPage.view[1];

    // 页面按最终方向展示时的高宽比
    const ratio = isTransposed
      ? viewWidth / viewHeight
      : viewHeight / viewWidth;

    // 页面实际展示尺寸
    const [displayWidth, displayHeight] = getPageDimensions(request, ratio);

    // 页面在最终方向下的原始宽度
    const pageWidth = isTransposed ? viewHeight : viewWidth;

    // 页面适配展示宽度所需的缩放倍数
    const pageScale = displayWidth / pageWidth;

    // 页面 CSS 展示尺寸对应的基础视口
    const displayViewport = pdfPage.getViewport({
      rotation: pageRotation,
      scale: pageScale,
    });

    // 设备像素比与额外预览精度组合后的期望倍率
    const requestedOutputScale =
      Math.min(window.devicePixelRatio, maxDevicePixelRatio) *
      Math.max(request.scale, 0.1);

    // 当前展示尺寸最多可使用的额外像素倍率
    const pixelBudgetScale = Math.sqrt(
      maxPagePixels / (displayViewport.width * displayViewport.height),
    );

    // 同时满足预览精度和单页像素预算的输出倍率
    const outputScale = Math.min(requestedOutputScale, pixelBudgetScale);

    // 最终交给 PDF.js 栅格化的输出视口
    const outputViewport = displayViewport.clone({
      scale: displayViewport.scale * outputScale,
    });

    return {
      displayHeight,
      displayWidth,
      outputViewport,
      pageRotation,
    };
  };

  // 更新真实页面及紧随其后的空白纸面占位尺寸
  const updatePageDimensions = (
    key: string,
    displayWidth: number,
    displayHeight: number,
  ) => {
    // 当前页面在展示列表中的位置
    const pageIndex = pageItems.value.findIndex((item) => {
      return item.key === key;
    });

    pageItems.value = pageItems.value.map((item, index) => {
      // 紧随单面页后的空白纸面需要保持相同尺寸
      const followsTargetPage =
        item.pageNumber === 0 && index === pageIndex + 1;

      if (item.key !== key && !followsTargetPage) {
        return item;
      }

      return {
        ...item,
        displayHeight,
        displayWidth,
      };
    });
  };

  // 获取指定页面占位中的画布
  const getPageCanvas = (key: string) => {
    return pageElements.get(key)?.querySelector('canvas') ?? null;
  };

  // 将位图内容绘制到当前页面画布
  const drawBitmap = (bitmap: ImageBitmap, canvas: HTMLCanvasElement) => {
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    // 当前页面画布的二维绘图上下文
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('无法创建 PDF 页面画布上下文');
    }

    context.drawImage(bitmap, 0, 0);
  };

  // 使用 PDF.js 将单页绘制到目标画布
  const renderPage = async (
    pdfPage: PDFPageProxy,
    viewport: PageViewport,
    canvas: HTMLCanvasElement,
    signal: RenderSignal,
  ) => {
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // 当前 PDF.js 页面绘制任务
    const renderTask = pdfPage.render({ canvas, viewport });
    signal.task = renderTask;

    try {
      await renderTask.promise;
    } finally {
      if (signal.task === renderTask) {
        signal.task = null;
      }
    }
  };

  // 等待下一帧再开始较重的页面栅格化
  const waitForNextFrame = () => {
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  };

  // 生成页面位图缓存键
  const getPageCacheKey = (
    pageNumber: number,
    pageRotation: number,
    viewport: PageViewport,
  ) => {
    return `${pageNumber}:${pageRotation}:${Math.ceil(viewport.width)}:${Math.ceil(viewport.height)}`;
  };

  // 判断页面任务是否仍属于当前可见请求
  const isRenderActive = (signal: RenderSignal) => {
    return (
      !signal.isAborted &&
      signal.requestId === renderRequestId.value &&
      visiblePageKeys.value.has(signal.key)
    );
  };

  // 按需渲染单个可见页面并写入受限位图缓存
  const renderPageItem = async (signal: RenderSignal) => {
    // 当前任务使用的稳定渲染请求
    const request = currentRequest.value;

    // 当前任务对应的页面列表项
    const pageItem = pageItems.value.find((item) => {
      return item.key === signal.key;
    });

    if (!request?.document || !pageItem || pageItem.pageNumber === 0) {
      return;
    }

    // 当前需要处理的 PDF 页面
    const pdfPage = await request.document.getPage(pageItem.pageNumber);

    if (!isRenderActive(signal)) {
      return;
    }

    // 当前页面展示与输出使用的全部渲染指标
    const metrics = getPageRenderMetrics(request, pdfPage);

    updatePageDimensions(
      pageItem.key,
      metrics.displayWidth,
      metrics.displayHeight,
    );

    await nextTick();

    if (!isRenderActive(signal)) {
      return;
    }

    // 当前页面对应的目标画布
    const canvas = getPageCanvas(pageItem.key);

    if (!canvas) {
      return;
    }

    // 当前页面在指定渲染设置下的缓存键
    const cacheKey = getPageCacheKey(
      pageItem.pageNumber,
      metrics.pageRotation,
      metrics.outputViewport,
    );

    // 已完成栅格化的同页位图
    const cachedBitmap = pageBitmapCache.get(cacheKey);

    if (cachedBitmap) {
      drawBitmap(cachedBitmap, canvas);
      onRendered();
      return;
    }

    await waitForNextFrame();

    if (!isRenderActive(signal)) {
      return;
    }

    await renderPage(pdfPage, metrics.outputViewport, canvas, signal);

    if (!isRenderActive(signal)) {
      return;
    }

    // 从已完成页面画布复制出的独立缓存位图
    const bitmap = await createImageBitmap(canvas);

    if (!isRenderActive(signal)) {
      bitmap.close();
      return;
    }

    pageBitmapCache.set(cacheKey, bitmap);
    onRendered();
  };

  // 处理单页渲染失败并忽略主动取消产生的错误
  const handleRenderError = (error: unknown, signal: RenderSignal) => {
    if (signal.isAborted) {
      return;
    }

    onError(error instanceof Error ? error : new Error(String(error)));
  };

  // 继续消费满足并发上限的页面渲染队列
  const runRenderQueue = () => {
    while (
      activeRenderCount.value < maxConcurrentRenders &&
      pendingRenders.length > 0
    ) {
      // 当前准备进入渲染槽位的页面任务
      const pendingRender = pendingRenders.shift();

      if (!pendingRender) {
        return;
      }

      pendingRenderTokens.delete(pendingRender.token);

      if (
        pendingRender.requestId !== renderRequestId.value ||
        !visiblePageKeys.value.has(pendingRender.key)
      ) {
        continue;
      }

      // 当前页面渲染任务的取消信号
      const signal: RenderSignal = {
        isAborted: false,
        key: pendingRender.key,
        requestId: pendingRender.requestId,
        task: null,
      };

      activeRenders.set(pendingRender.token, signal);
      activeRenderCount.value += 1;

      renderPageItem(signal)
        .catch((error: unknown) => {
          handleRenderError(error, signal);
        })
        .finally(() => {
          activeRenders.delete(pendingRender.token);
          activeRenderCount.value -= 1;

          if (
            signal.isAborted &&
            signal.requestId === renderRequestId.value &&
            visiblePageKeys.value.has(signal.key)
          ) {
            enqueuePageRender(signal.key);
          }

          runRenderQueue();
        });
    }
  };

  // 将预加载区域内的真实页面加入渲染队列
  const enqueuePageRender = (key: string) => {
    // 当前页面任务在本次请求中的唯一标识
    const token = `${renderRequestId.value}:${key}`;

    if (pendingRenderTokens.has(token) || activeRenders.has(token)) {
      return;
    }

    pendingRenders.push({
      key,
      requestId: renderRequestId.value,
      token,
    });
    pendingRenderTokens.add(token);
  };

  // 取消指定页面尚未完成的栅格化任务
  const cancelPageRendering = (key: string) => {
    activeRenders.forEach((signal) => {
      if (signal.key !== key) {
        return;
      }

      signal.isAborted = true;
      signal.task?.cancel();
    });
  };

  // 更新页面画布挂载集合
  const setPageVisible = (key: string, isVisible: boolean) => {
    // 更新后的预加载页面标识集合
    const nextVisiblePageKeys = new Set(visiblePageKeys.value);

    if (isVisible) {
      nextVisiblePageKeys.add(key);
    } else {
      nextVisiblePageKeys.delete(key);
    }

    visiblePageKeys.value = nextVisiblePageKeys;
  };

  // 响应页面进入或离开滚动预加载区域
  const handlePageIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      // 当前观察元素对应的页面标识
      const key = (entry.target as HTMLElement).dataset.pageKey;

      if (!key) {
        return;
      }

      // 当前观察元素对应的页面列表项
      const pageItem = pageItems.value.find((item) => {
        return item.key === key;
      });

      if (!pageItem || pageItem.pageNumber === 0) {
        return;
      }

      if (entry.isIntersecting) {
        setPageVisible(key, true);
        enqueuePageRender(key);
        return;
      }

      cancelPageRendering(key);
      releaseCanvas(getPageCanvas(key));
      setPageVisible(key, false);
    });

    runRenderQueue();
  };

  // 观察全部页面占位并使用最近滚动视口作为根元素
  const observePageElements = () => {
    // PDF 页面列表根元素
    const rootElement = root.value;

    if (!rootElement) {
      return;
    }

    pageObserver.value?.disconnect();
    pageElements.clear();

    // PDF 所在的滚动区域视口
    const scrollViewport = rootElement.closest<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );

    // 负责驱动页面按需挂载和渲染的可见性观察器
    const observer = new IntersectionObserver(handlePageIntersection, {
      root: scrollViewport,
      rootMargin: pagePreloadMargin,
    });

    rootElement
      .querySelectorAll<HTMLElement>('[data-page-key]')
      .forEach((element) => {
        // 当前占位元素对应的页面标识
        const key = element.dataset.pageKey;

        if (!key) {
          return;
        }

        pageElements.set(key, element);
        observer.observe(element);
      });

    pageObserver.value = observer;
  };

  // 停止当前请求的全部页面渲染与观察任务
  const stopCurrentRendering = () => {
    pageObserver.value?.disconnect();
    pageObserver.value = null;

    activeRenders.forEach((signal) => {
      signal.isAborted = true;
      signal.task?.cancel();
    });

    pendingRenders.splice(0, pendingRenders.length);
    pendingRenderTokens.clear();
    visiblePageKeys.value = new Set();
    pageElements.clear();
    releaseChildCanvases(root.value);
  };

  // 清空全部缓存并移除缓存上下文
  const clearPageBitmapCache = () => {
    pageBitmapCache.clear();
    cacheContext.value = null;
  };

  // 同步当前文档与渲染设置对应的缓存上下文
  const syncCacheContext = (request: RenderRequest) => {
    if (!request.document) {
      clearPageBitmapCache();
      return;
    }

    // 影响页面位图内容与尺寸的设置标识
    const settingsKey = [
      request.height,
      request.rotation,
      request.scale,
      request.width,
      Math.min(window.devicePixelRatio, maxDevicePixelRatio),
    ].join(':');

    if (
      cacheContext.value?.document === request.document &&
      cacheContext.value.settingsKey === settingsKey
    ) {
      return;
    }

    clearPageBitmapCache();
    cacheContext.value = {
      document: request.document,
      settingsKey,
    };
  };

  // 监听页面与渲染设置变化并重建轻量页面占位
  watch(
    getRenderRequest,
    async (request) => {
      // 本次渲染请求的唯一编号
      const requestId = renderRequestId.value + 1;
      renderRequestId.value = requestId;

      stopCurrentRendering();
      currentRequest.value = request;

      if (!request.document) {
        pageItems.value = [];
        clearPageBitmapCache();
        return;
      }

      syncCacheContext(request);
      pageItems.value = getPageItems(request);

      await nextTick();

      if (requestId !== renderRequestId.value) {
        return;
      }

      observePageElements();
    },
    { deep: true, immediate: true },
  );

  // 组件卸载前取消任务并释放全部位图内存
  onBeforeUnmount(() => {
    stopCurrentRendering();
    clearPageBitmapCache();
  });

  return {
    pageItems,
    visiblePageKeys,
  };
};
