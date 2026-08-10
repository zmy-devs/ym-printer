import { useSettingsStore } from '@/stores/settings';
import { Doc } from '@type';

//获取价格
export const getPrice = (doc: Doc) => {
  if (!doc.formatRange) {
    return 0;
  }

  const { settings } = storeToRefs(useSettingsStore());

  let simplexPrice = 0;
  let duplexPrice = 0;

  if (doc.cartridge == 'black') {
    simplexPrice = settings.value.blackSimplexPrice * 100;
    duplexPrice = settings.value.blackDuplexPrice * 100;
  } else {
    simplexPrice = settings.value.colorSimplexPrice * 100;
    duplexPrice = settings.value.colorSimplexPrice * 100;
  }

  let result = 0;

  for (let i = 1; i < doc.formatRange.length; i += 2) {
    result += doc.formatRange[i] == 0 ? simplexPrice : duplexPrice;
  }

  return (result * doc.count) / 100;
};
