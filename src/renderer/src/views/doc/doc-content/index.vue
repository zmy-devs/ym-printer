<template>
  <ContextMenu>
    <ContextMenuTrigger as-child :disabled="status == 'price'">
      <VueDraggable
        class="px-0.5 flex flex-col"
        :animation="200"
        :model-value="filterDocs"
        @update:model-value="handleSort"
        :disabled="status != 'default'"
      >
        <template v-for="docs in filterDocs" :key="docs[0].groupId">
          <div
            class="flex flex-col"
            :class="{
              'border border-primary overflow-hidden': docs.length > 1,
            }"
          >
            <template v-for="item in docs" :key="item.id">
              <ContentItem
                :data="item"
                @contextmenu="handleContextmenu(item)"
              />
            </template>
          </div>
        </template>
      </VueDraggable>
    </ContextMenuTrigger>

    <component
      :is="contextmeunMap[status]"
      :data="selectedItem"
      v-if="selectedItem"
    />
  </ContextMenu>
</template>

<script setup lang="ts">
import ContentItem from './content-item/index.vue';
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { useDocStore } from '@/stores/doc';
import { VueDraggable } from 'vue-draggable-plus';
import { status } from '../index';
import { eventBus } from '@/utils/event-bus';
import { useWorkspaceStore } from '@/stores/workspace';
import { Doc } from '@type';
import ContextMenuDefault from './context-menu/context-menu-default.vue';
import ContextMenuCheck from './context-menu/context-menu-check.vue';

const contextmeunMap = {
  default: ContextMenuDefault,
  price: ContextMenuDefault,
  check: ContextMenuCheck,
};

const { docs } = storeToRefs(useDocStore());
const { selectDoc } = useDocStore();
const { selectedWorkspaceID } = storeToRefs(useWorkspaceStore());

const selectedItem = shallowRef<Doc>();

const handleContextmenu = (item: Doc) => {
  selectedItem.value = item;
};

const filterDocs = computed(() => {
  const workspaceDocs = docs.value.filter(
    (item) => item.workspaceId == selectedWorkspaceID.value,
  );

  const res = workspaceDocs.reduce(
    (prev, cur) => {
      if (!prev[cur.groupId]) {
        prev[cur.groupId] = [];
      }

      prev[cur.groupId].push(cur);

      return prev;
    },
    {} as Record<string, Doc[]>,
  );

  return Object.values(res);
});

//排序
const handleSort = (data: Doc[][]) => {
  const order = docs.value.filter(
    (item) => item.workspaceId != selectedWorkspaceID.value,
  );

  docs.value = [...order, ...data.flat()];
};

//打印文档
const handlePrint = (id: string) => {
  if (status.value != 'default') {
    return;
  }

  selectDoc(id);

  eventBus.emit('dialog-print:show');
};

provide('handlePrint', handlePrint);
</script>

<style scoped lang="scss"></style>
