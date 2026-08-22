<template>
  <ScrollArea
    ref="scrollAreaRef"
    class="flex-1 min-h-0 ring-0"
    :view-class="
      cn('pt-1 pb-10 *:flex *:items-center cursor-grab', {
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
import { usePdfStore } from '@/stores/pdf.store';
import { useEventListener } from '@vueuse/core';
import useMove from '@/hooks/use-move';
import { cn } from '@/lib/utils.js';

// PDF 缩放控制能力
const { addScale, subScale } = usePdfStore();

// 滚动区域组件实例
const scrollAreaRef = useTemplateRef('scrollAreaRef');

// PDF 预览拖拽控制能力
const { panning, handleMousedown, handleMousemove } = useMove(
  () => scrollAreaRef.value?.viewportElement,
);

// 处理鼠标滚轮缩放
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
