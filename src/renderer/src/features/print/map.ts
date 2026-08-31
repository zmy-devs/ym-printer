// 打印 Sheet 可统一禁用的控件名称
export type PrintControl =
  | 'printer'
  | 'remark'
  | 'copies'
  | 'range'
  | 'duplex-mode'
  | 'color'
  | 'orientation'
  | 'start-print'
  | 'prepare-print'
  | 'more-print'
  | 'reload'
  | 'preview';

// 全部打印控件名称
const allControls: PrintControl[] = [
  'printer',
  'remark',
  'copies',
  'range',
  'duplex-mode',
  'color',
  'orientation',
  'start-print',
  'prepare-print',
  'more-print',
  'reload',
  'preview',
];

// 文档和打印流程状态对应的禁用控件
export const disabledMap: Record<
  'loading' | 'error' | 'ready',
  PrintControl[]
> = {
  loading: ['range', 'start-print', 'prepare-print', 'more-print', 'preview'],
  error: allControls,
  ready: [],
};
