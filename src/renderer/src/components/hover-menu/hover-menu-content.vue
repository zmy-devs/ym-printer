<template>
  <DropdownMenuContent
    v-bind="{ ...$attrs, ...forwarded }"
    @mouseenter="hoverMenu.handleCancelClose"
    @mouseleave="hoverMenu.handleClose"
  >
    <slot />
  </DropdownMenuContent>
</template>

<script setup lang="ts">
import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { useHoverMenuContext } from './context';
import { useForwardPropsEmits } from 'reka-ui';
import type {
  DropdownMenuContentEmits,
  DropdownMenuContentProps,
} from 'reka-ui';
import type { HTMLAttributes } from 'vue';

defineOptions({
  inheritAttrs: false,
});

// DropdownMenuContent 原生参数与样式参数
const props = defineProps<
  DropdownMenuContentProps & {
    class?: HTMLAttributes['class'];
  }
>();

// DropdownMenuContent 原生事件
const emits = defineEmits<DropdownMenuContentEmits>();

// 透传给 DropdownMenuContent 的参数和事件
const forwarded = useForwardPropsEmits(props, emits);

// 当前 HoverMenu 的悬浮控制方法
const hoverMenu = useHoverMenuContext();
</script>

<style scoped lang="scss"></style>
