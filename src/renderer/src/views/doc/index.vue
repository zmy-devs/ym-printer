<template>
  <section class="size-full min-h-0 relative flex flex-col">
    <DocHeader class="px-2 z-10" />

    <DocContent class="px-2 pb-2" v-if="selectedDocs.length" />

    <DocEmpty class="absolute inset-0" v-else />
  </section>
</template>

<script setup lang="ts">
import { useSelectionStore } from '@/stores/selection.store';
import DocHeader from './doc-header/index.vue';
import DocContent from './doc-content/index.vue';
import DocEmpty from './doc-empty.vue';

// 当前分类内的文档列表
const { selectedDocs } = storeToRefs(useSelectionStore());
</script>

<style scoped lang="scss"></style>
