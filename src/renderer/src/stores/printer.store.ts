import type { Printer } from '@type';

export const usePrinterStore = defineStore('printer', () => {
  // 以打印机名称索引的系统打印机与驱动能力
  const printers = ref<Record<string, Printer>>({});

  // 按名称升序排列的打印机展示顺序
  const printerOrder = ref<string[]>([]);

  // 根据名称获取打印机配置
  const getPrinter = (name: string) => {
    return printers.value[name];
  };

  // 获取系统打印机及其驱动能力
  const getPrinters = async () => {
    // PowerShell 返回的打印机列表
    const response = await ipc.getPrinters();

    // 按名称排序后的系统打印机列表
    const sortedPrinters = response.toSorted((first, second) => {
      return first.name.localeCompare(second.name);
    });

    // 按名称索引的最新打印机能力
    const nextPrinters = Object.fromEntries(
      sortedPrinters.map((printer) => {
        return [printer.name, printer];
      }),
    );
    // 与能力数据对应的最新打印机展示顺序
    const nextPrinterOrder = sortedPrinters.map((printer) => {
      return printer.name;
    });

    printers.value = nextPrinters;
    printerOrder.value = nextPrinterOrder;
  };

  return {
    printers,
    printerOrder,
    getPrinter,
    getPrinters,
  };
});
