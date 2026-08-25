import { useSettingsStore } from '@/stores/settings.store';
import type { PrintConfig } from '@type';

// 将元换算为分时使用的倍率
const centsPerYuan = 100;

// 将价格转换为整数分，避免浮点数累加误差
const toCents = (price: number) => {
  return Math.round(price * centsPerYuan);
};

// 根据打印配置计算价格
export const getPrice = (config?: PrintConfig) => {
  if (!config?.pageNumbers.length) {
    return 0;
  }

  // 响应式计价设置
  const { settings } = storeToRefs(useSettingsStore());

  // 当前颜色模式的单面价格（分）
  const simplexPrice = toCents(
    config.color === 'black'
      ? settings.value.blackSimplexPrice
      : settings.value.colorSimplexPrice,
  );

  // 当前颜色模式的双面价格（分）
  const duplexPrice = toCents(
    config.color === 'black'
      ? settings.value.blackDuplexPrice
      : settings.value.colorDuplexPrice,
  );

  // 单份文档的总价（分），每张纸由连续的正反面页码组成
  const pricePerCopy = config.pageNumbers.reduce((total, pageNumber, index) => {
    if (index % 2 === 0) {
      return total;
    }

    return total + (pageNumber === 0 ? simplexPrice : duplexPrice);
  }, 0);

  return (pricePerCopy * config.copies) / centsPerYuan;
};
