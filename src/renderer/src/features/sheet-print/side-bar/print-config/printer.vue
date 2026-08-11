<template>
  <Field
    name="printer"
    label="打印机"
    :icon="PrinterIcon"
    v-slot="{ componentField }"
  >
    <Select v-bind="componentField">
      <SelectTrigger class="min-w-0 w-full">
        <SelectValue placeholder="请选择打印机" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem v-for="item in printers" :key="item" :value="item">
          {{ item }}
        </SelectItem>
      </SelectContent>
    </Select>
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/field.vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePrinterStore } from '@/stores/printer';
import { PrinterIcon } from '@lucide/vue';

const { printers } = storeToRefs(usePrinterStore());
</script>

<style scoped lang="scss"></style>
