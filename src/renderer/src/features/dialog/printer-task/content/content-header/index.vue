<template>
  <section class="flex gap-1">
    <Tooltip label="刷新">
      <Button
        class="ml-auto"
        variant="ghost"
        size="icon-xs"
        :disabled="reloadLock"
        @click="handleReload"
      >
        <Spinner v-if="reloadLock" />

        <RotateCwIcon v-else />
      </Button>
    </Tooltip>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="icon-xs" :disabled="!selectedPrinter">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="min-w-52">
        <DropdownMenuItem
          :disabled="printTestLock"
          @click="handlePrintTest('black')"
        >
          <Spinner v-if="printTestLock" />

          <PrinterIcon v-else />

          <span>打印测试页（黑白）</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          :disabled="printTestLock"
          @click="handlePrintTest('color')"
        >
          <Spinner v-if="printTestLock" />

          <PrinterIcon v-else />

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
import { showLoadingToast } from '@/utils/toast';
import { useLockFn } from '@/hooks/use-lock';
import {
  MoreHorizontalIcon,
  PrinterIcon,
  RotateCwIcon,
  Trash2Icon,
} from '@lucide/vue';
import Tooltip from '@/components/tooltip.vue';
import { usePrintTaskContext } from '../../context';

// 打印机任务弹窗共享状态
const { selectedPrinter, handleRefreshPrinterTasks, handleRemovePrinterTask } =
  usePrintTaskContext();

//刷新打印任务列表
const [reloadLock, handleReload] = useLockFn(handleRefreshPrinterTasks);

//打印测试页
const [printTestLock, handlePrintTest] = useLockFn(
  async (cartridge: 'color' | 'black') => {
    showLoadingToast({
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
  showLoadingToast({
    loadingMsg: '正在删除打印机所有任务',
    successMsg: '已删除打印机所有任务',
    errorMsg: '打印机所有任务删除失败',
    cb: () => handleRemovePrinterTask(),
  });
};
</script>

<style scoped lang="scss"></style>
