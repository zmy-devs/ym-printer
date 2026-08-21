import { useSettingsStore } from '@/stores/settings.store';
import type { PrintConfig } from '@type';

// 根据打印配置计算价格
export const getPrice = (config?: PrintConfig) => {
  if (!config?.pageNumbers) {
    return 0;
  }

  const { settings } = storeToRefs(useSettingsStore());

  let simplexPrice = 0;
  let duplexPrice = 0;

  if (config.color == 'black') {
    simplexPrice = settings.value.blackSimplexPrice * 100;
    duplexPrice = settings.value.blackDuplexPrice * 100;
  } else {
    simplexPrice = settings.value.colorSimplexPrice * 100;
    duplexPrice = settings.value.colorSimplexPrice * 100;
  }

  let result = 0;

  for (let i = 1; i < config.pageNumbers.length; i += 2) {
    result += config.pageNumbers[i] == 0 ? simplexPrice : duplexPrice;
  }

  return (result * config.copies) / 100;
};
