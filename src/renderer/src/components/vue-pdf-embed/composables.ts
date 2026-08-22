import { shallowRef, toValue, watch } from 'vue';
import {
  getDocument,
  PasswordResponses,
} from 'pdfjs-dist/legacy/build/pdf.mjs';
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
} from 'pdfjs-dist/legacy/build/pdf.mjs';

import type { UseVuePdfEmbedOptions } from './types';
import { isDocument } from './utils';

// 加载 PDF 文档并管理加载任务的生命周期
export const useVuePdfEmbed = ({
  onError,
  onPasswordRequest,
  onProgress,
  source,
}: UseVuePdfEmbedOptions) => {
  // 当前已加载的 PDF 文档
  const doc = shallowRef<PDFDocumentProxy | null>(null);

  // 监听来源变化并取消已失效的异步加载任务
  watch(
    () => {
      return toValue(source);
    },
    async (sourceValue, _, onCleanup) => {
      // 当前来源对应的加载状态
      const loadState = {
        isCancelled: false,
        task: null as PDFDocumentLoadingTask | null,
      };

      doc.value = null;

      // 来源失效时取消尚未完成的加载任务
      onCleanup(() => {
        loadState.isCancelled = true;
        loadState.task?.destroy();
      });

      if (!sourceValue) {
        return;
      }

      if (isDocument(sourceValue)) {
        doc.value = sourceValue;
        return;
      }

      try {
        // PDF.js 可识别的标准加载参数
        const documentSource =
          sourceValue instanceof Uint8Array
            ? { data: sourceValue }
            : sourceValue;

        // 当前 PDF.js 文档加载任务
        const loadingTask = getDocument(documentSource);
        loadState.task = loadingTask;

        if (onPasswordRequest) {
          // 转发密码请求并标记密码是否错误
          loadingTask.onPassword = (callback, response) => {
            onPasswordRequest({
              callback,
              isWrongPassword:
                response === PasswordResponses.INCORRECT_PASSWORD,
            });
          };
        }

        if (onProgress) {
          loadingTask.onProgress = onProgress;
        }

        // 当前任务最终加载出的 PDF 文档
        const loadedDocument = await loadingTask.promise;

        if (loadState.isCancelled) {
          return;
        }

        doc.value = loadedDocument;
      } catch (error) {
        if (loadState.isCancelled) {
          return;
        }

        if (onError) {
          onError(error as Error);
          return;
        }

        throw error;
      }
    },
    { immediate: true },
  );

  return {
    doc,
  };
};
