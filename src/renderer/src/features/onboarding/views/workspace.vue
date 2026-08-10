<template>
  <section class="flex flex-col gap-8">
    <FormField v-slot="{ componentField }" name="workspaceName">
      <FormItem>
        <FormLabel>工作空间名称</FormLabel>

        <FormControl>
          <Input placeholder="请输入工作空间名称" v-bind="componentField" />
        </FormControl>

        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="workspacePrinter">
      <FormItem>
        <FormLabel>工作空间打印机</FormLabel>

        <FormControl>
          <Printer
            class="w-full"
            variant="outline"
            :iconVisible="false"
            v-bind="componentField"
          />
        </FormControl>

        <FormMessage />
      </FormItem>
    </FormField>
  </section>

  <slot :handleSubmit="handleSubmit" />
</template>

<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Printer from '@/components/printer.vue';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useWorkspaceStore } from '@/stores/workspace';
import { usePrinterStore } from '@/stores/printer';

const { selectedPrinter } = storeToRefs(usePrinterStore());
const { firstAddWorkspace } = useWorkspaceStore();

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
    workspacePrinter: selectedPrinter.value || '',
  },
});

const handleSubmit = form.handleSubmit((values) => {
  firstAddWorkspace({
    name: values.workspaceName!,
    printer: values.workspacePrinter!,
  });

  return true;
});
</script>

<style scoped lang="scss"></style>
