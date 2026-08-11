<template>
  <Dialog v-model="visible">
    <TitleBar />

    <ResizablePanelGroup
      class="px-2 pb-2"
      direction="horizontal"
      autoSaveId="ym-printer:print-task-layout"
    >
      <ResizablePanel :min-size="160" :default-size="200" size-unit="px">
        <SideBar class="h-full pr-1.5" />
      </ResizablePanel>

      <ResizableHandle class="bg-transparent!" />

      <ResizablePanel :min-size="50">
        <Content class="h-full bg-background border rounded-lg" />
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
