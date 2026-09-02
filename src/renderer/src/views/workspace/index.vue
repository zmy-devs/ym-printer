<template>
  <div class="wh-screen bg-sidebar" v-drag="dragOption">
    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId="ym-printer:layout:side-bar"
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

      <ResizableHandle class="w-0! bg-transparent! border-r" />

      <ResizablePanel class="relative flex flex-col" :min-size="50">
        <TitleBar class="border-b" />

        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ym-printer:layout:right-side-bar"
        >
          <ResizablePanel :min-size="50">
            <Content class="bg-background" />
          </ResizablePanel>

          <ResizableHandle
            class="w-0! bg-transparent! border-r"
            v-if="rightPanelRef?.isExpanded"
          />

          <ResizablePanel
            ref="rightPanelRef"
            :min-size="260"
            :default-size="0"
            collapsible
            :collapsedSize="0"
            size-unit="px"
          >
            <RightSideBar
              class="h-full bg-background"
              v-if="rightPanelRef?.isExpanded"
            />
          </ResizablePanel>
        </ResizablePanelGroup>

        <UpdateNotification />
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
import RightSideBar from './right-side-bar/index.vue';
import TitleBar from './title-bar/index.vue';
import Content from './content/index.vue';
import UpdateNotification from '@/components/features/update-notification.vue';
import vDrag from '@/hooks/use-drag';
import { useDocumentService } from '@/services/document.service';
import Overlay from '@/components/common/overlay.vue';
import { provideWorkspaceContext } from '.';
import { SplitterPanel } from 'reka-ui';
import { provideDocumentCheckContext } from '@/features/document';

// 当前分组文档导入能力
const { addDocs } = useDocumentService();

// 左侧边栏面板实例
const panelRef = useTemplateRef<InstanceType<typeof SplitterPanel>>('panelRef');

// 右侧边栏面板实例
const rightPanelRef =
  useTemplateRef<InstanceType<typeof SplitterPanel>>('rightPanelRef');

// 当前是否正在向工作区拖入文件
const isDragging = ref(false);

//拖拽配置
const dragOption = {
  onChange: (val: boolean) => {
    isDragging.value = val;
  },

  onDrop: (e: DragEvent) => {
    const files = e.dataTransfer?.files;

    if (!files || files.length === 0) {
      return;
    }

    addDocs(undefined, Array.from(files));
  },
};

provideWorkspaceContext({ panelRef, rightPanelRef });
provideDocumentCheckContext();
</script>

<style lang="scss"></style>
