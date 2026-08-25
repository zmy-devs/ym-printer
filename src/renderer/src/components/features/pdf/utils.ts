import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';

// 判断输入值是否为已加载的 PDF 文档
export const isDocument = (document: unknown): document is PDFDocumentProxy => {
  return document
    ? Object.prototype.hasOwnProperty.call(document, '_pdfInfo')
    : false;
};

// 释放画布占用的位图内存
export const releaseCanvas = (canvas: HTMLCanvasElement) => {
  canvas.width = 1;
  canvas.height = 1;
  canvas.getContext('2d')?.clearRect(0, 0, 1, 1);
};

// 释放元素下所有画布占用的位图内存
export const releaseChildCanvases = (element?: HTMLElement | null) => {
  element?.querySelectorAll('canvas').forEach(releaseCanvas);
};
