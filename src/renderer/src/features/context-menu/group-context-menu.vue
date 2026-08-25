<template>
  <ContextMenu>
    <ContextMenuTrigger as-child @contextmenu.stop="handleContextMenu">
      <slot />
    </ContextMenuTrigger>

    <ContextMenuContent class="min-w-60">
      <ContextMenuGroup>
        <ContextMenuItem @click="handleAdd">
          <PlusIcon />

          <span>新增文档</span>

          <ContextMenuShortcut>Ctrl+O</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>

      <ContextMenuGroup>
        <ContextMenuItem @click="handleEdit">
          <PencilLineIcon />

          <span>编辑组</span>

          <ContextMenuShortcut>Ctrl+E</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        <ContextMenuItem variant="destructive" @click="handleClear">
          <Trash2Icon />

          <span>删除组中全部文档</span>
        </ContextMenuItem>

        <ContextMenuItem
          variant="destructive"
          :disabled="!canRemoveGroup"
          @click="handleRemove"
        >
          <Trash2Icon />

          <span>删除组</span>
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>

<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { PencilLineIcon, PlusIcon, Trash2Icon } from '@lucide/vue';
import AlertDialog from '@/components/common/alert-dialog';
import { useGroupStore } from '@/stores/group.store';
import { eventBus } from '@/utils/event-bus';
import { useDocumentService } from '@/services/document.service';
import { useGroupService } from '@/services/group.service';

// 分组实体状态
const groupStore = useGroupStore();

// 分组业务能力
const groupService = useGroupService();

// 分组查询方法
const { getGroup } = groupStore;

// 文档业务能力
const { addDocs, clearGroupDocs } = useDocumentService();

// 当前右键菜单目标的分组标识
const groupId = ref('');

// 当前右键目标的分组数据
const group = computed(() => {
  return getGroup(groupId.value);
});

// 当前右键目标是否为唯一分组
const canRemoveGroup = computed(() => {
  return groupStore.groupIds.length > 1;
});

// 处理右键菜单目标
const handleContextMenu = (event: MouseEvent) => {
  // 触发右键菜单的组元素
  const target = (event.target as HTMLElement).closest<HTMLElement>(
    '[data-id]',
  );

  if (!target?.dataset.id) {
    event.preventDefault();
    return;
  }

  groupId.value = target.dataset.id;
};

// 处理新增文档
const handleAdd = () => {
  addDocs(groupId.value);
};

// 处理编辑分组
const handleEdit = () => {
  if (!group.value) {
    return;
  }

  eventBus.emit('dialog-group:edit:show', group.value);
};

// 处理清空分组文档
const handleClear = async () => {
  // 是否确认清空分组中的全部文档
  const confirmed = await AlertDialog.confirm({
    title: '删除组全部文档',
    description: `删除“${group.value?.name}”中的全部文档，是否确定？`,
    confirmButtonText: '删除',
  });

  if (!confirmed) {
    return;
  }

  clearGroupDocs(groupId.value);
};

// 处理删除分组
const handleRemove = async () => {
  if (!group.value) {
    return;
  }

  // 是否确认删除分组
  const res = await AlertDialog.confirm({
    title: `删除组`,
    description: `是否要删除组"${group.value.name}"？`,
  });

  if (!res) {
    return;
  }

  groupService.removeGroup(group.value.id);
};
</script>

<style scoped lang="scss"></style>
