<template>
  <div
    ref="root"
    class="vue-pdf-embed w-fit grid gap-2"
    :class="{
      'cols-2': pageItems.length > 1,
    }"
  >
    <div
      v-for="pageItem in pageItems"
      :key="pageItem.key"
      class="relative bg-white shadow-sm"
      :class="{
        'page-number': pageItem.pageNumber !== 0,
      }"
      :data-page-number="pageItem.pageNumber"
    >
      <slot name="before-page" :page="pageItem.pageNumber" />

      <div class="vue-pdf-embed__page">
        <canvas v-if="pageItem.pageNumber !== 0" />
      </div>

      <slot name="after-page" :page="pageItem.pageNumber" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  OnProgressParameters,
  PDFDocumentProxy,
} from 'pdfjs-dist/legacy/build/pdf.mjs';
import type { PasswordRequestParams, Source } from './types';
import { useVuePdfEmbed } from './composables';
import { usePageRenderer } from './use-page-renderer';

// PDF 页面渲染组件入参
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

// PDF 加载与渲染生命周期事件
const emit = defineEmits<{
  loaded: [document: PDFDocumentProxy];
  'loading-failed': [error: Error];
  'password-requested': [params: PasswordRequestParams];
  progress: [params: OnProgressParameters];
  rendered: [];
  'rendering-failed': [error: Error];
}>();

// PDF 页面根元素
const root = shallowRef<HTMLDivElement | null>(null);

// 加载并响应 PDF 文档来源变化
const { doc } = useVuePdfEmbed({
  onError: (error) => {
    emit('loading-failed', error);
  },
  onPasswordRequest: ({ callback, isWrongPassword }) => {
    emit('password-requested', { callback, isWrongPassword });
  },
  onProgress: (progressParams) => {
    emit('progress', progressParams);
  },
  source: toRef(props, 'source'),
});

// 管理分页渲染并转发渲染结果事件
const { pageItems } = usePageRenderer({
  document: doc,
  height: toRef(props, 'height'),
  onError: (error) => {
    emit('rendering-failed', error);
  },
  onRendered: () => {
    emit('rendered');
  },
  page: toRef(props, 'page'),
  root,
  rotation: toRef(props, 'rotation'),
  scale: toRef(props, 'scale'),
  width: toRef(props, 'width'),
});

// 文档就绪时通知调用方更新页数
watch(
  doc,
  (newDocument) => {
    if (newDocument) {
      emit('loaded', newDocument);
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.page-number {
  &::after {
    content: attr(data-page-number);
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
