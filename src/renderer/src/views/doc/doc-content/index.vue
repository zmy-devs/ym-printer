<template>
  <DocContextMenu>
    <ScrollArea class="min-h-0 flex-1">
      <VueDraggable
        v-if="selectedGroup"
        class="flex flex-col gap-3 px-3"
        :animation="200"
        :force-fallback="true"
        ghost-class="opacity-0"
        v-model="selectedDocIds"
      >
        <ContentItem v-for="id in selectedDocIds" :key="id" :id="id" />
      </VueDraggable>
    </ScrollArea>
  </DocContextMenu>
</template>

<script setup lang="ts">
import { useSelectionStore } from '@/stores/selection.store';
import { ScrollArea } from '@/components/ui/scroll-area';
import ContentItem from './content-item/index.vue';
import { VueDraggable } from 'vue-draggable-plus';
import DocContextMenu from '@/features/context-menu/doc-context-menu.vue';

// 当前选中的分组
const { selectedGroup, selectedDocIds } = storeToRefs(useSelectionStore());
</script>

<style scoped lang="scss"></style>
