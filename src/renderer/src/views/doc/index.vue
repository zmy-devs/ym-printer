<template>
  <section class="size-full min-h-0 relative flex flex-col">
    <DocHeader class="shrink-0 z-10" />

    <DocEmpty v-if="selectedDocs.length == 0" />

    <DocContent v-else />
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
