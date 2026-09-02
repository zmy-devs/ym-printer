<template>
  <DocContextMenu>
    <ScrollArea class="min-h-0 flex-1">
      <VueDraggable
        :class="cn($props.class, 'flex flex-col gap-2')"
        :animation="200"
        :force-fallback="true"
        ghost-class="opacity-0"
        v-model="selectedDocIds"
      >
        <div v-for="id in selectedDocIds" :key="id" :data-id="id">
          <ContentItem :id="id" />
        </div>
      </VueDraggable>
    </ScrollArea>
  </DocContextMenu>
</template>

<script setup lang="ts">
import { useSelectionStore } from '@/stores/selection.store';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContentItem from './content-item/index.vue';
import { VueDraggable } from 'vue-draggable-plus';
import { DocContextMenu } from '@/features/document';
import { cn } from '@/lib/utils';
import { ClassValue } from 'vue';

defineProps<{
  class?: ClassValue;
}>();

// 文档选择与排序状态
const selectionStore = useSelectionStore();

// 当前选中分组内的文档标识
const { selectedDocIds } = storeToRefs(selectionStore);
</script>

<style scoped lang="scss"></style>
