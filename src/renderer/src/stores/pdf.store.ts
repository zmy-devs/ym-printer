import { useStorage } from '@vueuse/core';
import { storagePre } from '@shared/app-info';

export const usePdfStore = defineStore('pdf', () => {
  //选择模式
  const viewMode = ref('raw');

  //缩放倍率
  const scale = useStorage(`${storagePre}:scale`, 0.5);

  //增大倍率
  const addScale = () => {
    scale.value = Math.min(scale.value + 0.05, 2);
  };

  //减小倍率
  const subScale = () => {
    scale.value = Math.max(scale.value - 0.05, 0.05);
  };

  //选择模式
  const setViewMode = (data: string) => {
    viewMode.value = data;
  };

  return {
    viewMode,
    scale,
    addScale,
    subScale,
    setViewMode,
  };
});
