<template>
  <ScrollArea class="min-h-0">
    <div :class="cn($props.class, 'flex flex-col gap-3')">
      <Item v-for="item in printerTasks" :key="item.id" :data="item" />
    </div>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import Item from './item.vue';
import { usePrintTaskContext } from '../../context';
import { ClassValue } from 'vue';
import { cn } from '@/lib/utils.js';

defineProps<{
  class?: ClassValue;
}>();

// 当前打印机任务队列的数据
const { printerTasks } = usePrintTaskContext();
</script>

<style scoped lang="scss"></style>
