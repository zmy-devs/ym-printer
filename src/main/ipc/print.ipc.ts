import { join } from 'path';
import { type IpcMainInvokeEvent } from 'electron';
import type { Doc, PrintConfig, Printer, PrintPhase } from '@type';
import { isAutoDuplexPrint, isSimplexPrint } from '@shared/print';
import getPrintersScriptPath from '@resources/getPrinters.ps1?asset';
import getPrinterTasksScriptPath from '@resources/getPrinterTasks.ps1?asset';
import printerPath from '@resources/printer.exe?asset';
import testBlackPath from '@resources/test-black.pdf?asset';
import testColorPath from '@resources/test-color.pdf?asset';
import { cachePath } from '../utils/path';
import { exec, execFile } from '../utils/exec';
import { formatPrinterTask } from '../utils/format';

// 获取纸张正面需要上传的页码
const getFrontPageNumbers = (pageNumbers: number[]) => {
  return pageNumbers.filter((_, index) => {
    return (index + 1) % 2 === 1;
  });
};

// 获取纸张背面需要上传的页码
const getBackPageNumbers = (pageNumbers: number[]) => {
  return pageNumbers.filter((_, index) => {
    return (index + 1) % 2 === 0;
  });
};

// 根据打印配置与当前阶段获取实际输出页码
const getPhasePageNumbers = (config: PrintConfig, phase: PrintPhase) => {
  // 用户配置的完整打印页码序列
  const { pageNumbers } = config;

  if (phase === 'all' && isAutoDuplexPrint(config)) {
    return pageNumbers;
  }

  if (phase === 'front') {
    return getFrontPageNumbers(pageNumbers);
  }

  if (phase === 'back') {
    return getBackPageNumbers(pageNumbers);
  }

  return isSimplexPrint(pageNumbers)
    ? getFrontPageNumbers(pageNumbers)
    : getBackPageNumbers(pageNumbers);
};

// 根据用户配置确定打印程序的实际单双面方式
const getDuplexMode = (config: PrintConfig, phase: PrintPhase) => {
  return phase === 'all' && isAutoDuplexPrint(config) ? 'auto' : 'manual';
};

// 调用打印程序并兼容其成功退出码
const executePrint = async (args: string[]) => {
  try {
    await execFile(printerPath, args);
  } catch (error) {
    console.log(error);

    throw error;
  }
};

// 获取系统打印机及其双面能力
export const getPrinters = async (_: IpcMainInvokeEvent) => {
  // 获取系统打印机的 PowerShell 命令
  const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${getPrintersScriptPath}"`;

  try {
    const { stdout } = await exec(cmd);
    // PowerShell 返回的原始打印机数据
    const rawPrinters = JSON.parse(stdout);
    // 统一为打印机数组
    const printers = Array.isArray(rawPrinters) ? rawPrinters : [rawPrinters];

    return printers as Printer[];
  } catch {
    return [];
  }
};

// 根据完整配置打印指定阶段
export const print = async (
  _: IpcMainInvokeEvent,
  doc: Doc,
  config: PrintConfig,
  phase: PrintPhase,
) => {
  // 当前阶段实际需要输出的页码
  const pageNumbers = getPhasePageNumbers(config, phase);
  // 当前任务实际使用的单双面方式
  const duplexMode = getDuplexMode(config, phase);
  // 打印程序执行参数
  const args = [
    `--docName=${doc.name}`,
    `--file=${join(cachePath, `${doc.md5}.pdf`)}`,
    `--printer=${config.printer}`,
    `--range=${pageNumbers.join(',')}`,
    `--orientation=${config.orientation}`,
    `--copies=${config.copies}`,
    `--color=${config.color}`,
    `--duplexMode=${duplexMode}`,
    `--dpi=300`,
  ];

  await executePrint(args);
};

// 打印测试页面
export const printTest = async (
  _: IpcMainInvokeEvent,
  printer: string,
  cartridge: 'color' | 'black',
) => {
  // 当前墨盒对应的测试页路径
  const testPath = cartridge === 'color' ? testColorPath : testBlackPath;
  // 测试页打印程序执行参数
  const args = [
    `--docName=测试页`,
    `--file=${testPath}`,
    `--printer=${printer}`,
    `--color=${cartridge}`,
  ];

  await executePrint(args);
};

// 获取指定打印机的系统任务
export const getPrinterTask = async (
  _: IpcMainInvokeEvent,
  printer: string,
) => {
  // 获取打印机任务的 PowerShell 命令
  const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${getPrinterTasksScriptPath}" -PrinterName "${printer}"`;

  try {
    const { stdout } = await exec(cmd);

    if (!stdout) {
      return [];
    }

    // PowerShell 返回的原始任务数据
    const rawTask = JSON.parse(stdout);
    // 统一为打印任务数组
    const tasks = Array.isArray(rawTask) ? rawTask : [rawTask];

    return tasks.map((item) => {
      return formatPrinterTask(item);
    });
  } catch (error) {
    console.error(error);

    return [];
  }
};

// 删除指定或全部系统打印任务
export const removePrinterTask = async (
  _: IpcMainInvokeEvent,
  option: { printer: string; id?: number },
) => {
  // 删除指定或全部打印任务的 PowerShell 命令
  const cmd =
    option.id === undefined
      ? `powershell -NoProfile "Get-PrintJob -PrinterName '${option.printer}' | Remove-PrintJob"`
      : `powershell -NoProfile "Remove-PrintJob -PrinterName '${option.printer}' -ID ${option.id}"`;

  await exec(cmd);
};
