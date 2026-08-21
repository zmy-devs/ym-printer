<template>
  <SelectPrinter
    value-class="font-medium"
    :model-value="selectedWorkspace?.printer"
    @update:model-value="handleUpdatePrinter"
  />

  <Button
    class="ml-auto"
    size="xs"
    @click="handleAddDoc"
    v-if="hasCurrentGroupDocs"
  >
    <PlusIcon />

    <span>新增文档</span>
  </Button>
</template>

<script setup lang="ts">
import { PlusIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import SelectPrinter from '@/components/select-printer.vue';
import { useDocumentService } from '@/services/document.service';
import { useSelectionStore } from '@/stores/selection.store';
import { useWorkspaceStore } from '@/stores/workspace.store';

// 文档业务能力
const docService = useDocumentService();

// 当前分组的文档列表和当前工作空间
const { selectedDocs, selectedWorkspace } = storeToRefs(useSelectionStore());

// 工作空间实体状态
const workspaceStore = useWorkspaceStore();

// 当前分组是否已有文档
const hasCurrentGroupDocs = computed(() => {
  return selectedDocs.value.length > 0;
});

// 打开文档选择器并添加到当前分组
const handleAddDoc = () => {
  docService.addDocs();
};

// 更新当前工作空间默认打印机
const handleUpdatePrinter = (printer: string | undefined) => {
  if (!selectedWorkspace.value || !printer) {
    return;
  }

  workspaceStore.updateWorkspace(selectedWorkspace.value.id, {
    printer,
  });
};
</script>

<style scoped lang="scss"></style>
