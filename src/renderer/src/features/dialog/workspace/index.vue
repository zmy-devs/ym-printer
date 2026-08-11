<template>
  <Dialog v-model:open="open">
    <DialogContent
      :aria-describedby="undefined"
      @close-auto-focus="handleClose"
    >
      <DialogHeader>
        <DialogTitle>
          {{ workspaceTitleMap[dialogType] }}
        </DialogTitle>
      </DialogHeader>

      <Field name="name" label="工作空间名称" v-slot="{ componentField }">
        <Input placeholder="请输入工作空间名称" v-bind="componentField" />
      </Field>

      <Field name="printer" label="工作空间打印机" v-slot="{ componentField }">
        <Printer
          class="w-full"
          variant="outline"
          :iconVisible="false"
          v-bind="componentField"
        />
      </Field>

      <DialogFooter>
        <Button @click="handleClick">确定</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Field from '@/components/field.vue';
import { Input } from '@/components/ui/input';
import Printer from '@/components/printer.vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { eventBus } from '@/utils/event-bus';
import { useWorkspaceStore } from '@/stores/workspace';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { usePrinterStore } from '@/stores/printer';
import { workspaceTitleMap } from '@/map/index';

const { selectedPrinter } = storeToRefs(usePrinterStore());
const { addWorkspace, editWorkspace } = useWorkspaceStore();

const open = ref(false);

//dialog类型
const dialogType = ref<'add' | 'edit'>('add');

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      id: z.string(),
      name: z
        .string({
          message: '请输入名称',
        })
        .min(1, '请输入名称'),
      printer: z
        .string({
          message: '请选择打印机',
        })
        .min(1, '请选择打印机'),
    }),
  ),
  initialValues: {
    id: '',
    name: '',
    printer: '',
  },
});

//关闭
const handleClose = () => {
  open.value = false;
};

//处理提交
const handleClick = handleSubmit((values) => {
  switch (dialogType.value) {
    case 'add':
      addWorkspace(values);
      break;
    case 'edit':
      editWorkspace(values);
      break;
  }

  handleClose();
});

// 响应新增工作空间弹窗事件
eventBus.on('dialog-workspace:add:show', () => {
  dialogType.value = 'add';

  resetForm({
    values: {
      printer: selectedPrinter.value,
    },
  });

  open.value = true;
});

// 响应编辑工作空间弹窗事件
eventBus.on('dialog-workspace:edit:show', (data) => {
  dialogType.value = 'edit';

  setValues(data);

  open.value = true;
});
</script>

<style scoped lang="scss"></style>
