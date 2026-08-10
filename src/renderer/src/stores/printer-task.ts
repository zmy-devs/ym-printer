import { PrinterTask } from '@type';
import { usePrinterStore } from './printer';

let timer: number;

export const usePrinterTaskStore = defineStore('printer-task', () => {
  const { selectedPrinter } = storeToRefs(usePrinterStore());

  //当前打印机打印机任务
  const printerTasks = ref<PrinterTask[]>([]);

  //获取打印机任务
  const getPrinterTasks = async () => {
    if (!selectedPrinter.value) {
      return;
    }

    printerTasks.value = await ipc.getPrinterTask(selectedPrinter.value);
  };

  //初始化任务
  const startPrinterTasks = async () => {
    stopPrinterTasks();

    await getPrinterTasks();

    timer = window.setInterval(getPrinterTasks, 3000);
  };

  //清除打印任务
  const stopPrinterTasks = () => {
    clearInterval(timer);
  };

  //删除打印任务
  const removePrinterTask = async (id: number) => {
    await ipc.removePrinterTask({
      printer: selectedPrinter.value,
      id,
    });

    startPrinterTasks();
  };

  //删除全部的打印任务
  const removeAllPrinterTasks = async () => {
    await ipc.removePrinterTask({
      printer: selectedPrinter.value,
    });

    startPrinterTasks();
  };

  return {
    printerTasks,
    getPrinterTasks,
    startPrinterTasks,
    stopPrinterTasks,
    removePrinterTask,
    removeAllPrinterTasks,
  };
});
