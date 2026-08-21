export const usePrinterStore = defineStore('printer', () => {
  //所有打印机
  const printers = ref<string[]>([]);

  //获取打印机
  const getPrinters = async () => {
    const res = await ipc.getPrinters();

    printers.value = res.sort();
  };

  return {
    printers,
    getPrinters,
  };
});
