import type { PrintConfig, PrintRange, PrintRangeMode } from '@type';

// 空输入时使用的完整文档页码范围
const defaultPrintRange = '1-';

// 缺少打印配置时使用的完整文档单面范围
const defaultPrintRanges: PrintRange[] = [
  {
    range: defaultPrintRange,
    mode: 'simplex',
  },
];

// 正整数或从末页倒数的负整数页码语法
const pageNumberPattern = '-?[1-9]\\d*';

// 单个页码的匹配规则
const pageNumberRegExp = new RegExp(`^${pageNumberPattern}$`);

// 单个页码范围的匹配规则，终点可省略
const pageRangeRegExp = new RegExp(
  `^(${pageNumberPattern})-(${pageNumberPattern})?$`,
);

// 多个逗号分隔页码范围的匹配规则
const printRangeRegExp = new RegExp(
  `^(?:${pageNumberPattern}|${pageNumberPattern}-(?:${pageNumberPattern})?)(?:[,，](?:${pageNumberPattern}|${pageNumberPattern}-(?:${pageNumberPattern})?))*$`,
);

// 页码范围的分隔规则
const rangeSeparatorRegExp = /[,，]/;

// 解析单个范围的起止页码
const parseRangeEndpoints = (range: string) => {
  if (pageNumberRegExp.test(range)) {
    return [Number(range)];
  }

  // 已由表单校验保证范围格式正确
  const [, start, end] = range.match(pageRangeRegExp)!;

  return [Number(start), ...(end ? [Number(end)] : [])];
};

// 将倒数页码换算为实际页码
const resolvePageNumber = (pageNumber: number, pageCount: number) => {
  return pageNumber < 0 ? pageCount + pageNumber + 1 : pageNumber;
};

// 将单个页码或范围展开为连续页码
const expandRange = (range: string, pageCount: number) => {
  if (pageNumberRegExp.test(range)) {
    return [resolvePageNumber(Number(range), pageCount)];
  }

  // 范围两端的原始页码
  const [startNumber, endNumber] = parseRangeEndpoints(range);

  // 范围起点的实际页码
  const startPage = resolvePageNumber(startNumber, pageCount);

  // 省略终点时默认延伸至文档末页
  const endPage =
    endNumber === undefined
      ? pageCount
      : resolvePageNumber(endNumber, pageCount);

  // 统一升序排列范围边界
  const [firstPage, lastPage] =
    startPage <= endPage ? [startPage, endPage] : [endPage, startPage];

  return Array.from({ length: lastPage - firstPage + 1 }, (_, index) => {
    return firstPage + index;
  });
};

// 按打印方式补足纸张背面页码
const applyPrintMode = (pages: number[], mode: PrintRangeMode) => {
  if (mode === 'simplex') {
    return pages.flatMap((page) => {
      return [page, 0];
    });
  }

  return pages.length % 2 === 0 ? pages : [...pages, 0];
};

// 根据文档配置生成最终打印页序列
export const parserRange = ({
  pageCount,
  pageRange = defaultPrintRanges,
}: Pick<{ pageCount: number } & PrintConfig, 'pageCount' | 'pageRange'>) => {
  return pageRange.flatMap(({ range: rangeText, mode }) => {
    // 当前配置实际使用的范围文本
    const printableRange = rangeText || defaultPrintRange;

    // 当前配置展开后的连续页码
    const pages = printableRange.split(rangeSeparatorRegExp).flatMap((part) => {
      return expandRange(part, pageCount);
    });

    return applyPrintMode(pages, mode);
  });
};

// 判断页码范围文本是否符合输入语法
export const isPrintRangeValid = (range: string) => {
  return range === '' || printRangeRegExp.test(range);
};

// 判断页码范围中的正负页码是否都落在文档范围内
export const isPrintRangeInBounds = (
  range: string,
  pageCount: number | undefined,
) => {
  if (range === '') {
    return true;
  }

  if (pageCount === undefined) {
    return false;
  }

  return range.split(rangeSeparatorRegExp).every((part) => {
    return parseRangeEndpoints(part).every((page) => {
      return page >= -pageCount && page <= pageCount;
    });
  });
};
