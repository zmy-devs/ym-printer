<template>
  <DropdownMenu v-slot="slotProps" v-model:open="open" :modal="false">
    <slot v-bind="slotProps" />
  </DropdownMenu>
</template>

<script setup lang="ts">
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { hoverMenuContextKey } from './context';

// HoverMenu 悬浮行为参数
const props = withDefaults(
  defineProps<{
    closeDelay?: number;
  }>(),
  {
    closeDelay: 120,
  },
);

// HoverMenu 当前打开状态
const open = defineModel<boolean>('open', { default: false });

// HoverMenu 延迟关闭定时器
const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null);

// 取消 HoverMenu 的延迟关闭任务
const handleCancelClose = () => {
  if (closeTimer.value === null) {
    return;
  }

  clearTimeout(closeTimer.value);
  closeTimer.value = null;
};

// 打开 HoverMenu
const handleOpen = () => {
  handleCancelClose();
  open.value = true;
};

// 关闭 HoverMenu
const handleClose = () => {
  handleCancelClose();
  open.value = false;
};

// 延迟关闭 HoverMenu 以允许鼠标进入浮层
const handleScheduleClose = () => {
  handleCancelClose();
  closeTimer.value = setTimeout(handleClose, props.closeDelay);
};

provide(hoverMenuContextKey, {
  handleOpen,
  handleClose,
  handleScheduleClose,
  handleCancelClose,
});

onBeforeUnmount(handleCancelClose);
</script>

<style scoped lang="scss"></style>
