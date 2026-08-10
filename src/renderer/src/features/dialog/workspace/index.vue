<template>
  <Dialog v-model:open="open">
    <DialogContent
      :aria-describedby="undefined"
      @close-auto-focus="handleClose"
    >
      <DialogHeader>
        <DialogTitle>
          {{ workspaceTypeMap[dialogType] }}
        </DialogTitle>
      </DialogHeader>

      <Form />

      <DialogFooter>
        <Button @click="handleClick">确定</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Form from './form/index.vue';
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
import { workspaceTypeMap } from '@/map/index';

const { selectedPrinter } = storeToRefs(usePrinterStore());
const { selectedWorkspace } = storeToRefs(useWorkspaceStore());
const { addWorkspace, editWorkspace } = useWorkspaceStore();

const open = ref(false);

//dialog类型
const dialogType = ref<'add' | 'edit'>('add');

const { handleSubmit, setValues } = useForm({
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

eventBus.on('dialog-workspace:show', (option) => {
  dialogType.value = option.type;

  switch (dialogType.value) {
    case 'add':
      setValues({
        printer: selectedPrinter.value,
      });
      break;
    case 'edit':
      if (!option.data) {
        setValues(selectedWorkspace.value);
        break;
      }

      setValues(option.data);
      break;
  }

  open.value = true;
});
</script>

<style scoped lang="scss"></style>
