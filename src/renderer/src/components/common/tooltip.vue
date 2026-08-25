<template>
  <Tooltip :disabled="!label || disabled">
    <TooltipTrigger as-child>
      <slot></slot>
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

defineProps<{
  label?: string;
  side?: 'right' | 'left' | 'top' | 'bottom';
  disabled?: boolean;
  shortcut?: string;
}>();
</script>
