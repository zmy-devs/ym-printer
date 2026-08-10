<template>
  <ContextMenuContent class="min-w-60" v-if="status == 'default'">
    <ContextMenuItem @click="handleUnCombine">
      <LayersIcon />

      <span>拆分出 "当前组"</span>
    </ContextMenuItem>

    <ContextMenuItem @click="handleOpen">
      <PlayIcon />

      <span> 用默认方式打开 "当前文档"</span>
    </ContextMenuItem>

    <ContextMenuSub>
      <ContextMenuSubTrigger>
        <CornerUpRightIcon class="mr-2" />

        <span> 移动 "当前文档"</span>
      </ContextMenuSubTrigger>

      <ContextMenuSubContent class="min-w-40">
        <ContextMenuRadioGroup
          :model-value="data.workspaceId"
          @update:model-value="
            (val) => setDocWorkspaceId(data.id, val as string)
          "
        >
          <ContextMenuRadioItem
            v-for="item in workspace"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuSubContent>
    </ContextMenuSub>

    <ContextMenuSeparator />

    <ContextMenuItem variant="destructive" @click="handleRemove">
      <Trash2Icon />

      <span> 删除 "当前文档"</span>
    </ContextMenuItem>
  </ContextMenuContent>
</template>

<script setup lang="ts">
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
} from '@/components/ui/context-menu';
import { eventBus } from '@/utils/event-bus';
import { useDocStore } from '@/stores/doc';
import { Doc } from '@type';
import {
  CornerUpRightIcon,
  Trash2Icon,
  PlayIcon,
  LayersIcon,
} from '@lucide/vue';
import { status } from '../../index';
import { useWorkspaceStore } from '@/stores/workspace';

const { workspace } = storeToRefs(useWorkspaceStore());
const { setDocWorkspaceId, setDocGroupId } = useDocStore();

const { removeDoc } = useDocStore();

const props = defineProps<{
  data: Doc;
}>();

//拆分
const handleUnCombine = () => {
  setDocGroupId(props.data.id, props.data.id);
};

//打开文档
const handleOpen = () => {
  ipc.openPath(props.data.path);
};

//删除文档
const handleRemove = () => {
  removeDoc(props.data.id);

  eventBus.emit('success:show', `已删除 "${props.data.name}"`);
};
</script>

<style scoped lang="scss"></style>
