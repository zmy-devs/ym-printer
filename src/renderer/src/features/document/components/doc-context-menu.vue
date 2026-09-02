<template>
  <ContextMenu>
    <ContextMenuTrigger as-child @contextmenu.stop="handleContextMenu">
      <slot />
    </ContextMenuTrigger>

    <ContextMenuContent class="min-w-60">
      <template v-if="!isChecking">
        <ContextMenuGroup>
          <ContextMenuItem @click="handleOpen">
            <PlayIcon />

            <span>用默认方式打开</span>
          </ContextMenuItem>

          <ContextMenuItem @click="handleShowInFolder">
            <FolderOpenIcon />

            <span>在文件管理器中显示</span>
          </ContextMenuItem>
        </ContextMenuGroup>

        <ContextMenuSeparator />
      </template>

      <ContextMenuGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <CornerUpRightIcon class="mr-2" />

            <span>移动到</span>
          </ContextMenuSubTrigger>

          <ContextMenuSubContent class="min-w-40">
            <ContextMenuRadioGroup
              :model-value="isChecking ? undefined : docGroupId"
              @update:model-value="handleMove"
            >
              <ContextMenuRadioItem
                v-for="item in selectedGroups"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        <Tooltip
          label="无法删除当前状态的文档"
          side="right"
          :disabled="!disabledRemoveDocs"
        >
          <ContextMenuItem
            variant="destructive"
            :disabled="disabledRemoveDocs"
            @click="disabledRemoveDocs || handleRemove()"
          >
            <Trash2Icon />

            <span>{{ isChecking ? '删除选中的文档' : '删除文档' }}</span>
          </ContextMenuItem>
        </Tooltip>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>

<script setup lang="ts">
import { useSelectionStore } from '@/stores/selection.store';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  CornerUpRightIcon,
  FolderOpenIcon,
  PlayIcon,
  Trash2Icon,
} from '@lucide/vue';
import { useDocStore } from '@/stores/doc.store';
import { showSuccessToast } from '@/utils/toast';
import { useDocumentCheckContext } from '../context/document-check.context';
import { useDocumentService } from '@/services/document.service';
import Tooltip from '@/components/common/tooltip.vue';

// 当前功能范围的文档勾选状态与操作
const { cancelCheckAll, checked, isChecking } = useDocumentCheckContext();

const docStore = useDocStore();
const { getDoc } = docStore;
const { selectedGroups } = storeToRefs(useSelectionStore());
const { canRemoveDocs, removeDocs, moveDocs } = useDocumentService();

// 当前右键菜单目标的文档标识
const docId = ref('');

// 当前右键菜单目标的文档数据
const doc = computed(() => {
  return getDoc(docId.value);
});

// 当前右键菜单目标所属的分组标识
const docGroupId = computed(() => {
  return doc.value?.groupId;
});

// 处理右键菜单目标
const handleContextMenu = (event: MouseEvent) => {
  // 触发右键菜单的文档元素
  const target = (event.target as HTMLElement).closest<HTMLElement>(
    '[data-id]',
  );

  if (!target?.dataset.id) {
    event.preventDefault();
    return;
  }

  docId.value = target.dataset.id;
};

// 获取当前菜单操作涉及的文档标识
const getTargetDocIds = () => {
  if (isChecking.value) {
    return Array.from(checked.value);
  }

  return doc.value ? [doc.value.id] : [];
};

// 当前菜单操作涉及的文档是否存在不可删除项
const disabledRemoveDocs = computed(() => {
  return !canRemoveDocs(getTargetDocIds());
});

// 使用系统默认应用打开当前文档
const handleOpen = () => {
  ipc.openPath(doc.value.path);
};

// 在系统文件管理器中定位当前文档
const handleShowInFolder = () => {
  ipc.showItemInFolder(doc.value.path);
};

// 移动当前文档或全部勾选文档
const handleMove = (value: unknown) => {
  // 当前操作涉及的文档标识
  const targetIds = getTargetDocIds();

  if (targetIds.length === 0) {
    return;
  }

  moveDocs(value as string, targetIds);

  if (isChecking.value) {
    cancelCheckAll();
  }
};

// 删除当前文档或全部勾选文档
const handleRemove = () => {
  // 当前操作涉及的文档标识
  const targetIds = getTargetDocIds();

  if (targetIds.length === 0) {
    return;
  }

  // 删除成功提示中的文档名称或数量
  const targetName = isChecking.value
    ? `${targetIds.length} 个文档`
    : doc.value?.name;

  removeDocs(targetIds);

  showSuccessToast(`已删除“${targetName}”`);

  if (isChecking.value) {
    cancelCheckAll();
  }
};
</script>

<style scoped lang="scss"></style>
