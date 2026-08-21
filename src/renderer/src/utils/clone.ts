export const clone = (value: any) => {
  return JSON.parse(JSON.stringify(value));
};
