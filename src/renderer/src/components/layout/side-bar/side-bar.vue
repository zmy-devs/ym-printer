<template>
  <ScrollArea class="min-h-0 px-2">
    <ul :class="cn('flex flex-col gap-1')">
      <slot></slot>
    </ul>
  </ScrollArea>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
</script>

<style scoped lang="scss"></style>

