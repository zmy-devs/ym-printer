<template>
  <section class="min-h-0 flex-1 flex flex-col gap-2">
    <GroupHeader />

    <GroupContent />
  </section>
</template>

<script setup lang="ts">
import GroupHeader from './group-header.vue';
import GroupContent from './group-content/index.vue';
</script>

<style scoped lang="scss"></style>
