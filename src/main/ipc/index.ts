import {
  BrowserWindow,
  nativeTheme,
  type IpcMainInvokeEvent,
  shell,
} from 'electron';
import { checkWordInstalled as checkWordInstalledService } from '../service/doc';

// 检查当前系统是否已安装可用的 Word
export const checkWordInstalled = (_event: IpcMainInvokeEvent) => {
  return checkWordInstalledService();
};

//用系统默认应用打开文件
export const openPath = (_, path: string) => {
  shell.openPath(path);
};

// 在文件管理器中显示文件
export const showItemInFolder = (_, path: string) => {
  shell.showItemInFolder(path);
};

//打开外部链接
export const openUrl = (_, url: string) => {
  shell.openExternal(url);
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
    symbolColor: resolvedTheme === 'light' ? '#000000' : '#ffffff',
  });
};
