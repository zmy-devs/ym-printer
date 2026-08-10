<template>
  <Tooltip :label="description" :shortcut="shortcut" side="right">
    <section
      class="h-8 px-2 flex items-center gap-2 rounded hover:bg-accent dark:hover:bg-accent/50 transition-colors"
      @click="$emit('click')"
    >
      <slot></slot>

      <span class="text-sm truncate">{{ label }}</span>
    </section>
  </Tooltip>
</template>

<script setup lang="ts">
import Tooltip from '@/components/tooltip.vue';

defineProps<{
  label: string;
  description?: string;
  shortcut?: string;
}>();

defineEmits<{
  click: [];
}>();
</script>

<style scoped lang="scss"></style>
