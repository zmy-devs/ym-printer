import type { PrintConfig } from '@type';

// 当前打印任务需要处理的纸张面
export type PrintPhase = 'initial' | 'front';

// 判断完整页码序列是否只包含单面打印
export const isSimplexPrint = (pageNumbers: number[]) => {
  return pageNumbers.every((pageNumber, index) => {
    return (index + 1) % 2 === 0 ? pageNumber === 0 : true;
  });
};

// 获取纸张正面需要上传的页码
const getFrontPageNumbers = (pageNumbers: number[]) => {
  return pageNumbers.filter((_, index) => {
    return (index + 1) % 2 === 1;
  });
};

// 获取纸张背面需要上传的页码
const getBackPageNumbers = (pageNumbers: number[]) => {
  return pageNumbers.filter((_, index) => {
    return (index + 1) % 2 === 0;
  });
};

// 根据打印配置与当前阶段获取实际上传页码
export const getPhasePageNumbers = (config: PrintConfig, phase: PrintPhase) => {
  // 已解析的完整打印页码序列
  const pageNumbers = config.pageNumbers;

  if (phase === 'front') {
    return getFrontPageNumbers(pageNumbers);
  }

  return isSimplexPrint(pageNumbers)
    ? getFrontPageNumbers(pageNumbers)
    : getBackPageNumbers(pageNumbers);
};
