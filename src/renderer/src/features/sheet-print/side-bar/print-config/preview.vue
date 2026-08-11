<template>
  <SegmentedControl class="w-full" v-model="viewMode">
    <SegmentedControlItem
      class="flex-1"
      v-for="item in Object.keys(viewMap)"
      :key="item"
      :value="item"
    >
      {{ viewMap[item] }}
    </SegmentedControlItem>
  </SegmentedControl>
</template>

<script setup lang="ts">
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/components/segmented-control';
import { viewMap } from '@/map';
import { usePdfStore } from '@/stores/pdf';

// 当前预览模式
const { viewMode } = storeToRefs(usePdfStore());
</script>

<style scoped lang="scss"></style>
