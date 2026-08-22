<template>
  <section>
    <Field
      name="workspaceName"
      label="工作空间名称"
      v-slot="{ componentField }"
    >
      <Input
        placeholder="请输入工作空间名称"
        maxlength="65"
        v-bind="componentField"
      />
    </Field>
  </section>

  <slot :handleSubmit="handleSubmit" />
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import Field from '@/components/field.vue';
import { Input } from '@/components/ui/input';
import { useSettingsStore } from '@/stores/settings.store';

// 应用设置状态
const settingsStore = useSettingsStore();

// 工作空间名称表单
const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      workspaceName: z
        .string({
          message: '请输入工作空间名称',
        })
        .trim()
        .min(1, '请输入工作空间名称')
        .max(65, '工作空间名称最多 65 个字符'),
    }),
  ),
  initialValues: {
    workspaceName: '',
  },
});

// 保存工作空间名称
const handleSubmit = form.handleSubmit((values) => {
  settingsStore.settings.clientName = values.workspaceName!;

  return true;
});
</script>

<style scoped lang="scss"></style>
