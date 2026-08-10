<template>
  <section class="flex">
    <Button
      variant="ghost"
      :disabled="reloadLock"
      @click="handleReload"
      v-if="selectedPrinter"
    >
      <Spinner v-if="reloadLock" />

      <RotateCwIcon v-else />

      <span>刷新</span>
    </Button>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          class="ml-auto"
          variant="ghost"
          size="icon"
          :disabled="!selectedPrinter"
        >
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="min-w-52">
        <DropdownMenuItem
          :disabled="printTestLock"
          @click="handlePrintTest('black')"
        >
          <Spinner v-if="printTestLock" />

          <TestTubeDiagonalIcon v-else />

          <span>打印测试页（黑白）</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          :disabled="printTestLock"
          @click="handlePrintTest('color')"
        >
          <Spinner v-if="printTestLock" />

          <TestTubeDiagonalIcon v-else />

          <span>打印测试页（彩色）</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" @click="handleRemoveAll">
          <Trash2Icon />

          <span>删除打印机所有任务</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </section>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import eventEmitter from '@/hooks/eventEmitter';
import { useLockFn } from '@/hooks/useLock';
import { usePrinterStore } from '@/stores/usePrinterStore';
import { usePrinterTaskStore } from '@/stores/usePrinterTaskStore';
import {
  MoreHorizontalIcon,
  RotateCwIcon,
  TestTubeDiagonalIcon,
  Trash2Icon,
} from '@lucide/vue';

const { selectedPrinter } = storeToRefs(usePrinterStore());
const { startPrinterTasks, removeAllPrinterTasks } = usePrinterTaskStore();

//刷新打印任务列表
const [reloadLock, handleReload] = useLockFn(startPrinterTasks);

//打印测试页
const [printTestLock, handlePrintTest] = useLockFn(
  async (cartridge: 'color' | 'black') => {
    eventEmitter.emit('loading:show', {
      loadingMsg: `正在打印机测试页（${cartridge == 'black' ? '黑白' : '彩色'}）`,
      successMsg: '打印测试页完成',
      errorMsg: '打印测试页失败',
      cb: async () => {
        await ipc.printTest(selectedPrinter.value, cartridge);
      },
    });
  },
);

//删除所有任务
const handleRemoveAll = async () => {
  eventEmitter.emit('loading:show', {
    loadingMsg: '正在删除打印机所有任务',
    successMsg: '已删除打印机所有任务',
    errorMsg: '打印机所有任务删除失败',
    cb: removeAllPrinterTasks,
  });
};
</script>

<style scoped lang="scss"></style>
