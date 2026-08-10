export const useLockFn = <T extends unknown[]>(
  fn: (...args: T) => Promise<void>,
): [Ref<boolean>, (...args: T) => Promise<void>] => {
  const locked = ref(false);

  return [
    locked,
    async (...args: T): Promise<void> => {
      if (locked.value) {
        return;
      }

      locked.value = true;

      try {
        return await fn(...args);
      } finally {
        locked.value = false;
      }
    },
  ];
};
