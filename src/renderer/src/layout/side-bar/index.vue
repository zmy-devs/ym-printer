<template>
  <section class="flex flex-col bg-sidebar">
    <div class="h-10 shrink-0" />

    <Group />

    <Separator />

    <Nav />
  </section>
</template>

<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
import Group from './group/index.vue';
import Nav from './nav/index.vue';
</script>

<style scoped lang="scss"></style>
