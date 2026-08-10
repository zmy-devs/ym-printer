<template>
  <div
    data-slot="skeleton"
    :class="cn('animate-pulse rounded-md bg-primary/10', props.class)"
  />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

// 骨架屏的样式入参
const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<style scoped lang="scss"></style>
