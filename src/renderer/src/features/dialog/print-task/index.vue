<template>
  <Dialog v-model="visible">
    <TitleBar class="border-b" />

    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId="ym-printer:print-task-layout"
    >
      <ResizablePanel :min-size="160" :default-size="200" size-unit="px">
        <SideBar class="h-full" />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel :min-size="50">
        <Content class="h-full bg-background" />
      </ResizablePanel>
    </ResizablePanelGroup>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from '@/components/dialog.vue';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import TitleBar from './title-bar/index.vue';
import SideBar from './side-bar/index.vue';
import { eventBus } from '@/utils/event-bus';
import Content from './content/index.vue';

const visible = ref(false);

eventBus.on('dialog-print-task:show', () => {
  visible.value = true;
});
</script>

<style scoped lang="scss">
.print-task {
  grid-template-rows: 40px calc(100vh - 140px);
}
</style>
