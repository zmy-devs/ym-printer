<template>
  <div class="manager-window wh-screen grid bg-sidebar" v-drag="dragOption">
    <TitleBar />

    <ResizablePanelGroup
      class="px-2 pb-2"
      :class="{
        'gap-1': panelRef?.isExpanded,
      }"
      direction="horizontal"
      autoSaveId="layout"
    >
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

      <ResizableHandle class="bg-transparent!" />

      <ResizablePanel :min-size="50">
        <RouterView class="h-full bg-background border rounded-lg" />
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
import { useDocStore } from '@/stores/doc';
import Overlay from '@/components/overlay.vue';
//@ts-ignore
import { panelRef } from '.';
import { useEventListener } from '@vueuse/core';

const { addDoc } = useDocStore();

const isDragging = ref(false);

//拖拽配置
const dragOption = {
  onChange: (val: boolean) => {
    isDragging.value = val;
  },

  onDrop: (e: DragEvent) => {
    const files = e.dataTransfer?.files;

    if (!files || files.length === 0) return;

    addDoc(Array.from(files));
  },
};

//监控粘贴文档
useEventListener('paste', async (e) => {
  const files = e.clipboardData?.files;

  if (!files || files.length === 0) return;

  addDoc(Array.from(files));
});
</script>

<style lang="scss">
.manager-window {
  grid-template-rows: 40px calc(100vh - 40px);

  grid-template-areas:
    'title-bar'
    'content';
}
</style>
