import { toast } from 'vue-sonner';

// 统一的提示展示配置
const toastOptions = {
  duration: 1500,
  position: 'top-center' as const,
};

// 异步提示的展示参数
type LoadingToastOptions = {
  successMsg?: string;
  errorMsg?: string;
  loadingMsg?: string;
  cb: () => Promise<void>;
};

// 展示成功提示
export const showSuccessToast = (message: string) => {
  return toast.success(message, toastOptions);
};

// 展示异步操作提示
export const showLoadingToast = (option: LoadingToastOptions) => {
  return toast.promise(option.cb, {
    loading: option.loadingMsg ?? '加载中...',
    success: option.successMsg ?? '操作成功',
    error: option.errorMsg ?? '操作失败',
    ...toastOptions,
  });
};

// 展示错误提示
export const showErrorToast = (message: string) => {
  return toast.error(message, toastOptions);
};
