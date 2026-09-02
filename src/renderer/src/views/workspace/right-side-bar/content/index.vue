<template>
  <TaskContent />
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';
import TaskContent from '@/features/printer-task/content/index.vue';
import { printTaskContextKey } from '@/features/printer-task/context';
import { usePrinterTaskService } from '@/services/printer-task.service';
import { useSelectionStore } from '@/stores/selection.store';

// 当前选中分组的打印机信息
const { selectedGroup } = storeToRefs(useSelectionStore());
// 右侧栏独立维护的打印机任务服务实例
const { printerTasks, getPrinterTasks, removePrinterTask, clearPrinterTasks } =
  usePrinterTaskService();
// 当前分组绑定的打印机
const selectedPrinter = ref('');

// 打印机任务轮询控制方法
const { pause: stopPrinterTasks, resume: startPrinterTasks } = useIntervalFn(
  () => getPrinterTasks(selectedPrinter.value),
  3000,
  { immediate: false },
);

// 刷新当前分组打印机的任务列表
const handleRefreshPrinterTasks = async () => {
  stopPrinterTasks();

  await getPrinterTasks(selectedPrinter.value);

  if (!selectedPrinter.value) {
    return;
  }

  startPrinterTasks();
};

// 删除当前分组打印机的单个或全部任务
const handleRemovePrinterTask = async (id?: number) => {
  await removePrinterTask(selectedPrinter.value, id);

  await handleRefreshPrinterTasks();
};

watchEffect(() => {
  const printer = selectedGroup.value?.printer;

  if (!printer) {
    return;
  }

  selectedPrinter.value = printer;

  clearPrinterTasks();
  handleRefreshPrinterTasks();
});

provide(printTaskContextKey, {
  printerTasks,
  selectedPrinter,
  handleRefreshPrinterTasks,
  handleRemovePrinterTask,
});

onBeforeUnmount(stopPrinterTasks);
</script>

<style scoped lang="scss"></style>
