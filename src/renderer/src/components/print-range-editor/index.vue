<template>
  <section class="flex flex-col rounded-md border p-1 shadow">
    <InputGroup
      v-for="(item, index) in modelValue"
      :key="index"
      class="h-8 rounded-sm border-0 shadow-none ring-0! dark:bg-transparent"
    >
      <InputGroupInput
        ref="inputRefs"
        placeholder="例如 1-、-1、-3--1"
        :model-value="item.range"
        @update:model-value="handleRangeChange(index, $event)"
        @blur="$emit('blur', $event)"
        @keydown.enter.prevent="handleEnter($event, index)"
        @keydown.backspace="handleBackspace($event, index)"
        @keydown.up="handleArrow($event, index - 1)"
        @keydown.down="handleArrow($event, index + 1)"
      />

      <PrintRangeMode
        :model-value="item.mode"
        @update:model-value="handleModeChange(index, $event)"
      />
    </InputGroup>
  </section>
</template>

<script setup lang="ts">
import type { PrintRange } from '@type';
import PrintRangeMode from './mode.vue';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';

// 打印范围编辑器的双向绑定值
const modelValue = defineModel<PrintRange[]>({ required: true });

// 编辑器失焦事件
const emit = defineEmits<{
  blur: [event: FocusEvent];
}>();

// 按范围行顺序收集的输入组件实例
const inputRefs = useTemplateRef('inputRefs');

// 创建空白的单面打印范围
const createEmptyRange = () => {
  return { range: '', mode: 'simplex' } satisfies PrintRange;
};

// 更新指定行的打印范围文本
const handleRangeChange = (index: number, range: string | number) => {
  modelValue.value = modelValue.value.map((item, itemIndex) => {
    return itemIndex === index ? { ...item, range: String(range) } : item;
  });
};

// 更新指定行的单双面打印模式
const handleModeChange = (index: number, mode: PrintRange['mode']) => {
  modelValue.value = modelValue.value.map((item, itemIndex) => {
    return itemIndex === index ? { ...item, mode } : item;
  });
};

// 聚焦指定范围输入框并恢复光标位置
const focusInput = async (index: number, cursorPosition?: number | 'end') => {
  await nextTick();

  // 目标范围输入组件
  const input = inputRefs.value?.[index];

  if (!input) {
    return;
  }

  input.focus();

  if (cursorPosition !== undefined) {
    input.setCursor(cursorPosition);
  }
};

// 在当前范围后插入空白范围
const handleEnter = async (_event: KeyboardEvent, index: number) => {
  modelValue.value = [
    ...modelValue.value.slice(0, index + 1),
    createEmptyRange(),
    ...modelValue.value.slice(index + 1),
  ];

  await focusInput(index + 1);
};

// 删除空范围并保留至少一项
const handleBackspace = async (event: KeyboardEvent, index: number) => {
  // 当前范围项
  const item = modelValue.value[index];

  if (modelValue.value.length <= 1 || item?.range) {
    return;
  }

  event.preventDefault();
  modelValue.value = modelValue.value.filter((_, itemIndex) => {
    return itemIndex !== index;
  });

  await focusInput(Math.max(index - 1, 0));
};

// 使用上下方向键切换相邻范围输入框
const handleArrow = async (event: KeyboardEvent, targetIndex: number) => {
  if (targetIndex < 0 || targetIndex >= modelValue.value.length) {
    return;
  }

  event.preventDefault();

  // 当前输入框中的光标位置
  const input = event.target;
  const cursorPosition =
    input instanceof HTMLInputElement &&
    input.selectionStart === input.value.length
      ? 'end'
      : input instanceof HTMLInputElement
        ? (input.selectionStart ?? 0)
        : 0;

  await focusInput(targetIndex, cursorPosition);
};
</script>

<style scoped lang="scss"></style>
