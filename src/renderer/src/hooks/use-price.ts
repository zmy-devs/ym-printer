import { getPrice } from '@/utils/price';
import type { PrintConfig } from '@type';
import type { MaybeRef } from 'vue';
import { toValue } from 'vue';

// 响应式计算打印配置价格
export const usePrice = (config: MaybeRef<PrintConfig | undefined>) => {
  return computed(() => getPrice(toValue(config)).toFixed(2));
};
