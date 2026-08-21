<template>
  <section class="flex flex-col bg-sidebar">
    <div class="px-2 pt-2">
      <SelectWorkspace />
    </div>

    <Group />

    <Separator />

    <Nav />
  </section>
</template>

<script setup lang="ts">
import SelectWorkspace from '@/components/select-workspace/index.vue';
import { Separator } from '@/components/ui/separator';
import Group from './group/index.vue';
import Nav from './nav/index.vue';
</script>

<style scoped lang="scss"></style>
