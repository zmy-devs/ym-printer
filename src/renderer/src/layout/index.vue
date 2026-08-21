<template>
  <div class="wh-screen bg-sidebar" v-drag="dragOption">
    <ResizablePanelGroup direction="horizontal" autoSaveId="ym-printer:layout">
      <ResizablePanel
        ref="panelRef"
        :min-size="160"
        :default-size="260"
        collapsible
        :collapsedSize="0"
        size-unit="px"
      >
        <SideBar class="h-full" />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel class="flex flex-col" :min-size="50">
        <TitleBar class="border-b" />

        <RouterView class="bg-background" />
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>

  <Overlay label="导入pdf、doc、docx、wps文件" v-if="isDragging" />
</template>

<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import SideBar from './side-bar/index.vue';
import TitleBar from './title-bar/index.vue';
import vDrag from '@/hooks/use-drag';
import { useDocumentService } from '@/services/document.service';
import Overlay from '@/components/overlay.vue';
//@ts-ignore
import { panelRef } from '.';

// 当前分组文档导入能力
const { addDocs } = useDocumentService();

const isDragging = ref(false);

//拖拽配置
const dragOption = {
  onChange: (val: boolean) => {
    isDragging.value = val;
  },

  onDrop: (e: DragEvent) => {
    const files = e.dataTransfer?.files;

    if (!files || files.length === 0) return;

    addDocs(undefined, Array.from(files));
  },
};
</script>

<style lang="scss"></style>
