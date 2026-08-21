<template>
  <Dialog v-model="visible">
    <TitleBar class="border-b" />

    <ResizablePanelGroup
      direction="horizontal"
      auto-save-id="ym-printer:settings-layout"
    >
      <ResizablePanel :min-size="200" :default-size="200" size-unit="px">
        <SideBar class="h-full" />
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel :min-size="50">
        <component
          :is="selectedRoute?.component"
          class="h-full bg-background"
        />
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
import { selectedRoute, selectRouteID } from './router';

// 设置弹窗开关状态
const visible = ref(false);

// 响应设置弹窗打开事件
eventBus.on('dialog-setting:show', (id) => {
  if (id) {
    selectRouteID(id);
  }

  visible.value = true;
});
</script>

<style scoped lang="scss"></style>
