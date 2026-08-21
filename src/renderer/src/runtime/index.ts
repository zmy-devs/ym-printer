import { useShortcut } from './shortcut';
import { useTheme } from './theme';
import { useWindowClose } from './window-close';

// 注册应用运行时能力
export const useRuntime = () => {
  useShortcut();
  useTheme();
  useWindowClose();
};
