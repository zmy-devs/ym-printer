<template>
  <section class="flex flex-col bg-sidebar">
    <Workspace />

    <div class="py-2">
      <Separator />
    </div>

    <Nav />
  </section>
</template>

<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
import Workspace from './workspace/index.vue';
import Nav from './nav/index.vue';
</script>

<style scoped lang="scss"></style>
