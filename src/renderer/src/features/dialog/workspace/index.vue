<template>
  <Dialog v-model:open="visible">
    <DialogContent
      as="form"
      @submit.prevent="handleSubmit"
      @close-auto-focus.prevent="handleClose"
    >
      <DialogHeader>
        <DialogTitle>{{ workspaceTitleMap.edit }}</DialogTitle>
      </DialogHeader>

      <Field name="name" label="工作空间名称" v-slot="{ componentField }">
        <Input placeholder="请输入工作空间名称" v-bind="componentField" />
      </Field>

      <DialogFooter>
        <Button type="submit">确定</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { workspaceTitleMap } from '@/map';
import { useSettingsStore } from '@/stores/settings.store';
import { eventBus } from '@/utils/event-bus';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';

// 应用设置状态
const settingsStore = useSettingsStore();

// 当前工作空间信息
const { settings } = storeToRefs(settingsStore);

// 工作空间表单弹窗开关状态
const visible = ref(false);

// 工作空间表单校验和提交控制器
const { handleSubmit: validateSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z
        .string({ message: '请输入工作空间名称' })
        .trim()
        .min(1, '请输入工作空间名称')
        .max(65, '工作空间名称最多 65 个字符'),
    }),
  ),
  initialValues: {
    name: '',
  },
});

// 关闭工作空间表单
const handleClose = () => {
  visible.value = false;
};

// 校验并保存工作空间名称
const handleSubmit = validateSubmit((values) => {
  settings.value.workspaceName = values.name;
  handleClose();
});

// 响应编辑工作空间事件
eventBus.on('dialog-workspace:edit:show', () => {
  resetForm({
    values: {
      name: settings.value.workspaceName,
    },
  });

  visible.value = true;
});
</script>

<style scoped lang="scss"></style>
