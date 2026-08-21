<template>
  <SideBar view-class="py-2">
    <SideBarItem
      v-for="item in printers"
      :key="item"
      :is-active="selectedPrinter == item"
      :title="item"
      @click="handleSelectPrinter(item)"
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
import { usePrintTaskContext } from '../context';

// 打印机数据仓库
const printerStore = usePrinterStore();
// 可选择的打印机列表
const { printers } = storeToRefs(printerStore);
// 打印机任务弹窗共享状态
const { selectedPrinter, handleSelectPrinter } = usePrintTaskContext();
</script>

<style scoped lang="scss"></style>
