<template>
  <component :is="itemMap[data.status]" :data="data" v-if="data" />
</template>

<script setup lang="ts">
import type { DocStatus } from '@type';
import type { Component } from 'vue';
import ItemError from './item-error.vue';
import ItemReady from './item-ready.vue';
import { useDocStore } from '@/stores/doc.store';

// 文档状态对应的展示组件
const itemMap: Record<DocStatus, Component> = {
  loading: ItemReady,
  ready: ItemReady,
  error: ItemError,
};

// 文档状态组件参数
const props = defineProps<{
  id: string;
}>();

const { getDoc } = useDocStore();

const data = computed(() => {
  return getDoc(props.id);
});
</script>

<style scoped lang="scss"></style>
