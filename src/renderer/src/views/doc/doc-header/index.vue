<template>
  <section class="h-11 flex items-center shrink-0">
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
