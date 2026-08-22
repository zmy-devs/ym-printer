<template>
  <section class="relative flex flex-col">
    <Header class="border-b bg-sidebar" />

    <Content class="h-full border-l" />
  </section>
</template>

<script setup lang="ts">
import Header from './header/index.vue';
import Content from './content/index.vue';
</script>

<style scoped lang="scss"></style>
