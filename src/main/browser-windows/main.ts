import { join } from 'path';
import { BrowserWindow } from 'electron';
import Store from 'electron-store';
import { is } from '@electron-toolkit/utils';

const store = new Store();

let lastSize = store.get('window-size', {
  width: 1024,
  height: 768,
}) as Electron.Size;

export const createMainWindow = () => {
  const mainWindow = new BrowserWindow({
    width: lastSize.width,
    height: lastSize.height,

    minWidth: 520,
    minHeight: 400,

    titleBarStyle: 'hidden',
    titleBarOverlay: {
      symbolColor: '#d4d4d4',
      color: 'rgba(0,0,0,0)',
      height: 40,
    },

    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  });

  //处理窗口调整大小
  mainWindow.on('resized', () => {
    const [width, height] = mainWindow.getSize();

    store.set('window-size', {
      width,
      height,
    });
  });

  if (is.dev) {
    mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}`);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  return mainWindow;
};
