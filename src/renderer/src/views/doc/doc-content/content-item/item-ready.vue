<template>
  <ItemBase v-bind="$props" :has-print-config="!!printConfig">
    <template v-if="printState?.status === 'preparing'">
      <Tooltip label="开始打印">
        <Button size="xs" @click.stop="handleStart">
          <PrinterIcon />
          开始
        </Button>
      </Tooltip>

      <Button variant="outline" size="xs" @click.stop="handleCancel">
        <XIcon class="size-4" />
        取消
      </Button>
    </template>

    <Button
      v-if="printState?.status === 'queued'"
      variant="outline"
      size="xs"
      @click.stop="handleCancel"
    >
      <XIcon class="size-4" />
      取消
    </Button>

    <Spinner
      v-if="printState?.status === 'uploading'"
      class="mr-2 size-4 text-muted-foreground"
    />

    <template v-if="printState?.status === 'waiting'">
      <Tooltip label="继续打印正面">
        <Button size="xs" @click.stop="handleContinue">
          <ArrowRightIcon />
          继续
        </Button>
      </Tooltip>

      <Button variant="outline" size="xs" @click.stop="handleCancel">
        <XIcon class="size-4" />
        取消
      </Button>
    </template>

    <CheckIcon v-if="printState?.status === 'completed'" class="mr-2 size-5" />

    <template v-if="printState?.status === 'failed'">
      <Tooltip label="重试打印">
        <Button size="xs" @click.stop="handleRetry">
          <RotateCwIcon />
          重试
        </Button>
      </Tooltip>

      <Button variant="outline" size="xs" @click.stop="handleCancel">
        <XIcon class="size-4" />
        取消
      </Button>
    </template>
  </ItemBase>
</template>

<script setup lang="ts">
import type { Doc } from '@type';
import {
  ArrowRightIcon,
  CheckIcon,
  PrinterIcon,
  RotateCwIcon,
  XIcon,
} from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import Tooltip from '@/components/tooltip.vue';
import { usePrintConfigStore } from '@/stores/print-config.store';
import ItemBase from './item-base/index.vue';

// 就绪文档参数
const props = defineProps<{
  data: Doc;
}>();

// 文档打印配置状态
const printConfigStore = usePrintConfigStore();

// 当前文档打印运行状态
const printState = computed(() => {
  return printConfigStore.getPrintState(props.data.id);
});

// 当前文档已保存的打印配置
const printConfig = computed(() => {
  return printConfigStore.getPrintConfig(props.data.id);
});

// 取消当前打印流程
const handleCancel = () => {
  printConfigStore.cancelPrint(props.data.id);
};

// 开始已预备的打印流程
const handleStart = () => {
  printConfigStore.startPreparedPrint(props.data.id);
};

// 继续双面打印的正面任务
const handleContinue = () => {
  printConfigStore.continuePrint(props.data.id);
};

// 重试失败的打印任务
const handleRetry = () => {
  printConfigStore.retryPrint(props.data.id);
};
</script>

<style scoped lang="scss"></style>
