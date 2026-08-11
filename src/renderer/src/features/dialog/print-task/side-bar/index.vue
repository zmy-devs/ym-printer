<template>
  <SideBar view-class="py-2">
    <SideBarItem
      v-for="item in printers"
      :key="item"
      :is-active="selectedPrinter == item"
      :title="item"
      @click="selectPrinter(item)"
    >
      <PrinterIcon />

      <span>{{ item }}</span>
    </SideBarItem>
  </SideBar>
</template>

<script setup lang="ts">
import { SideBar, SideBarItem } from '@/components/side-bar';
import { usePrinterStore } from '@/stores/printer';
import { PrinterIcon } from '@lucide/vue';

const printerStore = usePrinterStore();

const { printers, selectedPrinter } = storeToRefs(printerStore);
const { selectPrinter } = printerStore;
</script>

<style scoped lang="scss"></style>
