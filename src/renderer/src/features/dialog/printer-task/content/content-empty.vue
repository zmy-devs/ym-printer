<template>
  <Empty class="wh-full">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <PrinterIcon />
      </EmptyMedia>

      <EmptyTitle>暂无打印任务</EmptyTitle>

      <EmptyDescription> 当前打印机暂无待处理的打印任务 </EmptyDescription>
    </EmptyHeader>

    <EmptyContent>
      <Button
        :disabled="reloadLock"
        @click="handleReload"
        v-if="selectedPrinter"
      >
        <Spinner v-if="reloadLock" />

        <RotateCwIcon v-else />

        <span>刷新</span>
      </Button>

      <Button v-else> 请选择打印机 </Button>
    </EmptyContent>
  </Empty>
</template>

<script setup lang="ts">
import { PrinterIcon, RotateCwIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useLockFn } from '@/hooks/use-lock';
import { Spinner } from '@/components/ui/spinner';
import { usePrintTaskContext } from '../context';

// 打印机任务弹窗共享状态
const { selectedPrinter, handleRefreshPrinterTasks } = usePrintTaskContext();

// 刷新操作锁
const [reloadLock, handleReload] = useLockFn(handleRefreshPrinterTasks);
</script>
