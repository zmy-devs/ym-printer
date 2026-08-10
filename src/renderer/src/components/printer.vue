<template>
  <Select v-model="model">
    <SelectTrigger
      :class="`${variant == 'default' && 'shadow-none! border-none! ring-0! bg-transparent! hover:bg-accent/50! transition-colors'} ${$props.class}`"
    >
      <div class="flex items-center gap-2">
        <PrinterIcon v-if="iconVisible" />

        <SelectValue placeholder="请选择打印机" />
      </div>
    </SelectTrigger>

    <SelectContent>
      <SelectItem v-for="item in printers" :key="item" :value="item">
        {{ item }}
      </SelectItem>

      <Button variant="ghost" :disabled="refreshLock" @click="handleRefresh">
        <Spinner v-if="refreshLock" />

        <RotateCwIcon v-else />

        <span>重新获取打印机</span>
      </Button>
    </SelectContent>
  </Select>
</template>

<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { usePrinterStore } from '@/stores/printer';
import { PrinterIcon, RotateCwIcon } from '@lucide/vue';
import { Button } from './ui/button';
import { useLockFn } from '@/hooks/use-lock';
import { ClassValue } from 'clsx';

const { printers } = storeToRefs(usePrinterStore());
const { getPrinters } = usePrinterStore();

withDefaults(
  defineProps<{
    variant?: 'default' | 'outline';
    class?: ClassValue;
    iconVisible?: boolean;
  }>(),
  {
    variant: 'default',
    iconVisible: true,
  },
);

const model = defineModel<string>();

const [refreshLock, handleRefresh] = useLockFn(getPrinters);
</script>

<style scoped lang="scss"></style>
