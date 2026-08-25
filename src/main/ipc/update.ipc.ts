import { autoUpdater } from 'electron-updater';

//检查更新
export const checkUpdate = async () => {
  const result = await autoUpdater.checkForUpdates();

  return result?.isUpdateAvailable ? result.updateInfo.version : false;
};

//安装更新
export const installUpdate = () => {
  autoUpdater.quitAndInstall(true, true);
};

