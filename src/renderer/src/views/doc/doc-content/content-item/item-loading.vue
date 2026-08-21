<template>
  <ItemBase v-bind="$props" class="disabled">
    <template #icon>
      <Spinner class="size-4 text-muted-foreground" />
    </template>
  </ItemBase>
</template>

<script setup lang="ts">
import ItemBase from './item-base/index.vue';
import { Spinner } from '@/components/ui/spinner';
import type { Doc } from '@type';

// 非就绪文档参数
const props = defineProps<{
  data: Doc;
}>();
</script>

<style scoped lang="scss"></style>
