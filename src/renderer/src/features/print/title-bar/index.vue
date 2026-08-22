<template>
  <section class="h-10 pl-3 pr-1 flex items-center gap-2 shrink-0">
    <FileIcon :ext="selectedDoc?.ext" />

    <span class="text-sm font-medium">
      {{ selectedDoc?.name }}
    </span>

    <Tooltip
      :label="viewMode === 'preview' ? '取消预览' : '进入预览'"
      side="bottom"
    >
      <Button
        class="ml-auto"
        :variant="viewMode === 'preview' ? 'default' : 'ghost'"
        size="icon-xs"
        @click="handleTogglePreviewMode"
      >
        <EyeIcon class="size-4.5" v-if="viewMode === 'preview'" />

        <EyeOffIcon class="size-4.5" v-else />
      </Button>
    </Tooltip>

    <Button variant="ghost" size="icon-xs" @click="handleShowAppearance">
      <SettingsIcon class="size-4.5" />
    </Button>

    <SheetClose>
      <Button variant="ghost" size="icon-xs">
        <XIcon class="size-4.5" />
      </Button>
    </SheetClose>
  </section>
</template>

<script setup lang="ts">
import { SheetClose } from '@/components/ui/sheet';
import FileIcon from '@/components/file-icon.vue';
import { useSelectionStore } from '@/stores/selection.store';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon, SettingsIcon, XIcon } from '@lucide/vue';
import Tooltip from '@/components/tooltip.vue';
import { eventBus } from '@/utils/event-bus';
import { usePdfStore } from '@/stores/pdf.store';

// 当前选中的打印文档
const { selectedDoc } = storeToRefs(useSelectionStore());
// 当前文档预览模式
const { viewMode } = storeToRefs(usePdfStore());
// 更新文档预览模式
const { setViewMode } = usePdfStore();

// 切换原始文档与打印预览
const handleTogglePreviewMode = () => {
  setViewMode(viewMode.value === 'preview' ? 'raw' : 'preview');
};

// 打开外观设置
const handleShowAppearance = () => {
  eventBus.emit('dialog-setting:show', 'appearance');
};
</script>

<style scoped lang="scss"></style>
