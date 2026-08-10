import { Theme } from '@type';
import { useColorMode } from '@vueuse/core';

export const useThemeStore = defineStore('theme', () => {
  //系统主题
  const baseTheme = useColorMode();

  //文档主题
  const previewThemeRaw = useColorMode({
    storageKey: 'previewTheme',
    emitAuto: true,
    modes: {
      light: 'preview-light',
      dark: 'preview-dark',
    },
  });

  const previewTheme = computed(() =>
    previewThemeRaw.value == 'auto' ? baseTheme.value : previewThemeRaw.value,
  );

  //切换主题
  const togglePreviewTheme = () => {
    previewThemeRaw.store.value =
      previewTheme.value == 'dark' ? 'light' : 'dark';
  };

  watchEffect(() => {
    ipc.toggleTheme(baseTheme.value as Theme);
  });

  return {
    baseTheme,
    previewThemeRaw,
    previewTheme,
    togglePreviewTheme,
  };
});
