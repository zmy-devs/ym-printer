<template>
  <ScrollArea>
    <div class="px-2 flex flex-col gap-1">
      <Item v-for="item in printers" :key="item" :data="item" />
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePrinterStore } from '@/stores/printer';
import Item from './item.vue';

const { printers } = storeToRefs(usePrinterStore());
</script>

<style scoped lang="scss"></style>
