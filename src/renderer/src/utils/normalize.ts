// 将单个值或数组统一转换为数组
export const toArray = <T>(value: T | T[]) => {
  return Array.isArray(value) ? value : [value];
};
