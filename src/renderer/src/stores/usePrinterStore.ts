import { useStorage } from '@vueuse/core';

export const usePrinterStore = defineStore('printer', () => {
  //所有打印机
  const printers = ref<string[]>([]);

  //选中的打印机
  const selectedPrinter = useStorage('printer', '');

  //设置打印机
  const selectPrinter = (value: string) => {
    selectedPrinter.value = value;
  };

  //获取打印机
  const getPrinters = async () => {
    const res = await ipc.getPrinters();

    printers.value = res.sort();
  };

  getPrinters();

  return {
    printers,
    selectedPrinter,
    selectPrinter,
    getPrinters,
  };
});
