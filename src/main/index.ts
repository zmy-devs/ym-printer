import { createMainWindow } from '@/browser-windows/main';
import { createWord, exitWord } from './service/doc';
import { app } from 'electron';
import { optimizer } from '@electron-toolkit/utils';
import { cachePath } from './service/path';
import { existsSync, rmSync } from 'fs';
import '@/utils/update';

//禁止多开
if (!app.requestSingleInstanceLock()) {
  app.exit();
}

app.whenReady().then(async () => {
  createWord();

  const mainWindow = createMainWindow();

  //多开窗口
  app.on('second-instance', () => {
    mainWindow.show();
  });

  //创建快捷键
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  //退出软件关闭word和缓存
  app.on('before-quit', () => {
    exitWord();

    //文件夹存在就删除
    if (existsSync(cachePath)) {
      rmSync(cachePath, {
        recursive: true,
      });
    }
  });
});
