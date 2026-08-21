<template>
  <DropdownMenuTrigger
    v-bind="forwardedProps"
    @mouseenter="hoverMenu.handleOpen"
    @mouseleave="hoverMenu.handleScheduleClose"
  >
    <slot />
  </DropdownMenuTrigger>
</template>

<script setup lang="ts">
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useHoverMenuContext } from './context';
import { useForwardProps } from 'reka-ui';
import type { DropdownMenuTriggerProps } from 'reka-ui';

// DropdownMenuTrigger 原生参数
const props = defineProps<DropdownMenuTriggerProps>();

// 透传给 DropdownMenuTrigger 的参数
const forwardedProps = useForwardProps(props);

// 当前 HoverMenu 的悬浮控制方法
const hoverMenu = useHoverMenuContext();
</script>

<style scoped lang="scss"></style>
