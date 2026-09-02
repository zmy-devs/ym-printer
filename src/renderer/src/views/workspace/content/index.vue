<template>
  <section class="size-full min-h-0 relative flex flex-col">
    <ContentHeader class="px-2 z-10" />

    <ContentBody class="px-3 pb-2" v-if="selectedDocs.length" />

    <ContentEmpty class="absolute inset-0" v-else />
  </section>
</template>

<script setup lang="ts">
import { useSelectionStore } from '@/stores/selection.store';
import ContentHeader from './content-header/index.vue';
import ContentBody from './content-body/index.vue';
import ContentEmpty from './content-empty.vue';

// 当前分类内的文档列表
const { selectedDocs } = storeToRefs(useSelectionStore());
</script>

<style scoped lang="scss"></style>
