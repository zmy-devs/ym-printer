<template>
  <section class="flex flex-col gap-3 px-3">
    <Item v-for="item in printerTasks" :key="item.id" :data="item" />
  </section>
</template>

<script setup lang="ts">
import Item from './item.vue';
import { usePrinterTaskStore } from '@/stores/printer-task.store';

const { printerTasks } = storeToRefs(usePrinterTaskStore());
</script>

<style scoped lang="scss"></style>
