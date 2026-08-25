import { Doc } from '@type';
import { BrowserWindow, IpcMainInvokeEvent, dialog } from 'electron';
import { existsSync } from 'fs';
import { copyFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { getMd5 } from '../utils/md5';
import { toPdf } from '../service/doc';
import { cachePath } from '../utils/path';
import { parseDoc, type ParsedDoc } from '../utils/doc';
import {
  isSupportedDocument,
  supportedDocumentExtensions,
} from '@shared/document';
import { readFile } from 'fs/promises';

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

//解析文件
export const parserDoc = async (_: IpcMainInvokeEvent, file: Doc) => {
  await cacheDoc(file);
};

// 重新读取当前路径并解析最新的文档内容
export const reloadDoc = async (_: IpcMainInvokeEvent, file: Doc) => {
  // 当前源文件最新内容的唯一摘要
  const md5 = await getMd5(file.path);

  if (md5 !== file.md5) {
    await cacheDoc({
      ...file,
      md5,
    });
  }

  return md5;
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
