<template>
  <section class="h-10 pl-3 pr-1 flex items-center gap-2 shrink-0">
    <FileIcon :ext="selectedDoc?.ext" />

    <span class="mr-auto text-sm font-medium">
      {{ selectedDoc?.name }}
    </span>

    <Tooltip
      :label="viewMode === 'preview' ? '取消预览' : '进入预览'"
      side="bottom"
    >
      <Button
        :variant="viewMode === 'preview' ? 'default' : 'ghost'"
        size="icon-xs"
        :disabled="disabledControls.includes('preview')"
        @click="
          disabledControls.includes('preview') || handleTogglePreviewMode()
        "
      >
        <EyeIcon class="size-4" v-if="viewMode === 'preview'" />

        <EyeOffIcon class="size-4" v-else />
      </Button>
    </Tooltip>

    <Tooltip label="用默认方式打开" side="bottom">
      <Button variant="ghost" size="icon-xs" @click="handleOpenDefault">
        <PlayIcon class="size-4" />
      </Button>
    </Tooltip>

    <Tooltip label="重新加载文档" side="bottom">
      <Button
        variant="ghost"
        size="icon-xs"
        :disabled="reloadLock"
        @click="reloadLock || handleReload()"
      >
        <Spinner class="size-4" v-if="reloadLock" />

        <RotateCwIcon class="size-4" v-else />
      </Button>
    </Tooltip>

    <SheetClose>
      <Button variant="ghost" size="icon-xs">
        <XIcon class="size-4.5" />
      </Button>
    </SheetClose>
  </section>
</template>

<script setup lang="ts">
import { SheetClose } from '@/components/ui/sheet';
import FileIcon from '@/components/features/file-icon.vue';
import { useSelectionStore } from '@/stores/selection.store';
import { Button } from '@/components/ui/button';
import {
  EyeIcon,
  EyeOffIcon,
  PlayIcon,
  RotateCwIcon,
  XIcon,
} from '@lucide/vue';
import Tooltip from '@/components/common/tooltip.vue';
import { usePdfStore } from '@/stores/pdf.store';
import { Spinner } from '@/components/ui/spinner';
import { useSheetPrintContext } from '../context';

// 当前选中的打印文档
const { selectedDoc } = storeToRefs(useSelectionStore());
// 当前文档预览模式
const { viewMode } = storeToRefs(usePdfStore());
// 更新文档预览模式
const { setViewMode } = usePdfStore();
// 打印控件禁用状态与文档重新加载能力
const { disabledControls, reloadLock, handleReload } = useSheetPrintContext();

// 使用系统默认应用打开当前文档
const handleOpenDefault = () => {
  const doc = selectedDoc.value;

  if (!doc) {
    return;
  }

  ipc.openPath(doc.path);
};

// 切换原始文档与打印预览
const handleTogglePreviewMode = () => {
  setViewMode(viewMode.value === 'preview' ? 'raw' : 'preview');
};
</script>

<style scoped lang="scss"></style>
