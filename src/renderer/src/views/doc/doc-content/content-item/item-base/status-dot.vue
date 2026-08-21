<template>
  <span :class="statusDotVariants({ variant })"></span>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority';

// 状态点显示参数
defineProps<{
  variant?: 'success' | 'warn' | 'error';
}>();

// 状态点的语义样式配置
const statusDotVariants = cva('size-2 rounded-full', {
  variants: {
    variant: {
      success: 'bg-green-500',
      warn: 'bg-yellow-500',
      error: 'bg-red-500',
    },
  },
  defaultVariants: {
    variant: 'success',
  },
});
</script>

<style scoped lang="scss"></style>
