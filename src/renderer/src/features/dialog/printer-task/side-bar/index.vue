<template>
  <SideBar view-class="py-2">
    <SideBarItem
      v-for="item in printers"
      :key="item"
      :is-active="props.selectedPrinter == item"
      :title="item"
      @click="handleSelect(item)"
    >
      <PrinterIcon />

      <span>{{ item }}</span>
    </SideBarItem>
  </SideBar>
</template>

<script setup lang="ts">
import { SideBar, SideBarItem } from '@/components/side-bar';
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
// 可选择的打印机列表
const { printers } = storeToRefs(printerStore);

// 处理打印机选择
const handleSelect = (printer: string) => {
  emit('select', printer);
};
</script>

<style scoped lang="scss"></style>
