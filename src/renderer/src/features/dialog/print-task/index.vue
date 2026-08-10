<template>
  <Dialog v-model:open="open">
    <DialogContent
      :aria-describedby="undefined"
      class="max-w-none! w-[90vw] h-[calc(100vh-100px)] p-0! overflow-hidden border-[1.5px]"
      @open-auto-focus.prevent
    >
      <VisuallyHidden as-child>
        <DialogTitle />
      </VisuallyHidden>

      <div class="print-task wh-full grid bg-sidebar">
        <TitleBar />

        <ResizablePanelGroup
          class="pb-2"
          direction="horizontal"
          autoSaveId="print-task-layout"
        >
          <ResizablePanel :min-size="160" :default-size="260" size-unit="px">
            <SideBar class="h-full" />
          </ResizablePanel>

          <ResizableHandle class="bg-transparent!" />

          <ResizablePanel class="pr-2" :min-size="50">
            <Content
              class="h-full bg-background border rounded-lg overflow-hidden"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import TitleBar from './title-bar/index.vue';
import SideBar from './side-bar/index.vue';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { eventBus } from '@/utils/event-bus';
import { VisuallyHidden } from 'reka-ui';
import Content from './content/index.vue';

const open = ref(false);

eventBus.on('dialog-print-task:show', () => {
  open.value = true;
});
</script>

<style scoped lang="scss">
.print-task {
  grid-template-rows: 40px calc(100vh - 140px);
}
</style>
