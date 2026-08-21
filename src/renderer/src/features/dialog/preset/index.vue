<template>
  <Dialog v-model:open="visible">
    <DialogContent
      as="form"
      :aria-describedby="undefined"
      overlay-class="z-[60]"
      class="z-60"
      @submit.prevent="handleSubmit"
      @close-auto-focus.prevent="handleClose"
    >
      <DialogHeader>
        <DialogTitle>{{ presetTitleMap[dialogType] }}</DialogTitle>
      </DialogHeader>

      <Field name="name" label="预设名称" v-slot="{ componentField }">
        <Input placeholder="请输入预设名称" v-bind="componentField" />
      </Field>

      <Field name="value" label="打印范围" v-slot="{ componentField }">
        <Input placeholder="请输入打印范围" v-bind="componentField" />
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
import { usePresetStore } from '@/stores/preset.store';
import { presetTitleMap } from '@/map';

// 预设数据操作方法
const { addPreset, editPreset } = usePresetStore();

// 预设表单弹窗开关状态
const visible = ref(false);

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
  visible.value = false;
};

// 校验并保存预设数据
const handleSubmit = validateSubmit((values) => {
  switch (dialogType.value) {
    case 'add':
      addPreset(values);
      break;
    case 'edit':
      editPreset(values);
      break;
  }

  handleClose();
});

// 响应预设表单打开事件
eventBus.on('dialog-preset:add:show', (value) => {
  dialogType.value = 'add';

  resetForm({
    values: {
      value,
    },
  });

  visible.value = true;
});

// 响应预设表单打开事件
eventBus.on('dialog-preset:edit:show', (value) => {
  dialogType.value = 'edit';

  setValues(value);

  visible.value = true;
});
</script>

<style scoped lang="scss"></style>
