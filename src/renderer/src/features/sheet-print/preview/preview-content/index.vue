<template>
  <ScrollArea
    ref="scrollAreaRef"
    class="min-h-0"
    :view-class="
      cn('pb-10 *:flex *:items-center cursor-grab', {
        'cursor-grabbing': panning,
      })
    "
  >
    <PdfView @mousedown="handleMousedown" @mousemove="handleMousemove" />
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import PdfView from './pdg-view.vue';
import { usePdfStore } from '@/stores/pdf';
import { useEventListener } from '@vueuse/core';
import useMove from '@/hooks/use-move';
import { cn } from '@/lib/utils.js';

const { addScale, subScale } = usePdfStore();

//组件实例
const scrollAreaRef = useTemplateRef('scrollAreaRef');

const { panning, handleMousedown, handleMousemove } = useMove(
  () => scrollAreaRef.value?.viewportElement,
);

//处理鼠标滚轮
useEventListener(
  'wheel',
  (e: WheelEvent) => {
    if (!e.ctrlKey) {
      return;
    }

    e.preventDefault();

    e.deltaY < 0 ? addScale() : subScale();
  },
  {
    passive: false,
  },
);
</script>

<style scoped lang="scss"></style>
