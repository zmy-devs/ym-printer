<template>
  <section class="px-2 pb-2 flex flex-col bg-sidebar">
    <Workspace />

    <div class="-mx-2 py-2">
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
