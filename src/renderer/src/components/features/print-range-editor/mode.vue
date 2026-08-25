<template>
  <InputGroupAddon align="inline-end" class="gap-1">
    <InputGroupButton
      v-for="[mode, label] in printRangeModes"
      :key="mode"
      class="cursor-pointer text-xs"
      :variant="modelValue === mode ? 'default' : 'ghost'"
      @click="modelValue = mode"
    >
      {{ label }}
    </InputGroupButton>
  </InputGroupAddon>
</template>

<script setup lang="ts">
import type { PrintRangeMode } from '@type';
import { printRangeModeMap } from '@/map';
import { InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';

// 打印范围单双面模式的双向绑定值
const modelValue = defineModel<PrintRangeMode>({ required: true });

// 可选打印模式及其展示名称
const printRangeModes = Object.entries(printRangeModeMap) as [
  PrintRangeMode,
  string,
][];
</script>

<style scoped lang="scss"></style>
