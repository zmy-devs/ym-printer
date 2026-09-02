<template>
  <section class="flex flex-col relative">
    <ContentHeader class="px-2 py-1.5 z-10" />

    <ContentBody class="px-2" v-if="printerTasks.length" />

    <ContentEmpty class="absolute inset-0" v-else />
  </section>
</template>

<script setup lang="ts">
import ContentHeader from './content-header/index.vue';
import ContentBody from './content-body/index.vue';
import ContentEmpty from './content-empty.vue';
import { usePrintTaskContext } from '../context';

// 当前打印机任务队列的数据
const { printerTasks } = usePrintTaskContext();
</script>

<style scoped lang="scss"></style>
