<template>
  <Tooltip :label="tooltipLabel" side="right">
    <DropdownMenuItem class="group" @click="$emit('click', id)">
      <BriefcaseIcon class="size-4 group-hover:hidden" />

      <GripVerticalIcon
        class="handle size-4 hidden cursor-grab active:cursor-grabbing group-hover:block pointer-events-auto! text-muted-foreground"
      />

      <span class="mr-auto truncate">{{ workspace.name }}</span>

      <CheckIcon class="size-4 group-hover:hidden" v-if="workspaceId === id" />

      <PencilLineIcon
        class="size-3.5 hidden cursor-pointer pointer-events-auto! group-hover:block"
        @click.stop="$emit('edit', id)"
      />
    </DropdownMenuItem>
  </Tooltip>
</template>

<script setup lang="ts">
import Tooltip from '@/components/tooltip.vue';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useDocumentService } from '@/services/document.service';
import { useSelectionStore } from '@/stores/selection.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import {
  BriefcaseIcon,
  CheckIcon,
  GripVerticalIcon,
  PencilLineIcon,
} from '@lucide/vue';

const props = defineProps<{
  id: string;
}>();

defineEmits<{
  click: [id: string];
  edit: [id: string];
}>();

// 工作空间状态
const workspaceStore = useWorkspaceStore();
// 当前浏览的工作空间标识
const { workspaceId } = storeToRefs(useSelectionStore());

// 工作空间查询方法
const { getWorkspace } = workspaceStore;

// 文档查询方法
const { getWorkspaceDocs } = useDocumentService();

const workspace = computed(() => {
  return getWorkspace(props.id);
});

const tooltipLabel = computed(() => {
  // 当前工作空间内的文档数量
  const documentCount = getWorkspaceDocs(workspace.value.id).length;

  // 当前工作空间内的分组数量
  const groupCount = workspaceStore.getWorkspaceGroupIds(
    workspace.value.id,
  ).length;

  return `共 ${groupCount} 个组，${documentCount} 个文档`;
});
</script>

<style scoped lang="scss"></style>
