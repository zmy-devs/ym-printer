import { inject } from 'vue';
import type { InjectionKey, Ref } from 'vue';

// 打印机任务弹窗子组件共享的状态与操作
type PrintTaskContext = {
  selectedPrinter: Ref<string>;
  handleSelectPrinter: (printer: string) => Promise<void>;
  handleRefreshPrinterTasks: () => Promise<void>;
  handleRemovePrinterTask: (id?: number) => Promise<void>;
};

// 打印机任务弹窗上下文标识
export const printTaskContextKey: InjectionKey<PrintTaskContext> =
  Symbol('PrintTaskContext');

// 获取打印机任务弹窗上下文
export const usePrintTaskContext = () => {
  // 当前打印机任务弹窗提供的上下文
  const context = inject(printTaskContextKey);

  if (!context) {
    throw new Error('打印机任务子组件必须在打印机任务弹窗内使用');
  }

  return context;
};
