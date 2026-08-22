import { inject } from 'vue';
import type { InjectionKey, Ref } from 'vue';
import type { PrinterTask } from '@type';

// 打印机任务队列子组件共享的状态与操作
type PrintTaskContext = {
  printerTasks: Ref<PrinterTask[]>;
  selectedPrinter: Ref<string>;
  handleRefreshPrinterTasks: () => Promise<void>;
  handleRemovePrinterTask: (id?: number) => Promise<void>;
};

// 打印机任务队列上下文标识
export const printTaskContextKey: InjectionKey<PrintTaskContext> =
  Symbol('PrintTaskContext');

// 获取打印机任务队列上下文
export const usePrintTaskContext = () => {
  // 当前打印机任务队列提供的上下文
  const context = inject(printTaskContextKey);

  if (!context) {
    throw new Error('打印机任务子组件必须在打印机任务队列内使用');
  }

  return context;
};
