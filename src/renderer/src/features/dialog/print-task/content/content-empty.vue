<template>
  <Empty class="wh-full">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <PrinterIcon />
      </EmptyMedia>

      <EmptyTitle>暂无打印任务</EmptyTitle>

      <EmptyDescription> 当前打印机暂无打印任务请刷新或重试 </EmptyDescription>
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
import { usePrinterTaskStore } from '@/stores/printer-task';
import { useLockFn } from '@/hooks/use-lock';
import { Spinner } from '@/components/ui/spinner';
import { usePrinterStore } from '@/stores/printer';

const { startPrinterTasks } = usePrinterTaskStore();
const { selectedPrinter } = storeToRefs(usePrinterStore());

const [reloadLock, handleReload] = useLockFn(startPrinterTasks);
</script>
