<template>
  <div class="flex-1 flex flex-col relative">
    <ContentFooter />

    <ContentBody />
  </div>
</template>

<script setup lang="ts">
import ContentFooter from './content-footer/index.vue';
import ContentBody from './content-body/index.vue';
</script>

<style scoped lang="scss"></style>
