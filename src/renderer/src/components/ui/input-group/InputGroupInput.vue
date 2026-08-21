<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

// 原生输入组件实例
const inputRef = useTemplateRef('inputRef');

// 聚焦原生输入框
const focus = () => {
  const input = inputRef.value?.$el as HTMLInputElement;

  input.focus();
};

// 设置原生输入框的光标位置
const setCursor = (cursorPosition: number | 'end') => {
  const input = inputRef.value?.$el as HTMLInputElement;

  // 受输入内容长度约束的实际光标位置
  const position =
    cursorPosition === 'end'
      ? input.value.length
      : Math.min(cursorPosition, input.value.length);

  input.setSelectionRange(position, position);
};

defineExpose({ focus, setCursor });
</script>

<template>
  <Input
    ref="inputRef"
    data-slot="input-group-control"
    :class="
      cn(
        'flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent',
        props.class,
      )
    "
  />
</template>
