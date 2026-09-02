<template>
  <section class="h-11 flex items-center shrink-0">
    <HeaderCheck v-if="isChecking" />

    <HeaderDefault v-else />
  </section>
</template>

<script setup lang="ts">
import HeaderCheck from './header-check.vue';
import HeaderDefault from './header-default.vue';
import { useDocumentCheckContext } from '@/features/document';

// 当前功能范围的文档选择状态
const { isChecking } = useDocumentCheckContext();
</script>

<style scoped lang="scss"></style>
