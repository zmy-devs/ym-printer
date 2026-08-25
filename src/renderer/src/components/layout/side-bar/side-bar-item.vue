<template>
  <li
    class="w-full h-8 p-2 flex items-center gap-2 rounded-md text-sm [&>span:last-child]:truncate [&>svg]:size-4.5 [&>svg]:shrink-0 hover:bg-accent/60 transition-colors"
    :class="{
      'bg-accent/80!': isActive,
    }"
  >
    <slot></slot>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  isActive?: boolean;
}>();
</script>

<style scoped lang="scss"></style>
