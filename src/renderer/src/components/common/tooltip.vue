<template>
  <Tooltip :disabled="!label || disabled">
    <TooltipTrigger as-child>
      <span :class="triggerClass">
        <slot></slot>
      </span>
    </TooltipTrigger>

    <TooltipContent :side="side">
      <span class="whitespace-pre-line">{{ label }}</span>

      <Kbd class="ml-2" v-if="shortcut">{{ shortcut }}</Kbd>
    </TooltipContent>
  </Tooltip>
</template>

<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Kbd } from '@/components/ui/kbd';
import type { ClassValue } from 'vue';

// Tooltip 组件入参
defineProps<{
  triggerClass?: ClassValue;
  label?: string;
  side?: 'right' | 'left' | 'top' | 'bottom';
  disabled?: boolean;
  shortcut?: string;
}>();
</script>

