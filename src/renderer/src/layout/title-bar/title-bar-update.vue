<template>
  <Button
    class="h-6.5 px-2.5"
    size="xs"
    @click="installUpdate"
    v-if="status == 'downloaded'"
  >
    <span class="text-xs">更新</span>
  </Button>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { useUpdateStore } from '@/stores/update';

const updateStore = useUpdateStore();

const { status } = storeToRefs(updateStore);
const { installUpdate } = updateStore;
</script>

<style scoped lang="scss"></style>
