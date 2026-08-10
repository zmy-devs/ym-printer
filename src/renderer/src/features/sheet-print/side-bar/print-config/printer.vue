<template>
  <FormField v-slot="{ componentField }" name="printer">
    <FormItem>
      <FormLabel>打印机</FormLabel>

      <FormControl>
        <Select v-bind="componentField">
          <SelectTrigger class="min-w-0 w-full bg-transparent!">
            <SelectValue placeholder="请选择打印机" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem v-for="item in printers" :key="item" :value="item">
              {{ item }}
            </SelectItem>
          </SelectContent>
        </Select>
      </FormControl>

      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePrinterStore } from '@/stores/printer';

const { printers } = storeToRefs(usePrinterStore());
</script>

<style scoped lang="scss"></style>
