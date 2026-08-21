import type { PrinterTask } from '@type';

export const usePrinterTaskStore = defineStore('printer-task', () => {
  // 当前打印机的任务列表
  const printerTasks = ref<PrinterTask[]>([]);

  // 获取指定打印机的任务
  const getPrinterTasks = async (printer: string) => {
    if (!printer) {
      printerTasks.value = [];
      return;
    }

    printerTasks.value = await ipc.getPrinterTask(printer);
  };

  // 删除指定打印机的单个任务
  const removePrinterTask = async (printer: string, id?: number) => {
    if (!printer) {
      return;
    }

    await ipc.removePrinterTask({
      printer,
      id,
    });
  };

  return {
    printerTasks,
    getPrinterTasks,
    removePrinterTask,
  };
});
