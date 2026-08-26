import { is } from '@electron-toolkit/utils';
import { BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';
import { appName } from '@shared/app-info';

autoUpdater.autoDownload = false;
autoUpdater.setFeedURL(
  `https://gitee.com/zmy-devs/${appName}/releases/download/latest`,
);

if (is.dev) {
  autoUpdater.forceDevUpdateConfig = true;
}

const sendToMainWindow = (channel: string, ...args: unknown[]) => {
  BrowserWindow.getAllWindows()[0]?.webContents.send(channel, ...args);
};

autoUpdater.on('update-available', () => {
  autoUpdater.downloadUpdate();
});

autoUpdater.on('download-progress', (info) => {
  sendToMainWindow('download-progress', info.percent);
});

autoUpdater.on('update-downloaded', () => {
  sendToMainWindow('update-downloaded');
});

autoUpdater.on('error', () => {
  sendToMainWindow('update-error');
});

