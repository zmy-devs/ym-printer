import type { PrintConfig } from '@type';
import type { MaybeRef } from 'vue';
import { toValue } from 'vue';

// 计算当前打印配置需要的纸张数量
export const usePaper = (config: MaybeRef<PrintConfig | undefined>) => {
  return computed(() => {
    // 当前计算使用的打印配置
    const printConfig = toValue(config);

    if (!printConfig?.pageNumbers) {
      return 0;
    }

    return (printConfig.pageNumbers.length / 2) * printConfig.copies;
  });
};
