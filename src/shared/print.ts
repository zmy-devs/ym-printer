import type { PrintConfig } from './type';

// 判断完整页码序列是否只包含单面打印
export const isSimplexPrint = (pageNumbers: number[]) => {
  return pageNumbers.every((pageNumber, index) => {
    return (index + 1) % 2 === 0 ? pageNumber === 0 : true;
  });
};

// 判断当前配置是否需要由驱动自动完成双面打印
export const isAutoDuplexPrint = (
  config: Pick<PrintConfig, 'duplexMode' | 'pageNumbers'>,
) => {
  return config.duplexMode === 'auto' && !isSimplexPrint(config.pageNumbers);
};
