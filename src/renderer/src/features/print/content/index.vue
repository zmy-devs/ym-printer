<template>
  <div class="flex-1 flex flex-col relative">
    <ContentLoading v-if="selectedDoc?.status === 'loading'" />

    <ContentError v-else-if="selectedDoc?.status === 'error'" />

    <ContentBody v-else />

    <ContentFooter />
  </div>
</template>

<script setup lang="ts">
import ContentFooter from './content-footer/index.vue';
import ContentBody from './content-body/index.vue';
import ContentLoading from './content-loading.vue';
import ContentError from './content-error.vue';
import { useSelectionStore } from '@/stores/selection.store';

// 当前待打印文档
const { selectedDoc } = storeToRefs(useSelectionStore());
</script>

<style scoped lang="scss"></style>
