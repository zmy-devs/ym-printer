<template>
  <label
    class="group flex flex-col border rounded-lg overflow-hidden bg-background"
    :class="{
      'border-primary': checked.has(data.id),
      'border-destructive': variant === 'destructive',
    }"
    :for="data.id"
  >
    <main class="p-3 flex gap-2">
      <section class="size-5 mt-0.5 shrink-0">
        <slot name="icon">
          <FileIcon
            class="group-hover:hidden!"
            :ext="data.ext"
            v-if="!isChecking"
          />

          <Checkbox
            class="size-5"
            :class="{
              'hidden group-hover:block': !isChecking,
            }"
            :id="data.id"
            :model-value="checked.has(data.id)"
            @click.stop
            @update:model-value="handleToggleCheck"
          />
        </slot>
      </section>

      <section class="min-w-0 flex flex-1 flex-col gap-1">
        <div class="flex items-center gap-2">
          <template v-if="printConfig?.remark">
            <span
              class="text-sm font-medium truncate"
              :class="{
                'text-destructive-foreground': variant === 'destructive',
              }"
            >
              {{ printConfig.remark }}
            </span>

            <Separator class="h-4!" orientation="vertical" />
          </template>

          <span
            class="text-sm font-medium truncate"
            :class="{
              'text-destructive-foreground': variant === 'destructive',
            }"
          >
            {{ data.name }}
          </span>
        </div>

        <span
          class="h-6 text-sm text-muted-foreground truncate"
          v-if="!visiblePrintConfig"
        >
          {{ data.path }}
        </span>

        <ItemBaseDescription :data="data" v-else />
      </section>

      <Tooltip trigger-class="ml-auto" label="打开打印配置">
        <Button variant="outline" size="icon-sm" @click.stop="handleOpen">
          <SquareArrowOutUpRightIcon />
        </Button>
      </Tooltip>
    </main>

    <footer
      class="h-10 pl-3 pr-1.5 flex items-center gap-1.5 bg-muted/50 border-t"
    >
      <StatusDot :variant="statusVariant" />

      <span
        class="mr-auto text-xs"
        :class="{
          'text-destructive-foreground': variant === 'destructive',
        }"
      >
        {{ statusLabel }}
      </span>

      <slot />
    </footer>
  </label>
</template>

<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import ItemBaseDescription from './item-base-description.vue';
import FileIcon from '@/components/features/file-icon.vue';
import { Button } from '@/components/ui/button';
import type { Doc } from '@type';
import { useDocumentCheckContext } from '@/features/document';
import { SquareArrowOutUpRightIcon } from '@lucide/vue';
import Tooltip from '@/components/common/tooltip.vue';
import {
  docStatusMap,
  docStatusVariantMap,
  printStatusMap,
  printStatusVariantMap,
} from '@/map';
import StatusDot from './status-dot.vue';
import { Separator } from '@/components/ui/separator';
import { usePrintConfigStore } from '@/stores/print-config.store';
import { useSelectionStore } from '@/stores/selection.store';
import { eventBus } from '@/utils/event-bus';

// 当前功能范围的文档勾选状态与操作
const { checked, isChecking, toggleCheck } = useDocumentCheckContext();

// 文档卡片显示参数
const props = defineProps<{
  data: Doc;
  visiblePrintConfig?: boolean;
  variant?: 'destructive';
}>();

// 文档打印配置状态
const printConfigStore = usePrintConfigStore();

// 当前文档选择状态
const selectionStore = useSelectionStore();

// 当前文档打印运行状态
const printState = computed(() => {
  return printConfigStore.getPrintState(props.data.id);
});

// 当前文档的打印状态，未初始化时按空闲状态展示
const printStatus = computed(() => {
  return printState.value?.status ?? 'idle';
});

// 当前文档打印配置
const printConfig = computed(() => {
  return printConfigStore.getPrintConfig(props.data.id);
});

// 文档状态优先于打印状态的底部文案
const statusLabel = computed(() => {
  if (props.data.status !== 'ready') {
    return docStatusMap[props.data.status];
  }

  return printStatusMap[printStatus.value];
});

// 文档状态优先于打印状态的底部状态点
const statusVariant = computed(() => {
  if (props.data.status !== 'ready') {
    return docStatusVariantMap[props.data.status];
  }

  return printStatusVariantMap[printStatus.value];
});

// 切换当前文档的勾选状态
const handleToggleCheck = () => {
  toggleCheck(props.data.id);
};

// 打开当前文档的打印界面
const handleOpen = () => {
  selectionStore.selectDoc(props.data.id);
  eventBus.emit('dialog-print:show');
};
</script>

<style scoped lang="scss"></style>
