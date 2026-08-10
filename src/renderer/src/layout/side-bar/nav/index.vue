<template>
  <section class="px-2 flex flex-col gap-1">
    <NavItem
      label="打印机任务队列"
      description="打开打印机队列"
      @click="handlePrintTask"
    >
      <PrinterIcon class="size-4.5" />
    </NavItem>

    <NavItem
      label="打印范围预设"
      description="打开打印范围预设"
      @click="handlePreset"
    >
      <ClipboardListIcon class="size-4.5" />
    </NavItem>

    <NavItem label="价格" description="打开价格设置" @click="handlePrice">
      <CircleDollarSignIcon class="size-4.5" />
    </NavItem>

    <NavItem label="设置" description="打开设置 Ctrl+," @click="handleSettings">
      <SettingsIcon class="size-4.5" />
    </NavItem>
  </section>
</template>

<script setup lang="ts">
import {
  CircleDollarSignIcon,
  ClipboardListIcon,
  PrinterIcon,
  SettingsIcon,
} from '@lucide/vue';
import NavItem from './nav-item.vue';
import { eventBus } from '@/utils/event-bus';

//打开打印机任务队列
const handlePrintTask = () => {
  eventBus.emit('dialog-print-task:show');
};

//打开打印范围预设
const handlePreset = () => {
  eventBus.emit('dialog-preset:show');
};

//打开打印范围预设
const handlePrice = () => {
  eventBus.emit('dialog-setting:show', 'price');
};

//打开设置
const handleSettings = () => {
  eventBus.emit('dialog-setting:show');
};
</script>

<style scoped lang="scss"></style>
