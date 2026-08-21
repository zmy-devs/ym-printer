<template>
  <section
    class="flex-center absolute inset-0 pointer-events-none z-9999 bg-black/30"
  >
    <Button>
      {{ label }}
    </Button>
  </section>
</template>

<script setup lang="ts">
import { Button } from './ui/button';

defineProps<{
  label: string;
}>();
</script>

<style scoped lang="scss"></style>
