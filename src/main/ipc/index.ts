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
import type { Doc } from '@type';
import {
  BrowserWindow,
  dialog,
  nativeTheme,
  type IpcMainInvokeEvent,
  shell,
} from 'electron';
import { parseDoc } from '../utils/doc';
import { formatPrinterTask } from '../utils/format';
import { autoUpdater } from 'electron-updater';
import { exec, execFile } from '@/utils/exec';

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
  option: { workspaceId: string; paths?: string[] },
) => {
  const win = BrowserWindow.fromWebContents(sender)!;

  let { workspaceId, paths = [] } = option;

  //路径不存在就选择
  if (paths.length == 0) {
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

    if (result.canceled) {
      return;
    }

    paths = result.filePaths;
  }

  // 过滤 IPC 传入的非文档路径
  paths = paths.filter((path) => {
    return isSupportedDocument(path);
  });

  if (paths.length == 0) {
    return;
  }

  const res: Doc[] = await Promise.all(
    paths.map(async (path) => {
      return await parseDoc({
        path,
        workspaceId,
      });
    }),
  );

  win.webContents.send('addDocFinish', res);
};

//读取pdf
export const getPdf = async (_: IpcMainInvokeEvent, md5: string) => {
  const path = join(cachePath, `${md5}.pdf`);

  return await readFile(path);
};

//解析文件
export const parserDoc = async (_: IpcMainInvokeEvent, file: Doc) => {
  const { md5, ext, path } = file;

  if (!existsSync(cachePath)) {
    await mkdir(cachePath, { recursive: true });
  }

  //存储位置
  const pdfPath = join(cachePath, `${md5}.pdf`);

  if (existsSync(pdfPath)) {
    return;
  }

  //word转pdf
  if (ext == 'pdf') {
    await copyFile(path, pdfPath);
  } else {
    console.time(md5);

    await toPdf(path, pdfPath);

    console.timeEnd(md5);
  }
};

//打印
export const print = async (
  _: IpcMainInvokeEvent,
  config: Doc,
  range: number[],
) => {
  // 打印程序执行参数
  const args = [
    `--docName=${config.name}`,
    `--file=${join(cachePath, `${config.md5}.pdf`)}`,
    `--printer=${config.printer}`,
    `--range=${range.join(',')}`,
    `--orientation=${config.orientation}`,
    `--count=${config.count}`,
    `--cartridge=${config.cartridge}`,
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
  theme: 'light' | 'dark',
) => {
  const win = BrowserWindow.fromWebContents(sender)!;

  nativeTheme.themeSource = theme;

  win.setTitleBarOverlay({
    symbolColor: theme == 'light' ? '#000000' : '#d4d4d4',
  });
};
