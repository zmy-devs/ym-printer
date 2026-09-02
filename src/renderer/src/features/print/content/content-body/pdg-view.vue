<template>
  <Pdf
    class="pdf-view m-auto preview-dark:invert-[0.8] preview-dark:hue-rotate-180"
    :source="doc"
    :width="500"
    :scale="1.5"
    :page="page"
    @loaded="handleLoaded"
    @loading-failed="handlePdfFailed"
    @rendering-failed="handlePdfFailed"
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

// 将当前文档的 PDF 处理失败状态同步到文档实体
const handlePdfFailed = (error: Error) => {
  console.error(error);

  if (!selectedDoc.value) {
    return;
  }

  selectedDoc.value.status = 'error';
};

// 加载当前 PDF 并接收解析失败事件
const { doc } = usePdf({
  onError: handlePdfFailed,
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
const handleLoaded = (loadedDocument: PDFDocumentProxy) => {
  if (!selectedDoc.value || loadedDocument !== doc.value) {
    return;
  }

  // 当前 PDF 实际解析出的页数
  const pageCount = loadedDocument.numPages;

  selectedDoc.value.pageCount = pageCount;

  //页数为0表示出错
  if (pageCount === 0) {
    selectedDoc.value.status = 'error';
  }
};

onMounted(async () => {
  if (!selectedDoc.value) {
    return;
  }

  try {
    const md5 = selectedDoc.value.md5;

    buffer.value = await ipc.getPdf(md5);
  } catch (error) {
    handlePdfFailed(error as Error);
  }
});
</script>

<style scoped lang="scss">
.pdf-view {
  zoom: v-bind('scale');
}
</style>
