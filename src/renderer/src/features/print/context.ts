import type { PrintConfig } from '@type';
import type { FormContext } from 'vee-validate';
import type { ComputedRef, InjectionKey } from 'vue';
import type { PrintControl } from './map';

// 表单可编辑的打印配置
export type PrintConfigValues = Omit<PrintConfig, 'pageNumbers'>;

// 打印 Sheet 内共享的表单与控制能力
export type SheetPrintContext = {
  // 打印配置表单上下文
  form: FormContext<PrintConfigValues>;

  // 当前需要禁用的打印控件
  disabledControls: ComputedRef<PrintControl[]>;

  // 当前表单解析出的完整页码序列
  pageNumbers: ComputedRef<number[]>;

  // 当前选择的打印机是否支持自动双面
  canAutoDuplex: ComputedRef<boolean>;

  // 关闭打印 Sheet
  closeSheetPrint: () => void;
};

// 打印 Sheet 上下文注入标识
export const sheetPrintContextKey: InjectionKey<SheetPrintContext> = Symbol(
  'sheet-print-context',
);

// 获取打印 Sheet 上下文
export const useSheetPrintContext = () => {
  // 最近的打印 Sheet 上下文
  const context = inject(sheetPrintContextKey);

  if (!context) {
    throw new Error('缺少打印 Sheet 上下文');
  }

  return context;
};
