import { contextBridge, webUtils } from 'electron';
import { electronIpc } from 'plugin-electron-ipc';

const api = {
  // File 的原生路径只可在预加载上下文通过 webUtils 获取。
  getFilePath(file: File) {
    return webUtils.getPathForFile(file);
  },
};

export type Api = typeof api;

contextBridge.exposeInMainWorld('ipc', electronIpc);
contextBridge.exposeInMainWorld('api', api);
