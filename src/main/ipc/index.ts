import { join } from 'path';
import {
  isSupportedDocument,
  supportedDocumentExtensions,
} from '@shared/document';
import { cachePath } from '../utils/path';
import getPrintersScriptPath from '@resources/getPrinters.ps1?asset';
import getPrinterTasksScriptPath from '@resources/getPrinterTasks.ps1?asset';
import printerPath from '@resources/printer.exe?asset';
import testBlackPath from '@resources/test-black.pdf?asset';
import testColorPath from '@resources/test-color.pdf?asset';
import { copyFile, mkdir, readFile } from 'fs/promises';
import { toPdf } from '../service/doc';
import { existsSync } from 'fs';
import type { Doc, PrintConfig } from '@type';
import {
  BrowserWindow,
  dialog,
  nativeTheme,
  type IpcMainInvokeEvent,
  shell,
} from 'electron';
import { parseDoc, type ParsedDoc } from '../utils/doc';
import { formatPrinterTask } from '../utils/format';
import { autoUpdater } from 'electron-updater';
import { exec, execFile } from '../utils/exec';
import { getMd5 } from '../utils/md5';

// 获取传入路径或由用户选择的文档路径
const getDocumentPaths = async (win: BrowserWindow, paths: string[]) => {
  if (paths.length > 0) {
    return paths.filter(isSupportedDocument);
  }

  // 系统文档选择结果
  const result = await dialog.showOpenDialog(win, {
    title: '请选择文档',
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: '文档文件',
        extensions: supportedDocumentExtensions,
      },
    ],
  });

  return result.canceled ? [] : result.filePaths;
};

// 将文档内容解析到对应的 PDF 缓存
const cacheDoc = async (file: Doc) => {
  const { md5, ext, path } = file;

  if (!existsSync(cachePath)) {
    await mkdir(cachePath, { recursive: true });
  }

  // 当前文档内容对应的 PDF 缓存路径
  const pdfPath = join(cachePath, `${md5}.pdf`);

  if (existsSync(pdfPath)) {
    return;
  }

  if (ext == 'pdf') {
    await copyFile(path, pdfPath);
    return;
  }

  await toPdf(path, pdfPath);
};

//获取打印机信息
export const getPrinters = async (_: IpcMainInvokeEvent) => {
  const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${getPrintersScriptPath}"`;

  try {
    const { stdout } = await exec(cmd);

    const rawPrinters = JSON.parse(stdout);

    const printers = Array.isArray(rawPrinters) ? rawPrinters : [rawPrinters];

    return printers;
  } catch {
    return [];
  }
};

//添加文档
export const addDoc = async (
  { sender }: IpcMainInvokeEvent,
  paths: string[] = [],
) => {
  // 发起文档导入的窗口
  const win = BrowserWindow.fromWebContents(sender)!;

  // 传入或由用户选择的文档路径
  const documentPaths = await getDocumentPaths(win, paths);

  if (documentPaths.length === 0) {
    return [];
  }

  // 已解析的纯文档实体
  const docs: ParsedDoc[] = await Promise.all(documentPaths.map(parseDoc));

  return docs;
};

//读取pdf
export const getPdf = async (_: IpcMainInvokeEvent, md5: string) => {
  const path = join(cachePath, `${md5}.pdf`);

  return await readFile(path);
};

//解析文件
export const parserDoc = async (_: IpcMainInvokeEvent, file: Doc) => {
  await cacheDoc(file);
};

// 重新读取当前路径并解析最新的文档内容
export const reloadDoc = async (_: IpcMainInvokeEvent, file: Doc) => {
  // 当前源文件最新内容的唯一摘要
  const md5 = await getMd5(file.path);

  await cacheDoc({
    ...file,
    md5,
  });

  return md5;
};

//打印
export const print = async (
  _: IpcMainInvokeEvent,
  doc: Doc,
  config: PrintConfig,
  pageNumbers: number[],
) => {
  // 打印程序执行参数
  const args = [
    `--docName=${doc.name}`,
    `--file=${join(cachePath, `${doc.md5}.pdf`)}`,
    `--printer=${config.printer}`,
    `--range=${pageNumbers.join(',')}`,
    `--orientation=${config.orientation}`,
    `--count=${config.copies}`,
    `--cartridge=${config.color}`,
    `--dpi=300`,
  ];

  try {
    await execFile(printerPath, args);

    return true;
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 3221225477
    ) {
      return true;
    }

    throw false;
  }
};

//打印测试页面
export const printTest = async (
  _: IpcMainInvokeEvent,
  printer: string,
  cartridge: 'color' | 'black',
) => {
  // 测试页文件路径
  const testPath = cartridge == 'color' ? testColorPath : testBlackPath;

  // 测试页打印程序执行参数
  const args = [
    `--docName=测试页`,
    `--file=${testPath}`,
    `--printer=${printer}`,
    `--cartridge=${cartridge}`,
  ];

  try {
    await execFile(printerPath, args);

    return true;
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 3221225477
    ) {
      return true;
    }

    throw false;
  }
};

//检查更新
export const checkUpdate = async (_: IpcMainInvokeEvent) => {
  const result = await autoUpdater.checkForUpdates();

  return result?.isUpdateAvailable ? result.updateInfo.version : false;
};

//安装更新
export const installUpdate = (_: IpcMainInvokeEvent) => {
  autoUpdater.quitAndInstall(true, true);
};

//用系统默认应用打开文件
export const openPath = (_: IpcMainInvokeEvent, path: string) => {
  return shell.openPath(path);
};

// 在文件管理器中显示文件
export const showItemInFolder = (_: IpcMainInvokeEvent, path: string) => {
  shell.showItemInFolder(path);
};

//打开外部链接
export const openUrl = (_: IpcMainInvokeEvent, url: string) => {
  return shell.openExternal(url);
};

//获取打印机状态
export const getPrinterTask = async (
  _: IpcMainInvokeEvent,
  printer: string,
) => {
  const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${getPrinterTasksScriptPath}" -PrinterName "${printer}"`;

  try {
    const { stdout } = await exec(cmd);

    if (!stdout) {
      return [];
    }

    //原始任务
    const rawTask = JSON.parse(stdout);

    const tasks = Array.isArray(rawTask) ? rawTask : [rawTask];

    //格式化任务
    return tasks.map((item) => {
      return formatPrinterTask(item);
    });
  } catch (error) {
    console.error(error);

    return [];
  }
};

//删除打印机任务
export const removePrinterTask = async (
  _: IpcMainInvokeEvent,
  option: { printer: string; id?: number },
) => {
  const { printer, id } = option;

  let cmd = `powershell -NoProfile "Remove-PrintJob -PrinterName '${printer}' -ID ${id}"`;

  if (id === undefined) {
    cmd = `powershell -NoProfile "Get-PrintJob -PrinterName '${printer}' | Remove-PrintJob"`;
  }

  try {
    await exec(cmd);

    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
};

//切换主题色
export const toggleTheme = (
  { sender }: IpcMainInvokeEvent,
  theme: 'auto' | 'light' | 'dark',
  resolvedTheme: 'light' | 'dark',
) => {
  // 发起主题切换的窗口
  const win = BrowserWindow.fromWebContents(sender)!;

  nativeTheme.themeSource = theme === 'auto' ? 'system' : theme;

  win.setTitleBarOverlay({
    symbolColor: resolvedTheme === 'light' ? '#000000' : '#d4d4d4',
  });
};
