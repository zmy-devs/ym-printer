import type { PrinterTask } from '@type';

// 提供单个打印机任务队列的查询与删除能力
export const usePrinterTaskService = () => {
  // 当前服务实例维护的打印任务列表
  const printerTasks = ref<PrinterTask[]>([]);

  // 获取指定打印机的任务列表
  const getPrinterTasks = async (printer: string) => {
    if (!printer) {
      printerTasks.value = [];
      return;
    }

    printerTasks.value = await ipc.getPrinterTask(printer);
  };

  // 删除指定打印机的单个或全部任务
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
};
