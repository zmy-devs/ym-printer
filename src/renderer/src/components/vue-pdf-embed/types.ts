import {
  getDocument,
  type PDFDocumentProxy,
} from 'pdfjs-dist/legacy/build/pdf.mjs';

export type Source =
  | Parameters<typeof getDocument>[0]
  | Uint8Array
  | PDFDocumentProxy
  | null;

export type PasswordRequestParams = {
  callback: (password: unknown) => void;
  isWrongPassword: boolean;
};
