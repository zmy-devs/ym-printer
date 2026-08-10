<template>
  <Dialog v-model:open="open">
    <DialogContent
      :aria-describedby="undefined"
      class="sm:max-w-200 h-150 p-0! flex flex-col gap-0 bg-sidebar"
      @open-auto-focus.prevent
    >
      <VisuallyHidden as-child>
        <DialogTitle />
      </VisuallyHidden>

      <TitleBar />

      <ResizablePanelGroup
        class="px-2 pb-2 gap-1"
        direction="horizontal"
        auto-save-id="ym-printer:settings-layout"
      >
        <ResizablePanel :min-size="160" :default-size="200" size-unit="px">
          <SideBar class="h-full" />
        </ResizablePanel>

        <ResizableHandle class="bg-transparent!" />

        <ResizablePanel :min-size="50">
          <component
            :is="selectedRoute?.component"
            class="h-full rounded-lg border bg-background"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
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
import { selectedRoute, selectRouteID } from './router';

// 设置弹窗开关状态
const open = ref(false);

// 响应设置弹窗打开事件
eventBus.on('dialog-setting:show', (id) => {
  if (id) {
    selectRouteID(id);
  }

  open.value = true;
});
</script>

<style scoped lang="scss"></style>
