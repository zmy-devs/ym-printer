import type { Api } from '.';
import type { ElectronIpc } from 'plugin-electron-ipc';

declare global {
  const api: Api;
  const ipc: ElectronIpc;
}

export {};
