<template>
  <Sheet v-model:open="open">
    <SheetContent
      :aria-describedby="undefined"
      side="bottom"
      class="h-[calc(100vh-40px)] p-0!"
      @open-auto-focus.prevent
    >
      <VisuallyHidden as-child>
        <SheetTitle />
      </VisuallyHidden>

      <div class="print-preview wh-full grid bg-sidebar">
        <TitleBar />

        <ResizablePanelGroup
          class="pb-2"
          direction="horizontal"
          autoSaveId="print-preview-layout"
        >
          <ResizablePanel :min-size="240" :default-size="260" size-unit="px">
            <SideBar class="h-full" />
          </ResizablePanel>

          <ResizableHandle class="bg-transparent!" />

          <ResizablePanel class="pr-2" :min-size="50">
            <Preview
              class="h-full bg-background border rounded-lg overflow-hidden"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import TitleBar from './title-bar/index.vue';
import SideBar from './side-bar/index.vue';
import Preview from './preview/index.vue';
import { VisuallyHidden } from 'reka-ui';
import { open, close } from './index';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { useDocStore } from '@/stores/doc';
import { useWorkspaceStore } from '@/stores/workspace';
import { usePdfStore } from '@/stores/pdf';
import { useEventListener } from '@vueuse/core';

const { selectedDoc } = storeToRefs(useDocStore());
const { selectedWorkspace } = storeToRefs(useWorkspaceStore());
const { setViewMode } = usePdfStore();

const createInitialValues = () => {
  return {
    remark: selectedDoc.value.remark || '',
    printer: selectedDoc.value.printer || selectedWorkspace.value.printer || '',
    count: selectedDoc.value.count || 1,
    mode: selectedDoc.value.mode || 'mix',
    range: selectedDoc.value.range || '',
    cartridge: selectedDoc.value.cartridge || 'black',
    orientation: selectedDoc.value.orientation || 'portrait',
  };
};

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      remark: z.string(),
      printer: z.string().min(1, '请选择打印机'),
      count: z.number({ message: '' }).min(1, '最少1份').max(999, '最大999份'),
      mode: z.string({
        message: '请选择打印模式',
      }),
      range: z.string().superRefine((value, ctx) => {
        //允许空值
        if (value === '') {
          return;
        }

        //验证格式
        const reg = /^(\d*?-\d*?|\d+)([,，](\d*?-\d*?|\d+))*$/;

        if (!reg.test(value)) {
          ctx.addIssue({
            code: 'custom',
            message: '格式有误',
          });
          return;
        }

        // 打印范围验证
        const pages = value.split(/[,，-]/);

        const isOutOfRange = pages.some((item) => {
          if (item === '') {
            return;
          }

          const page = Number(item);

          return page > selectedDoc.value!.pageCount || page < 1;
        });

        if (isOutOfRange) {
          ctx.addIssue({
            code: 'custom',
            message: '超出打印范围',
          });
        }
      }),
      cartridge: z.string({
        message: '请选择墨盒颜色',
      }),
      orientation: z.string({
        message: '请选择方向',
      }),
    }),
  ),
});

//打开就设置值
watch(
  open,
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
  if (open.value) {
    e.preventDefault();
    close();
  }
});

provide('form', form);
</script>

<style scoped lang="scss">
.print-preview {
  grid-template-rows: 40px calc(100% - 40px);
}
</style>
