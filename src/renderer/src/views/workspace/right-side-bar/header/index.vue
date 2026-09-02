<template>
  <header class="h-11 px-2 flex items-center shrink-0">
    <Button class="bg-accent dark:bg-accent/50" variant="ghost" size="xs">
      <PrinterIcon />

      <span>打印机任务队列</span>
    </Button>

    <Tooltip triggerClass="ml-auto" label="关闭右侧边栏" side="bottom">
      <Button variant="ghost" size="icon-xs" @click="rightPanelRef?.collapse()">
        <XIcon />
      </Button>
    </Tooltip>
  </header>
</template>

<script setup lang="ts">
import { PrinterIcon, XIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import Tooltip from '@/components/common/tooltip.vue';
import { useWorkspaceContext } from '../../index';

// 当前工作区的右侧边栏面板实例
const { rightPanelRef } = useWorkspaceContext();
</script>

<style scoped lang="scss"></style>
