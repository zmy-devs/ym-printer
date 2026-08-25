<template>
  <Sheet v-model:open="visible">
    <SheetContent
      :aria-describedby="undefined"
      side="bottom"
      class="h-[calc(100vh-40px)] p-0! flex flex-col gap-0"
      @open-auto-focus.prevent
    >
      <VisuallyHidden as-child>
        <SheetTitle />
      </VisuallyHidden>

      <TitleBar class="border-b bg-sidebar" />

      <ResizablePanelGroup
        class="min-h-0 flex-1"
        direction="horizontal"
        autoSaveId="ym-printer:print-layout"
      >
        <ResizablePanel
          :min-size="280"
          :default-size="280"
          :max-size="350"
          size-unit="px"
        >
          <SideBar class="h-full" />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel :min-size="50">
          <Content class="h-full bg-background" />
        </ResizablePanel>
      </ResizablePanelGroup>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { useSelectionStore } from '@/stores/selection.store';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import TitleBar from './title-bar/index.vue';
import SideBar from './side-bar/index.vue';
import Content from './content/index.vue';
import { VisuallyHidden } from 'reka-ui';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { usePdfStore } from '@/stores/pdf.store';
import { useEventListener } from '@vueuse/core';
import {
  isPrintRangeInBounds,
  isPrintRangeValid,
  parserRange,
} from '@/utils/range';
import { usePrintConfigStore } from '@/stores/print-config.store';
import { usePrinterStore } from '@/stores/printer.store';
import { eventBus } from '@/utils/event-bus';
import { sheetPrintContextKey, type PrintConfigValues } from './context.js';

// 打印 Sheet 是否可见
const visible = ref(false);

const { selectedDoc, docId, selectedGroup } = storeToRefs(useSelectionStore());
const { setViewMode } = usePdfStore();
// 文档打印配置状态
const printConfigStore = usePrintConfigStore();
// 系统打印机与驱动能力
const { getPrinter } = usePrinterStore();

// 关闭打印 Sheet
const closeSheetPrint = () => {
  visible.value = false;
};

// 根据当前文档与分组生成打印表单初始值
const createInitialValues = () => {
  const defaultValue = {
    remark: '',
    printer: selectedGroup.value?.printer || '',
    copies: 1,
    pageRange: [{ range: '', mode: 'simplex' }],
    color: 'black',
    orientation: 'portrait',
    duplexMode: 'auto',
  } satisfies PrintConfigValues;

  const config = printConfigStore.getPrintConfig(docId.value);

  return {
    ...defaultValue,
    ...config,
  };
};

// 打印范围字段校验规则
const pageRangeSchema = z
  .array(
    z.object({
      range: z.string(),
      mode: z.enum(['simplex', 'duplex']),
    }),
  )
  .min(1, '请至少添加一项打印范围')
  .superRefine((ranges, ctx) => {
    // 所有打印范围是否符合输入格式
    const isRangeValid = ranges.every(({ range }) => {
      return isPrintRangeValid(range);
    });

    if (!isRangeValid) {
      ctx.addIssue({
        code: 'custom',
        message: '格式有误',
      });
      return;
    }

    // 所有打印范围是否位于当前文档页数内
    const isRangeInBounds = ranges.every(({ range }) => {
      return isPrintRangeInBounds(range, selectedDoc.value?.pageCount);
    });

    if (!isRangeInBounds) {
      ctx.addIssue({
        code: 'custom',
        message: '超出打印范围',
      });
    }
  });

// 打印配置表单校验与默认值
const printConfigSchema = z.object({
  remark: z.string(),
  printer: z.string().min(1, '请选择打印机'),
  copies: z.number().min(1, '最少1份').max(999, '最大999份'),
  pageRange: pageRangeSchema,
  color: z.enum(['black', 'color']),
  orientation: z.enum(['portrait', 'landscape']),
  duplexMode: z.enum(['auto', 'manual']),
});

// 打印配置表单
const form = useForm<PrintConfigValues>({
  initialValues: createInitialValues(),
  validationSchema: toTypedSchema(printConfigSchema),
});

// 当前表单解析出的完整页码序列
const pageNumbers = computed(() => {
  // 当前待打印文档
  const doc = selectedDoc.value;

  // 当前打印范围是否可安全解析
  const isPageRangeValid = pageRangeSchema.safeParse(
    form.values.pageRange,
  ).success;

  if (!doc || !isPageRangeValid) {
    return [];
  }

  return parserRange({
    pageCount: doc.pageCount,
    pageRange: form.values.pageRange,
  });
});

// 当前选择的打印机信息
const selectedPrinter = computed(() => {
  return getPrinter(form.values.printer);
});

// 当前选择打印机的自动双面能力
const canAutoDuplex = computed(() => {
  return Boolean(selectedPrinter.value?.canDuplex);
});

// 打印机能力变化时同步双面方式
watchEffect(() => {
  const value = canAutoDuplex.value ? 'auto' : 'manual';

  form.setFieldValue('duplexMode', value);
});

//打开就设置值
watch(
  visible,
  (val) => {
    if (!val) return;

    form.setValues(createInitialValues());

    //重置预览
    setViewMode('raw');
  },
  {
    immediate: true,
  },
);

//防止误触关闭应用按钮
useEventListener(window, 'beforeunload', (e) => {
  if (visible.value) {
    e.preventDefault();
    closeSheetPrint();
  }
});

eventBus.on('dialog-print:show', () => {
  visible.value = true;
});

provide(sheetPrintContextKey, {
  form,
  pageNumbers,
  canAutoDuplex,
  closeSheetPrint,
});
</script>

<style scoped lang="scss"></style>
