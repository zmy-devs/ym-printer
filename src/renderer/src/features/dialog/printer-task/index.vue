<template>
  <Dialog v-model="visible">
    <TitleBar class="border-b" />

    <ResizablePanelGroup
      direction="horizontal"
      autoSaveId="ym-printer:print-task-layout"
    >
      <ResizablePanel :min-size="200" :default-size="200" size-unit="px">
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
import { useSelectionStore } from '@/stores/selection.store';
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
import { usePrinterTaskStore } from '@/stores/printer-task.store';
import { printTaskContextKey } from './context.js';
import { useIntervalFn } from '@vueuse/core';

const { selectedWorkspace } = storeToRefs(useSelectionStore());

const { getPrinterTasks, removePrinterTask } = usePrinterTaskStore();

// 打印机队列弹窗显示状态
const visible = ref(false);

// 当前选中的打印机，仅在弹窗会话内保留
const selectedPrinter = ref('');

// 打印机任务轮询控制方法
const { pause: stopPrinterTasks, resume: startPrinterTasks } = useIntervalFn(
  () => getPrinterTasks(selectedPrinter.value),
  3000,
  { immediate: false },
);

// 切换当前打印机并刷新其任务列表
const handleSelectPrinter = async (printer: string) => {
  selectedPrinter.value = printer;

  await handleRefreshPrinterTasks();
};

// 刷新当前打印机的任务列表
const handleRefreshPrinterTasks = async () => {
  stopPrinterTasks();

  await getPrinterTasks(selectedPrinter.value);

  if (!selectedPrinter.value) {
    return;
  }

  startPrinterTasks();
};

// 删除当前打印机的单个任务
const handleRemovePrinterTask = async (id?: number) => {
  await removePrinterTask(selectedPrinter.value, id);

  await handleRefreshPrinterTasks();
};

// 根据弹窗状态控制任务轮询
watch(visible, (isVisible) => {
  if (!isVisible) {
    stopPrinterTasks();
    return;
  }

  handleRefreshPrinterTasks();
});

provide(printTaskContextKey, {
  selectedPrinter,
  handleSelectPrinter,
  handleRefreshPrinterTasks,
  handleRemovePrinterTask,
});

eventBus.on('dialog-print-task:show', () => {
  selectedPrinter.value = selectedWorkspace.value?.printer ?? '';
  visible.value = true;
});

onBeforeUnmount(stopPrinterTasks);
</script>

<style scoped lang="scss">
.print-task {
  grid-template-rows: 40px calc(100vh - 140px);
}
</style>
