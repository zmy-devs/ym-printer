import { Doc } from '@type';

export const usePaper = (doc: Doc) => {
  return computed(() => {
    if (!doc.formatRange) {
      return 0;
    }

    return (doc.formatRange.length / 2) * doc.count;
  });
};
