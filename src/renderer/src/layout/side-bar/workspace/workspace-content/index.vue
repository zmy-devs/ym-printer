<template>
  <ScrollArea class="min-h-0 h-full">
    <ContextMenu>
      <ContextMenuTrigger as-child>
        <VueDraggable
          class="flex flex-col gap-1"
          :animation="200"
          v-model="workspace"
        >
          <Item
            v-for="item in workspace"
            :key="item.id"
            :data="item"
            @contextmenu="handleContextmenu(item)"
          />
        </VueDraggable>
      </ContextMenuTrigger>

      <ContextMenuContent class="min-w-60">
        <ContextMenuItem @click="handleAdd">
          <PlusIcon />

          <span> 新增文档 </span>

          <ContextMenuShortcut>Ctrl+O</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem @click="handleEdit">
          <PencilLineIcon />

          <span> 编辑 </span>

          <ContextMenuShortcut>Ctrl+E</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem variant="destructive" @click="handleRemoveDocs">
          <Trash2Icon />

          <span> 删除 "工作区中所有文档"</span>
        </ContextMenuItem>

        <ContextMenuItem
          :disabled="selectedItem!.id == 'default'"
          variant="destructive"
          @click="handleRemove"
        >
          <Trash2Icon />

          <span> 删除 "当前工作区"</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  </ScrollArea>
</template>

<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuShortcut,
} from '@/components/ui/context-menu';
import { PlusIcon, PencilLineIcon, Trash2Icon } from '@lucide/vue';
import { ScrollArea } from '@/components/ui/scroll-area';
import Item from './item.vue';
import { useWorkspaceStore, Workspace } from '@/stores/workspace';
import { VueDraggable } from 'vue-draggable-plus';
import { useDocStore } from '@/stores/doc.js';
import { eventBus } from '@/utils/event-bus.js';

const { workspace } = storeToRefs(useWorkspaceStore());
const { removeWorkspace } = useWorkspaceStore();
const { clearDoc } = useDocStore();

const selectedItem = shallowRef<Workspace>();

//处理右键点击
const handleContextmenu = (item: Workspace) => {
  selectedItem.value = item;
};

//处理添加
const handleAdd = () => {
  if (!selectedItem.value) {
    return;
  }

  ipc.addDoc({
    workspaceId: selectedItem.value.id,
  });
};

//处理编辑
const handleEdit = () => {
  if (!selectedItem.value) {
    return;
  }

  eventBus.emit('dialog-workspace:edit:show', selectedItem.value);
};

//删除工作区中所有文档
const handleRemoveDocs = () => {
  if (!selectedItem.value) {
    return;
  }

  clearDoc(selectedItem.value.id);

  eventBus.emit('success:show', '已删除全部文档');
};

//处理删除
const handleRemove = () => {
  if (!selectedItem.value) {
    return;
  }

  clearDoc(selectedItem.value.id);

  removeWorkspace(selectedItem.value.id);

  eventBus.emit('success:show', `已删除 "${selectedItem.value.name}"`);
};
</script>

<style scoped lang="scss"></style>
