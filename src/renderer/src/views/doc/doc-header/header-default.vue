<template>
  <section class="flex gap-2">
    <Printer v-model="selectedWorkspace.printer" />
  </section>
</template>

<script setup lang="ts">
import Printer from '@/components/printer.vue';
import { useWorkspaceStore } from '@/stores/workspace';

const { selectedWorkspace } = storeToRefs(useWorkspaceStore());
</script>

<style scoped lang="scss"></style>
