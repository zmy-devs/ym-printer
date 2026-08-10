import type { PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs';

// @internal
export function emptyElement(el?: HTMLElement | null) {
  while (el?.firstChild) {
    el.removeChild(el.firstChild);
  }
}

// @internal
export function isDocument(doc: unknown): doc is PDFDocumentProxy {
  return doc ? Object.prototype.hasOwnProperty.call(doc, '_pdfInfo') : false;
}

// @internal
export function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 1;
  canvas.height = 1;
  canvas.getContext('2d')?.clearRect(0, 0, 1, 1);
}

// @internal
export function releaseChildCanvases(el?: HTMLElement | null) {
  el?.querySelectorAll('canvas').forEach(releaseCanvas);
}
