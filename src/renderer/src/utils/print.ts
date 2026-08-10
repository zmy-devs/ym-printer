import { Doc } from '@type';
import { parserRange } from './range';
import { printPromise } from '@/stores/usePrintStore';

let printQueue = Promise.resolve();

//是否是全单
const isSimplex = (range: number[]) => {
  return range.every((value, index) =>
    (index + 1) % 2 === 0 ? value === 0 : true,
  );
};

//打印范围中的内容
const print = async (config: Doc, range: number[]) => {
  return new Promise<void>((resolve, reject) => {
    printQueue = printQueue
      .then(async () => {
        await ipc.print(config, range);
      })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};

//获取偶数范围
const getEvenRange = (range: number[]) => {
  return range.filter((_, index) => (index + 1) % 2 == 0);
};

//获取奇数范围
const getOddRange = (range: number[]) => {
  return range.filter((_, index) => (index + 1) % 2 == 1);
};

//打印偶数页
export const printEven = async (config: Doc) => {
  const range = parserRange(config);

  await print(config, getEvenRange(range));
};

//打印奇数页
export const printOdd = async (config: Doc) => {
  const range = parserRange(config);

  await print(config, getOddRange(range));
};

//自动打印
export const printAuto = async (
  config: Doc,
  option: {
    printFinish?: () => void;
    printCancel?: () => void;
    printBefore?: () => void;
    printAfter?: () => void;
  },
) => {
  if (!config.formatRange) {
    return;
  }

  const { printFinish, printCancel, printBefore, printAfter } = option;

  //单页
  if (isSimplex(config.formatRange)) {
    printBefore && printBefore();

    await print(config, getOddRange(config.formatRange));

    printFinish && printFinish();
    return;
  }

  printBefore && printBefore();

  //打印偶数页
  await print(config, getEvenRange(config.formatRange));

  printAfter && printAfter();

  const result = await printPromise(config);

  if (!result) {
    printCancel && printCancel();

    return;
  }

  printBefore && printBefore();

  //打印奇数页
  await print(config, getOddRange(config.formatRange));

  printFinish && printFinish();

  return;
};
