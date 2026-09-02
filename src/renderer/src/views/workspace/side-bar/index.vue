<template>
  <section class="flex flex-col bg-sidebar">
    <Header />

    <Group />

    <Separator />

    <Nav />
  </section>
</template>

<script setup lang="ts">
import { Separator } from '@/components/ui/separator';
import Group from './group/index.vue';
import Nav from './nav/index.vue';
import Header from './header.vue';
</script>

<style scoped lang="scss"></style>
