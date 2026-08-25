<template>
  <Pdf
    class="pdf-view m-auto preview-dark:invert-[0.8] preview-dark:hue-rotate-180"
    :source="doc"
    :width="500"
    :scale="2"
    :page="page"
    @loaded="handleLoaded"
    @loading-failed="console.error"
    @rendering-failed="console.error"
  />
</template>

<script setup lang="ts">
import { usePdfStore } from '@/stores/pdf.store';
import { useSelectionStore } from '@/stores/selection.store';
import Pdf, { usePdf } from '@/components/features/pdf';
import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { useSheetPrintContext } from '../../context';

// PDF 预览配置状态
const { scale, viewMode } = storeToRefs(usePdfStore());
// 当前待打印文档
const { selectedDoc } = storeToRefs(useSelectionStore());

// 打印 Sheet 当前解析出的页码序列
const { pageNumbers } = useSheetPrintContext();

// 当前 PDF 文件二进制数据
const buffer = shallowRef<Uint8Array | null>(null);

const { doc } = usePdf({
  source: buffer,
});

// 当前需要展示的页面范围
const page = computed(() => {
  if (viewMode.value === 'raw') {
    return;
  }

  return pageNumbers.value;
});

// 更新当前文档的页数
const handleLoaded = ({ numPages }: PDFDocumentProxy) => {
  if (!selectedDoc.value) {
    return;
  }

  selectedDoc.value.pageCount = numPages;
};

// 根据当前文档状态读取最新 PDF
watchEffect(async () => {
  const md5 = selectedDoc.value?.md5;

  if (!md5) {
    return;
  }

  buffer.value = await ipc.getPdf(md5);
});
</script>

<style scoped lang="scss">
.pdf-view {
  zoom: v-bind('scale');
}
</style>
