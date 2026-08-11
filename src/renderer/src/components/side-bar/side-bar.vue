<template>
  <ScrollArea>
    <ul class="flex flex-col gap-1">
      <slot></slot>
    </ul>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '../ui/scroll-area';
</script>

<style scoped lang="scss"></style>

