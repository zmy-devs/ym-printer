<template>
  <Dialog v-model:open="visible">
    <DialogContent
      as="form"
      :aria-describedby="undefined"
      @submit.prevent="handleSubmit"
      @close-auto-focus.prevent="handleClose"
    >
      <DialogHeader>
        <DialogTitle>{{ workspaceTitleMap[dialogType] }}</DialogTitle>
      </DialogHeader>

      <Field name="name" label="工作空间名称" v-slot="{ componentField }">
        <Input placeholder="请输入工作空间名称" v-bind="componentField" />
      </Field>

      <Field name="printer" label="默认打印机" v-slot="{ componentField }">
        <SelectPrinter
          class="w-full"
          variant="outline"
          :iconVisible="false"
          v-bind="componentField"
        />
      </Field>

      <DialogFooter>
        <Button type="submit">确定</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Field from '@/components/field.vue';
import { Input } from '@/components/ui/input';
import SelectPrinter from '@/components/select-printer.vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { eventBus } from '@/utils/event-bus';
import { useWorkspaceService } from '@/services/workspace.service';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { workspaceTitleMap } from '@/map';

const { createWorkspace, editWorkspace } = useWorkspaceService();

// 工作空间表单弹窗开关状态
const visible = ref(false);

// 工作空间表单操作类型
const dialogType = ref<'add' | 'edit'>('add');

// 工作空间表单校验和提交控制器
const {
  handleSubmit: validateSubmit,
  resetForm,
  setValues,
} = useForm({
  validationSchema: toTypedSchema(
    z.object({
      id: z.string(),
      name: z.string().min(1, '请输入名称'),
      printer: z.string().min(1, '请选择打印机'),
    }),
  ),
  initialValues: {
    id: '',
    name: '',
    printer: '',
  },
});

// 关闭工作空间表单
const handleClose = () => {
  visible.value = false;
};

// 校验并保存工作空间数据
const handleSubmit = validateSubmit((values) => {
  switch (dialogType.value) {
    case 'add':
      createWorkspace(values);
      break;
    case 'edit':
      editWorkspace(values);
      break;
  }

  handleClose();
});

// 响应新增工作空间事件
eventBus.on('dialog-workspace:add:show', () => {
  dialogType.value = 'add';

  resetForm();

  visible.value = true;
});

// 响应编辑工作空间事件
eventBus.on('dialog-workspace:edit:show', (data) => {
  dialogType.value = 'edit';

  setValues(data);

  visible.value = true;
});
</script>

<style scoped lang="scss"></style>
