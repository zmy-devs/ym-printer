import type { Theme } from '@type';
import { useColorMode, useStorage } from '@vueuse/core';
import { storagePre } from '@shared/app-info';
import type { ThemeColor } from '@/map';

// 可选择的主题模式
export type ThemeMode = Theme | 'auto';

export const useThemeStore = defineStore('theme', () => {
  // 基础主题模式控制器
  const baseThemeMode = useColorMode();

  // 用户选择的主题色
  const themeColor = useStorage<ThemeColor>(
    `${storagePre}:theme-color`,
    'default',
  );

  // 用户选择的文档主题
  const previewThemeRaw = useStorage<ThemeMode>('previewTheme', 'auto');

  // 用户选择的基础主题
  const baseTheme = baseThemeMode.store;

  // 当前生效的基础主题
  const baseThemeState = baseThemeMode.state;

  // 文档预览最终生效的主题
  const previewTheme = computed(() => {
    return previewThemeRaw.value === 'auto'
      ? baseThemeMode.state.value
      : previewThemeRaw.value;
  });

  // 切换文档预览的明暗主题
  const togglePreviewTheme = () => {
    previewThemeRaw.value = previewTheme.value === 'dark' ? 'light' : 'dark';
  };

  return {
    themeColor,
    previewThemeRaw,
    baseTheme,
    baseThemeState,
    previewTheme,
    togglePreviewTheme,
  };
});
