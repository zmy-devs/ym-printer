<template>
  <section class="flex flex-col gap-8">
    <Field
      name="workspaceName"
      label="工作空间名称"
      v-slot="{ componentField }"
    >
      <Input placeholder="请输入工作空间名称" v-bind="componentField" />
    </Field>

    <Field
      name="workspacePrinter"
      label="工作空间打印机"
      v-slot="{ componentField }"
    >
      <SelectPrinter
        class="w-full"
        variant="outline"
        :iconVisible="false"
        v-bind="componentField"
      />
    </Field>
  </section>

  <slot :handleSubmit="handleSubmit" />
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import SelectPrinter from '@/components/select-printer.vue';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useWorkspaceService } from '@/services/workspace.service';
import Field from '@/components/field.vue';

// 工作空间创建能力
const { createWorkspace } = useWorkspaceService();

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      workspaceName: z
        .string({
          message: '请输入名称',
        })
        .min(1, '请输入名称'),
      workspacePrinter: z
        .string({
          message: '请选择打印机',
        })
        .min(1, '请选择打印机'),
    }),
  ),
  initialValues: {
    workspaceName: '默认工作空间',
    workspacePrinter: '',
  },
});

const handleSubmit = form.handleSubmit((values) => {
  createWorkspace({
    name: values.workspaceName!,
    printer: values.workspacePrinter!,
  });

  return true;
});
</script>

<style scoped lang="scss"></style>
