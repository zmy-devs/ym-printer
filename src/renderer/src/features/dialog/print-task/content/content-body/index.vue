<template>
  <section class="flex flex-col">
    <Item v-for="item in printerTasks" :key="item.id" :data="item" />
  </section>
</template>

<script setup lang="ts">
import Item from './item.vue';
import { usePrinterTaskStore } from '@/stores/printer-task';

const { printerTasks } = storeToRefs(usePrinterTaskStore());
</script>

<style scoped lang="scss"></style>
