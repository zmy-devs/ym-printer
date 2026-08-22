import type { MaybeRefOrGetter } from 'vue';
import type {
  getDocument,
  OnProgressParameters,
  PDFDocumentProxy,
} from 'pdfjs-dist/legacy/build/pdf.mjs';

// PDF 组件支持的文档来源
export type Source =
  Parameters<typeof getDocument>[0] | Uint8Array | PDFDocumentProxy | null;

// 密码请求回调参数
export type PasswordRequestParams = {
  callback: (password: unknown) => void;
  isWrongPassword: boolean;
};

// PDF 文档加载组合式函数配置
export type UseVuePdfEmbedOptions = {
  onError?: (error: Error) => unknown;
  onPasswordRequest?: (params: PasswordRequestParams) => unknown;
  onProgress?: (params: OnProgressParameters) => unknown;
  source: MaybeRefOrGetter<Source>;
};
