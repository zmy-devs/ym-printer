<template>
  <section class="flex flex-col gap-8">
    <FormField v-slot="{ componentField }" name="defaultPrinter">
      <FormItem>
        <FormLabel>默认打印机</FormLabel>

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
import Printer from '@/components/printer.vue';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { usePrinterStore } from '@/stores/printer';

const { selectPrinter } = usePrinterStore();

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      defaultPrinter: z
        .string({
          message: '请选择打印机',
        })
        .min(1, '请选择打印机'),
    }),
  ),
  initialValues: {
    defaultPrinter: '',
  },
});

const handleSubmit = form.handleSubmit((values) => {
  selectPrinter(values.defaultPrinter!);

  return true;
});
</script>

<style scoped lang="scss"></style>
