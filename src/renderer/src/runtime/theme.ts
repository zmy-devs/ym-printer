import { useThemeStore } from '@/stores/theme.store';

// 初始化页面主题样式同步
export const useTheme = () => {
  // 主题状态仓库
  const themeStore = useThemeStore();

  // 主题响应式状态
  const { baseTheme, baseThemeState, previewTheme, themeColor } =
    storeToRefs(themeStore);

  watch(
    themeColor,
    (color) => {
      document.documentElement.dataset.themeColor = color;
    },
    { immediate: true },
  );

  // 同步基础主题到主进程窗口
  watchEffect(() => {
    ipc.toggleTheme(baseTheme.value, baseThemeState.value);
  });

  // 同步文档主题对应的页面样式类
  watchEffect(() => {
    // 页面主题类的挂载节点
    const root = document.documentElement;

    root.classList.toggle('preview-dark', previewTheme.value === 'dark');
    root.classList.toggle('preview-light', previewTheme.value === 'light');
  });
};
