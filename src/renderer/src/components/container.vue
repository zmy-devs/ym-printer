<template>
  <ScrollArea
    class="min-h-0"
    :view-class="cn($attrs.class, 'w-[85%] mx-auto py-8 border-none')"
  >
    <slot></slot>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
</script>

<style scoped lang="scss"></style>
