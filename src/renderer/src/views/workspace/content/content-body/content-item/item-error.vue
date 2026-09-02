<template>
  <ItemBase v-bind="$props" variant="destructive" />
</template>

<script setup lang="ts">
import type { Doc } from '@type';
import ItemBase from './item-base/index.vue';

// 加载失败的文档参数
defineProps<{
  data: Doc;
}>();
</script>

<style scoped lang="scss"></style>
