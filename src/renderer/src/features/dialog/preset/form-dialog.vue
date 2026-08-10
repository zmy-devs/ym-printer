<template>
  <Dialog v-model:open="open">
    <DialogContent
      :aria-describedby="undefined"
      @close-auto-focus="handleClose"
    >
      <DialogHeader>
        <DialogTitle>{{ presetTypeMap[dialogType] }}</DialogTitle>
      </DialogHeader>

      <Form />

      <DialogFooter>
        <Button @click="handleSubmit">确定</Button>
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { eventBus } from '@/utils/event-bus';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { usePresetStore } from '@/stores/preset';
import { presetTypeMap } from '@/map';

// 预设数据操作方法
const { addPreset, editPreset } = usePresetStore();

// 预设表单弹窗开关状态
const open = ref(false);

// 当前预设表单操作类型
const dialogType = ref<'add' | 'edit'>('add');

// 预设表单校验和提交控制器
const {
  handleSubmit: validateSubmit,
  resetForm,
  setValues,
} = useForm({
  validationSchema: toTypedSchema(
    z.object({
      id: z.string(),
      name: z.string({ message: '请输入名称' }).min(1, '请输入名称'),
      value: z
        .string()
        .min(1, '请输入打印范围')
        .superRefine((value, context) => {
          if (value === '') {
            return;
          }

          // 合法打印范围的匹配规则
          const rangePattern = /^(\d*?-\d*?|\d+)([,，](\d*?-\d*?|\d+))*$/;

          if (!rangePattern.test(value)) {
            context.addIssue({
              code: 'custom',
              message: '格式有误',
            });
          }
        }),
    }),
  ),
  initialValues: {
    id: '',
    name: '',
    value: '',
  },
});

// 关闭并重置预设表单
const handleClose = () => {
  open.value = false;
  resetForm();
};

// 校验并保存预设数据
const handleSubmit = validateSubmit((values) => {
  if (dialogType.value === 'add') {
    addPreset(values);
  } else {
    editPreset(values);
  }

  handleClose();
});

// 响应预设表单打开事件
eventBus.on('dialog-preset-form:show', (option) => {
  dialogType.value = option.type;

  if (option.type === 'edit' && option.data) {
    setValues(option.data);
  } else {
    resetForm();
  }

  open.value = true;
});
</script>

<style scoped lang="scss"></style>
