<template>
  <Item class="dark:hover:bg-accent/30 rounded-none" size="sm">
    <ItemMedia variant="icon">
      <FileTextIcon />
    </ItemMedia>

    <ItemContent>
      <ItemTitle> {{ data.name }}</ItemTitle>

      <ItemDescription>
        {{ statusLabel || '未知状态' }}
      </ItemDescription>
    </ItemContent>

    <ItemActions>
      <Tooltip label="删除当前打印任务">
        <Button variant="outline" size="icon" @click="handleRemove">
          <Trash2Icon />
        </Button>
      </Tooltip>
    </ItemActions>
  </Item>
</template>

<script setup lang="ts">
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  ItemActions,
} from '@/components/ui/item';
import { PrinterTask } from '@type';
import { printStatusMap } from '@/map/index';
import { FileTextIcon, Trash2Icon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { usePrinterTaskStore } from '@/stores/printer-task';
import { eventBus } from '@/utils/event-bus';
import Tooltip from '@/components/tooltip.vue';

const { removePrinterTask } = usePrinterTaskStore();

const props = defineProps<{
  data: PrinterTask;
}>();

//状态标题
const statusLabel = computed(() => {
  return props.data.status.map((item) => printStatusMap[item]).join('，');
});

//删除
const handleRemove = async () => {
  eventBus.emit('loading:show', {
    loadingMsg: `正在删除 "${props.data.name}"`,
    successMsg: `已删除 "${props.data.name}"`,
    errorMsg: `"${props.data.name}" 删除失败`,
    cb: async () => {
      await removePrinterTask(props.data.id);
    },
  });
};
</script>

<style scoped lang="scss"></style>
