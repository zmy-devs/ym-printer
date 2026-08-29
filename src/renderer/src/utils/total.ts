export const totalCount = <T>(arr: T[], cb: (item: T) => boolean) => {
  return arr.reduce((previousValue, currentValue) => {
    return previousValue + (cb(currentValue) ? 1 : 0);
  }, 0);
};

//计算总和
export const total = (values: number[]) => {
  return values.reduce((total, value) => {
    return total + value;
  }, 0);
};
