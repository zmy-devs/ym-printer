<template>
  <Select v-model="model">
    <SelectTrigger
      :class="
        cn($props.class, {
          'shadow-none! border-none! ring-0! bg-transparent! hover:bg-accent/50! transition-colors':
            variant === 'default',
        })
      "
    >
      <div class="flex items-center gap-2">
        <PrinterIcon v-if="iconVisible" />

        <SelectValue :class="valueClass" placeholder="请选择打印机" />
      </div>
    </SelectTrigger>

    <SelectContent>
      <SelectItem v-for="item in printers" :key="item" :value="item">
        <PrinterIcon />

        {{ item }}
      </SelectItem>

      <SelectSeparator />

      <Button
        class="w-full justify-start dark:hover:bg-accent"
        variant="ghost"
        size="sm"
        :disabled="refreshLock"
        @click="handleRefresh"
      >
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
  SelectSeparator,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { usePrinterStore } from '@/stores/printer.store';
import { PrinterIcon, RotateCwIcon } from '@lucide/vue';
import { Button } from './ui/button';
import { useLockFn } from '@/hooks/use-lock';
import type { ClassValue } from 'clsx';
import { cn } from '@/lib/utils';

// 可选择的打印机列表
const { printers } = storeToRefs(usePrinterStore());
// 打印机列表刷新方法
const { getPrinters } = usePrinterStore();

// 打印机选择器展示配置
withDefaults(
  defineProps<{
    variant?: 'default' | 'outline';
    class?: ClassValue;
    valueClass?: ClassValue;
    iconVisible?: boolean;
  }>(),
  {
    variant: 'default',
    iconVisible: true,
  },
);

// 当前选中的打印机
const model = defineModel<string>();

// 防止重复刷新的锁定状态和处理方法
const [refreshLock, handleRefresh] = useLockFn(getPrinters);
</script>

<style scoped lang="scss"></style>
