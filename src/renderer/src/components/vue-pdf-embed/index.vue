<script setup lang="ts">
import type {
  OnProgressParameters,
  PDFDocumentProxy,
  PDFPageProxy,
  PageViewport,
} from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { PasswordRequestParams, Source } from './types';
import { releaseChildCanvases } from './utils';
import { useVuePdfEmbed } from './composables';

const props = withDefaults(
  defineProps<{
    height?: number;
    page?: number | number[];
    rotation?: number;
    scale?: number;
    source: Source;
    width?: number;
  }>(),
  {
    rotation: 0,
    scale: 1,
  },
);

const emit = defineEmits<{
  (e: 'internal-link-clicked', value: number): void;
  (e: 'loaded', value: PDFDocumentProxy): void;
  (e: 'loading-failed', value: Error): void;
  (e: 'password-requested', value: PasswordRequestParams): void;
  (e: 'progress', value: OnProgressParameters): void;
  (e: 'rendered'): void;
  (e: 'rendering-failed', value: Error): void;
}>();

const pageNums = shallowRef<number[]>([]);
const pageScales = ref<number[]>([]);
const root = shallowRef<HTMLDivElement | null>(null);

let renderingController: { isAborted: boolean; promise: Promise<void> } | null =
  null;

const { doc } = useVuePdfEmbed({
  onError: (e) => {
    pageNums.value = [];
    emit('loading-failed', e);
  },
  onPasswordRequest({ callback, isWrongPassword }) {
    emit('password-requested', { callback, isWrongPassword });
  },
  onProgress: (progressParams) => {
    emit('progress', progressParams);
  },
  source: toRef(props, 'source'),
});

const getPageNums = () => {
  if (!doc.value) {
    return [];
  }

  return props.page
    ? Array.isArray(props.page)
      ? props.page
      : [props.page]
    : [...Array(doc.value.numPages + 1).keys()].slice(1);
};

const getPageDimensions = (ratio: number): [number, number] => {
  let width: number;
  let height: number;

  if (props.height && !props.width) {
    height = props.height;
    width = height / ratio;
  } else {
    width = props.width ?? root.value!.clientWidth;
    height = width * ratio;
  }

  return [width, height];
};

/**
 * 核心渲染逻辑
 */
const render = async () => {
  if (!doc.value || renderingController?.isAborted) {
    return;
  }

  try {
    pageNums.value = getPageNums();

    pageScales.value = Array(pageNums.value.length).fill(1);

    await Promise.all(
      pageNums.value.map(async (pageNum, i) => {
        // 如果是第 0 页直接返回
        if (pageNum === 0) {
          return;
        }

        const page = await doc.value!.getPage(pageNum);

        if (renderingController?.isAborted) {
          return;
        }

        const pageRotation =
          ((props.rotation % 90 === 0 ? props.rotation : 0) + page.rotate) %
          360;

        const [canvas] = Array.from(
          root.value!.getElementsByClassName('vue-pdf-embed__page')[i].children,
        ) as [HTMLCanvasElement];

        const isTransposed = !!((pageRotation / 90) % 2);

        const viewWidth = page.view[2] - page.view[0];
        const viewHeight = page.view[3] - page.view[1];

        const ratio = isTransposed
          ? viewWidth / viewHeight
          : viewHeight / viewWidth;

        const [actualWidth, actualHeight] = getPageDimensions(ratio);

        const cssWidth = `${Math.floor(actualWidth)}px`;
        const cssHeight = `${Math.floor(actualHeight)}px`;

        const pageWidth = isTransposed ? viewHeight : viewWidth;

        const pageScale = actualWidth / pageWidth;

        const viewport = page.getViewport({
          scale: pageScale,
          rotation: pageRotation,
        });

        pageScales.value[i] = pageScale;

        canvas.style.display = 'block';
        canvas.style.width = cssWidth;
        canvas.style.height = cssHeight;

        const scale = viewport.scale * window.devicePixelRatio * props.scale;

        return renderPage(page, viewport.clone({ scale }), canvas);
      }),
    );

    if (!renderingController?.isAborted) {
      emit('rendered');
    }
  } catch (e) {
    pageNums.value = [];
    pageScales.value = [];

    if (!renderingController?.isAborted) {
      emit('rendering-failed', e as Error);
    }
  }
};

const renderPage = async (
  page: PDFPageProxy,
  viewport: PageViewport,
  canvas: HTMLCanvasElement,
) => {
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvas, viewport }).promise;
};

watch(
  doc,
  (newDoc) => {
    if (newDoc) {
      emit('loaded', newDoc);
    }
  },
  { immediate: true },
);

watch(
  () => [
    doc.value,
    props.height,
    props.page,
    props.rotation,
    props.scale,
    props.width,
  ],
  async ([newDoc]) => {
    if (newDoc) {
      if (renderingController) {
        renderingController.isAborted = true;
        await renderingController.promise;
      }

      releaseChildCanvases(root.value);
      renderingController = {
        isAborted: false,
        promise: render(),
      };

      await renderingController.promise;
      renderingController = null;
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  releaseChildCanvases(root.value);
});
</script>

<template>
  <div
    ref="root"
    class="vue-pdf-embed w-fit grid gap-2"
    :class="{
      'cols-2': pageNums.length > 1,
    }"
  >
    <div
      v-for="(pageNum, i) in pageNums"
      :key="i"
      class="relative bg-white shadow-sm"
      :class="{
        pageNum: pageNum != 0,
      }"
      :data-pageNum="pageNum"
    >
      <slot name="before-page" :page="pageNum" />

      <div class="vue-pdf-embed__page">
        <canvas v-if="pageNum != 0" />
      </div>

      <slot name="after-page" :page="pageNum" />
    </div>
  </div>
</template>

<style lang="scss">
.pageNum {
  &::after {
    content: attr(data-pageNum);
    position: absolute;
    top: 0;
    left: 20px;
    font-size: 48px;
    color: rgba(0, 0, 0, 0.5);
  }
}

.cols-2 {
  grid-template-columns: repeat(2, 1fr);
}
</style>
