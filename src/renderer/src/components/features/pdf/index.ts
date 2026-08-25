import { GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs';
import PdfWorker from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';
import { usePdf } from './composables';
import Pdf from './index.vue';

// 未配置工作线程时使用随应用打包的 PDF.js Worker
if (!GlobalWorkerOptions.workerSrc) {
  GlobalWorkerOptions.workerSrc = PdfWorker;
}

export { usePdf };
export default Pdf;
