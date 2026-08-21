<template>
  <section class="h-12 px-3 flex items-center gap-2">
    <HeaderCheck v-if="isChecking" />

    <HeaderDefault v-else />
  </section>
</template>

<script setup lang="ts">
import HeaderCheck from './header-check.vue';
import HeaderDefault from './header-default.vue';
import { isChecking } from '../check';
</script>

<style scoped lang="scss"></style>
