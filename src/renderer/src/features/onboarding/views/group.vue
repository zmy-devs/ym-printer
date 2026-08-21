<template>
  <section class="flex flex-col gap-8">
    <Field name="groupName" label="组名称" v-slot="{ componentField }">
      <Input placeholder="请输入组名称" v-bind="componentField" />
    </Field>

    <Field name="groupPrinter" label="组打印机" v-slot="{ componentField }">
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
import { useGroupService } from '@/services/group.service';
import Field from '@/components/field.vue';

// 分组创建能力
const { createGroup } = useGroupService();

// 首个分组创建表单
const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      groupName: z
        .string({
          message: '请输入名称',
        })
        .min(1, '请输入名称'),
      groupPrinter: z
        .string({
          message: '请选择打印机',
        })
        .min(1, '请选择打印机'),
    }),
  ),
  initialValues: {
    groupName: '默认组',
    groupPrinter: '',
  },
});

// 提交首个分组创建表单
const handleSubmit = form.handleSubmit((values) => {
  createGroup({
    name: values.groupName!,
    printer: values.groupPrinter!,
  });

  return true;
});
</script>

<style scoped lang="scss"></style>
