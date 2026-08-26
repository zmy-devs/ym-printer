<template>
  <section class="h-10 pl-3 pr-1 flex items-center gap-2 shrink-0">
    <FileIcon :ext="selectedDoc?.ext" />

    <span class="text-sm font-medium">
      {{ selectedDoc?.name }}
    </span>

    <Tooltip
      trigger-class="ml-auto"
      :label="viewMode === 'preview' ? '取消预览' : '进入预览'"
      side="bottom"
    >
      <Button
        :variant="viewMode === 'preview' ? 'default' : 'ghost'"
        size="icon-xs"
        @click="handleTogglePreviewMode"
      >
        <EyeIcon class="size-4.5" v-if="viewMode === 'preview'" />

        <EyeOffIcon class="size-4.5" v-else />
      </Button>
    </Tooltip>

    <Tooltip label="重新加载文档" side="bottom">
      <Button
        variant="ghost"
        size="icon-xs"
        :disabled="reloadLock || isReloadDisabled"
        @click="handleReload()"
      >
        <Spinner class="size-4.5" v-if="reloadLock" />

        <RotateCwIcon class="size-4.5" v-else />
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
import { EyeIcon, EyeOffIcon, RotateCwIcon, XIcon } from '@lucide/vue';
import Tooltip from '@/components/common/tooltip.vue';
import { usePdfStore } from '@/stores/pdf.store';
import { useDocumentService } from '@/services/document.service';
import { usePrintConfigStore } from '@/stores/print-config.store';
import { Spinner } from '@/components/ui/spinner';
import { useLockFn } from '@/hooks/use-lock';

// 当前选中的打印文档
const { selectedDoc } = storeToRefs(useSelectionStore());
// 当前文档预览模式
const { viewMode } = storeToRefs(usePdfStore());
// 更新文档预览模式
const { setViewMode } = usePdfStore();
// 文档重新加载能力
const { reloadDoc } = useDocumentService();
// 判断文档打印状态是否禁用操作
const { isPrintDisabled } = usePrintConfigStore();

// 文档重新加载操作锁
const [reloadLock, handleReload] = useLockFn(reloadDoc);

// 当前文档是否禁止重新加载
const isReloadDisabled = computed(() => {
  return isPrintDisabled();
});

// 切换原始文档与打印预览
const handleTogglePreviewMode = () => {
  setViewMode(viewMode.value === 'preview' ? 'raw' : 'preview');
};
</script>

<style scoped lang="scss"></style>
