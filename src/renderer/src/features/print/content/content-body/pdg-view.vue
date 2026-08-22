<template>
  <VuePdfEmbed
    class="pdf-view m-auto preview-dark:invert-[0.8] preview-dark:hue-rotate-180"
    :source="doc"
    :width="500"
    :scale="2"
    :page="page"
    @loaded="handleLoaded"
    @loading-failed="handleError"
    @rendering-failed="handleError"
    v-if="visible"
  />
</template>

<script setup lang="ts">
import { usePdfStore } from '@/stores/pdf.store';
import { useSelectionStore } from '@/stores/selection.store';
import VuePdfEmbed, { useVuePdfEmbed } from '@/components/vue-pdf-embed';
import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { useSheetPrintContext } from '../../context';

const { scale, viewMode } = storeToRefs(usePdfStore());
const { selectedDoc } = storeToRefs(useSelectionStore());

// 打印 Sheet 共享上下文
const { form, pageNumbers } = useSheetPrintContext();

const visible = ref(false);

//pdf数据
const buffer = shallowRef<Uint8Array | null>(null);

const { doc } = useVuePdfEmbed({
  source: buffer,
});

//显示的页面
const page = computed(() => {
  if (viewMode.value === 'raw' || !form.meta.value.valid) {
    return undefined;
  }

  return pageNumbers.value;
});

//处理加载
const handleLoaded = ({ numPages }: PDFDocumentProxy) => {
  if (!selectedDoc.value) {
    return;
  }

  selectedDoc.value.pageCount = numPages;
};

//处理错误
const handleError = (error: Error) => {
  console.error(error);
};

onMounted(async () => {
  if (!selectedDoc.value?.md5) {
    return;
  }

  buffer.value = await ipc.getPdf(selectedDoc.value.md5);

  //等待400ms在渲染防止动画卡顿
  setTimeout(() => {
    visible.value = true;
  }, 400);
});
</script>

<style scoped lang="scss">
.pdf-view {
  zoom: v-bind('scale');
}
</style>
