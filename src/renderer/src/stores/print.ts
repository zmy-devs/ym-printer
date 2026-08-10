import { Doc } from '@type';

const map = new Map<string, { next: () => void; cancel: () => void }>();

export const printPromise = (config: Doc) => {
  const { promise, resolve } = Promise.withResolvers<boolean>();

  map.set(config.id, {
    next() {
      resolve(true);
      map.delete(config.id);
    },
    cancel() {
      resolve(false);
      map.delete(config.id);
    },
  });

  return promise;
};

export const printNext = (id: string) => {
  map.get(id)?.next();
};

export const printCancel = (id: string) => {
  map.get(id)?.cancel();
};
