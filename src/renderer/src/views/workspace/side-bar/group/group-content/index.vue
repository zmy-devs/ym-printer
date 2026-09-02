<template>
  <GroupContextMenu>
    <ScrollArea class="min-h-0 h-full" view-class="px-2 pb-2">
      <VueDraggable
        class="flex flex-col gap-1"
        :animation="200"
        ghost-class="opacity-0"
        chosen-class="bg-accent"
        :force-fallback="true"
        v-model="selectedGroupIds"
      >
        <Item
          v-for="id in selectedGroupIds"
          :key="id"
          :id="id"
          :is-selected="id === groupId"
          :data-id="id"
          @click="handleClick"
        />
      </VueDraggable>
    </ScrollArea>
  </GroupContextMenu>
</template>

<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import Item from './item.vue';
import { VueDraggable } from 'vue-draggable-plus';
import { GroupContextMenu } from '@/features/group';
import { useDocumentCheckContext } from '@/features/document';
import { useGroupService } from '@/services/group.service';
import { useSelectionStore } from '@/stores/selection.store';

// 当前功能范围的文档勾选操作
const { cancelCheckAll } = useDocumentCheckContext();

// 当前选中的分组标识
const { groupId } = storeToRefs(useSelectionStore());

// 分组选择与排序状态
const groupService = useGroupService();

// 当前分组排序
const { selectedGroupIds } = storeToRefs(useSelectionStore());

// 分组选择方法
const { selectGroup } = groupService;

// 处理分组选择
const handleClick = (id: string) => {
  cancelCheckAll();
  selectGroup(id);
};
</script>

<style lang="scss"></style>
