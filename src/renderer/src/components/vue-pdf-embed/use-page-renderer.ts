import {
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

import { releaseCanvas, releaseChildCanvases } from './utils';

// 页面列表项，key 可区分重复页并支持跨模式复用
type PageItem = {
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

// 当前渲染任务的取消信号
type RenderSignal = {
  isAborted: boolean;
  task: RenderTask | null;
};

// 当前渲染控制器
type RenderingController = {
  promise: Promise<void>;
  signal: RenderSignal;
};

// 页面位图缓存所属的文档与渲染设置
type CacheContext = {
  document: PDFDocumentProxy;
  settingsKey: string;
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

// 管理 PDF 分页渲染、任务取消与页面位图复用
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
  // 当前展示的页面列表
  const pageItems = shallowRef<PageItem[]>([]);

  // 已完成栅格化的页面画布缓存
  const pageCanvasCache = new Map<string, HTMLCanvasElement>();

  // 当前页面缓存上下文
  const cacheContext = shallowRef<CacheContext | null>(null);

  // 当前执行中的渲染控制器
  const renderingController = shallowRef<RenderingController | null>(null);

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
      return Array.isArray(request.page) ? request.page : [request.page];
    }

    return Array.from({ length: request.document.numPages }, (_, index) => {
      return index + 1;
    });
  };

  // 为重复页生成稳定且唯一的页面列表项
  const getPageItems = (pageNumbers: number[]) => {
    // 各页码已出现的次数
    const occurrenceCounts = new Map<number, number>();

    return pageNumbers.map((pageNumber) => {
      // 当前页码在列表中的重复序号
      const occurrence = occurrenceCounts.get(pageNumber) ?? 0;
      occurrenceCounts.set(pageNumber, occurrence + 1);

      return {
        key: `${pageNumber}:${occurrence}`,
        pageNumber,
      };
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

  // 规范化组件旋转角度并叠加 PDF 页面自身旋转角度
  const getPageRotation = (request: RenderRequest, pdfPage: PDFPageProxy) => {
    // 仅接受 90 度倍数的组件旋转角度
    const normalizedRotation =
      request.rotation % 90 === 0 ? request.rotation : 0;

    return (normalizedRotation + pdfPage.rotate) % 360;
  };

  // 获取指定渲染位置对应的画布
  const getPageCanvas = (index: number) => {
    // 当前渲染位置对应的页面容器
    const pageElement = root.value?.getElementsByClassName(
      'vue-pdf-embed__page',
    )[index];

    return pageElement?.querySelector('canvas') ?? null;
  };

  // 应用画布的展示尺寸
  const setCanvasStyle = (
    canvas: HTMLCanvasElement,
    displayWidth: number,
    displayHeight: number,
  ) => {
    canvas.style.display = 'block';
    canvas.style.width = `${Math.floor(displayWidth)}px`;
    canvas.style.height = `${Math.floor(displayHeight)}px`;
  };

  // 将已缓存页面位图复制到目标画布
  const copyCanvas = (
    sourceCanvas: HTMLCanvasElement,
    targetCanvas: HTMLCanvasElement,
  ) => {
    if (sourceCanvas === targetCanvas) {
      return;
    }

    targetCanvas.width = sourceCanvas.width;
    targetCanvas.height = sourceCanvas.height;

    // 目标画布的二维绘图上下文
    const context = targetCanvas.getContext('2d');

    if (!context) {
      throw new Error('无法创建 PDF 页面画布上下文');
    }

    context.drawImage(sourceCanvas, 0, 0);
  };

  // 将连续的页面栅格化拆到不同帧，避免长时间阻塞界面
  const waitForNextFrame = () => {
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
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

  // 生成页面位图缓存键
  const getPageCacheKey = (
    pageNumber: number,
    pageRotation: number,
    viewport: PageViewport,
  ) => {
    return `${pageNumber}:${pageRotation}:${viewport.width}:${viewport.height}`;
  };

  // 释放全部页面位图缓存
  const clearPageCanvasCache = () => {
    pageCanvasCache.forEach((canvas) => {
      releaseCanvas(canvas);
    });
    pageCanvasCache.clear();
    cacheContext.value = null;
  };

  // 同步当前文档与渲染设置对应的缓存上下文
  const syncCacheContext = (request: RenderRequest) => {
    if (!request.document) {
      clearPageCanvasCache();
      return;
    }

    // 影响页面位图内容与尺寸的设置标识
    const settingsKey = [
      request.height,
      request.rotation,
      request.scale,
      request.width,
      window.devicePixelRatio,
    ].join(':');

    if (
      cacheContext.value?.document === request.document &&
      cacheContext.value.settingsKey === settingsKey
    ) {
      return;
    }

    clearPageCanvasCache();
    cacheContext.value = {
      document: request.document,
      settingsKey,
    };
  };

  // 按页复用缓存并渲染当前页面列表
  const renderPages = async (request: RenderRequest, signal: RenderSignal) => {
    if (!request.document || signal.isAborted) {
      return;
    }

    try {
      // 当前请求需要展示的页面列表
      const nextPageItems = getPageItems(getPageNumbers(request));
      pageItems.value = nextPageItems;

      await nextTick();

      for (const [index, pageItem] of nextPageItems.entries()) {
        if (signal.isAborted) {
          return;
        }

        if (pageItem.pageNumber === 0) {
          continue;
        }

        // 当前需要处理的 PDF 页面
        const pdfPage = await request.document.getPage(pageItem.pageNumber);

        if (signal.isAborted) {
          return;
        }

        // 当前页面最终旋转角度
        const pageRotation = getPageRotation(request, pdfPage);

        // 页面是否交换宽高方向
        const isTransposed = Boolean((pageRotation / 90) % 2);

        // PDF 原始页面宽度
        const viewWidth = pdfPage.view[2] - pdfPage.view[0];

        // PDF 原始页面高度
        const viewHeight = pdfPage.view[3] - pdfPage.view[1];

        // 页面按最终方向展示时的宽高比
        const ratio = isTransposed
          ? viewWidth / viewHeight
          : viewHeight / viewWidth;

        // 页面实际展示尺寸
        const [actualWidth, actualHeight] = getPageDimensions(request, ratio);

        // 页面在最终方向下的原始宽度
        const pageWidth = isTransposed ? viewHeight : viewWidth;

        // 页面适配展示宽度所需的缩放倍数
        const pageScale = actualWidth / pageWidth;

        // 页面展示视口
        const viewport = pdfPage.getViewport({
          scale: pageScale,
          rotation: pageRotation,
        });

        // 结合设备像素比和额外精度倍率的输出视口
        const outputViewport = viewport.clone({
          scale: viewport.scale * window.devicePixelRatio * request.scale,
        });

        // 当前页面对应的目标画布
        const canvas = getPageCanvas(index);

        if (!canvas) {
          throw new Error(`未找到 PDF 第 ${pageItem.pageNumber} 页画布`);
        }

        setCanvasStyle(canvas, actualWidth, actualHeight);

        // 当前页面在指定渲染设置下的缓存键
        const cacheKey = getPageCacheKey(
          pageItem.pageNumber,
          pageRotation,
          outputViewport,
        );

        // 已完成栅格化的同页画布
        const cachedCanvas = pageCanvasCache.get(cacheKey);

        if (cachedCanvas) {
          copyCanvas(cachedCanvas, canvas);
          continue;
        }

        await waitForNextFrame();

        if (signal.isAborted) {
          return;
        }

        await renderPage(pdfPage, outputViewport, canvas, signal);

        if (signal.isAborted) {
          return;
        }

        pageCanvasCache.set(cacheKey, canvas);
      }

      onRendered();
    } catch (error) {
      if (signal.isAborted) {
        return;
      }

      pageItems.value = [];
      onError(error as Error);
    }
  };

  // 取消并等待当前页面渲染任务结束
  const stopRendering = async () => {
    // 正在执行的渲染控制器
    const controller = renderingController.value;

    if (!controller) {
      return;
    }

    controller.signal.isAborted = true;
    controller.signal.task?.cancel();
    await controller.promise;

    if (renderingController.value === controller) {
      renderingController.value = null;
    }
  };

  // 监听页面与渲染设置变化并启动最新一次渲染
  watch(
    getRenderRequest,
    async (request) => {
      // 本次渲染请求的唯一编号
      const requestId = renderRequestId.value + 1;
      renderRequestId.value = requestId;

      await stopRendering();

      if (requestId !== renderRequestId.value) {
        return;
      }

      if (!request.document) {
        pageItems.value = [];
        clearPageCanvasCache();
        return;
      }

      syncCacheContext(request);

      // 本次页面渲染的取消信号
      const signal: RenderSignal = {
        isAborted: false,
        task: null,
      };

      // 本次页面渲染异步任务
      const promise = renderPages(request, signal);

      // 本次页面渲染控制器
      const controller: RenderingController = { promise, signal };
      renderingController.value = controller;

      await promise;

      if (renderingController.value === controller) {
        renderingController.value = null;
      }
    },
    { deep: true, immediate: true },
  );

  // 组件卸载前取消任务并释放所有画布内存
  onBeforeUnmount(() => {
    // 卸载时仍在执行的渲染控制器
    const controller = renderingController.value;

    if (controller) {
      controller.signal.isAborted = true;
      controller.signal.task?.cancel();
    }

    clearPageCanvasCache();
    releaseChildCanvases(root.value);
  });

  return {
    pageItems,
  };
};
