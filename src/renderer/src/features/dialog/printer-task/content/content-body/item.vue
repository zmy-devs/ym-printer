<template>
  <Item class="gap-2 items-start p-3 rounded-lg border">
    <ItemMedia class="size-5 mt-0.5">
      <FileIcon :ext="data.ext" />
    </ItemMedia>

    <ItemContent>
      <ItemTitle>{{ data.name }}</ItemTitle>

      <ItemDescription class="h-5.5 flex items-center gap-1.5">
        <Badge variant="outline" v-for="status in data.status" :key="status">
          {{ printerTaskStatusMap[status] ?? status }}
        </Badge>
      </ItemDescription>
    </ItemContent>

    <ItemActions>
      <Tooltip label="删除当前打印任务">
        <Button
          class="ml-auto text-destructive hover:text-destructive"
          variant="outline"
          size="icon-xs"
          @click.stop="handleRemove"
        >
          <Trash2Icon />
        </Button>
      </Tooltip>
    </ItemActions>
  </Item>
</template>

<script setup lang="ts">
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import type { PrinterTask } from '@type';
import { printerTaskStatusMap } from '@/map';
import { Trash2Icon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { showLoadingToast } from '@/utils/toast';
import Tooltip from '@/components/common/tooltip.vue';
import { Badge } from '@/components/ui/badge';
import FileIcon from '@/components/features/file-icon.vue';
import { usePrintTaskContext } from '../../context';

// 当前打印任务卡片参数
const props = defineProps<{
  data: PrinterTask;
}>();

// 打印机任务弹窗共享状态
const { handleRemovePrinterTask } = usePrintTaskContext();

// 删除当前打印任务
const handleRemove = async () => {
  showLoadingToast({
    loadingMsg: `正在删除 "${props.data.name}"`,
    successMsg: `已删除 "${props.data.name}"`,
    errorMsg: `"${props.data.name}" 删除失败`,
    cb: async () => {
      await handleRemovePrinterTask(props.data.id);
    },
  });
};
</script>

<style scoped lang="scss"></style>
