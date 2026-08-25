<template>
  <SideBar view-class="py-2">
    <SideBarItem
      v-for="printerName in printerOrder"
      :key="printerName"
      :is-active="props.selectedPrinter == printerName"
      :title="printerName"
      @click="handleSelect(printerName)"
    >
      <PrinterIcon />

      <span>{{ printerName }}</span>
    </SideBarItem>
  </SideBar>
</template>

<script setup lang="ts">
import { SideBar, SideBarItem } from '@/components/layout/side-bar';
import { usePrinterStore } from '@/stores/printer.store';
import { PrinterIcon } from '@lucide/vue';

// 打印机选择状态与事件
const props = defineProps<{
  selectedPrinter: string;
}>();

// 打印机选择事件
const emit = defineEmits<{
  select: [printer: string];
}>();

// 打印机数据仓库
const printerStore = usePrinterStore();
// 可选择的打印机展示顺序
const { printerOrder } = storeToRefs(printerStore);

// 处理打印机选择
const handleSelect = (printerName: string) => {
  emit('select', printerName);
};
</script>

<style scoped lang="scss"></style>
