<template>
  <section
    class="h-9 px-2 flex items-center gap-2 rounded-md hover:bg-accent dark:hover:bg-accent/50 transition-colors [&>svg]:size-5"
    :class="{
      'bg-accent dark:bg-accent/50': selectedPrinter == data,
    }"
    :title="data"
    @click="selectPrinter(data)"
  >
    <span class="text-sm truncate">{{ data }}</span>
  </section>
</template>

<script setup lang="ts">
import { usePrinterStore } from '@/stores/printer';

const { selectedPrinter } = storeToRefs(usePrinterStore());
const { selectPrinter } = usePrinterStore();

defineProps<{
  data: string;
}>();
</script>

<style scoped lang="scss"></style>
