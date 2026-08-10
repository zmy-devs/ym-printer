import { getPrice } from '@/utils/price';
import { Doc } from '@type';

export const usePrice = (doc: Doc) => {
  return computed(() => getPrice(doc).toFixed(2));
};
