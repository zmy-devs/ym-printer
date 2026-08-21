<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        :class="cn('w-fit max-w-full px-2!')"
        variant="ghost"
        size="sm"
        :title="selectedWorkspace?.name"
      >
        <BriefcaseIcon class="size-4 shrink-0" />

        <span class="truncate font-medium">
          {{ selectedWorkspace?.name }}
        </span>

        <ChevronsUpDownIcon class="size-3.5 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="start" class="w-60">
      <VueDraggable
        handle=".handle"
        ghost-class="opacity-0"
        chosen-class="bg-accent"
        :animation="200"
        :forceFallback="true"
        v-model="workspaceStore.workspaceIds"
      >
        <Item
          v-for="id in workspaceStore.workspaceIds"
          :key="id"
          :id="id"
          @click="handleSelect"
          @edit="handleEdit"
        />
      </VueDraggable>

      <DropdownMenuSeparator />

      <DropdownMenuItem @click="handleAdd">
        <PlusIcon />

        <span>新建工作空间</span>

        <DropdownMenuShortcut> Ctrl+Shift+N </DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import Item from './item.vue';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { useWorkspaceService } from '@/services/workspace.service';
import { useSelectionStore } from '@/stores/selection.store';
import { eventBus } from '@/utils/event-bus';
import { BriefcaseIcon, ChevronsUpDownIcon, PlusIcon } from '@lucide/vue';
import { VueDraggable } from 'vue-draggable-plus';
import { cancelCheckAll } from '@/views/doc/check';
import { cn } from '@/lib/utils.js';

// 工作空间实体状态
const workspaceStore = useWorkspaceStore();

// 工作空间业务能力
const workspaceService = useWorkspaceService();

// 当前工作空间
const { selectedWorkspace } = storeToRefs(useSelectionStore());

// 工作空间选择方法
const { selectWorkspace } = workspaceService;

// 处理工作空间选择
const handleSelect = (id: string) => {
  cancelCheckAll();
  selectWorkspace(id);
};

// 打开指定工作空间的编辑弹窗
const handleEdit = (id: string) => {
  // 待编辑的工作空间
  const workspace = workspaceStore.getWorkspace(id);

  if (!workspace) {
    return;
  }

  eventBus.emit('dialog-workspace:edit:show', workspace);
};

// 打开新建工作空间弹窗
const handleAdd = () => {
  eventBus.emit('dialog-workspace:add:show');
};
</script>

<style scoped lang="scss"></style>
