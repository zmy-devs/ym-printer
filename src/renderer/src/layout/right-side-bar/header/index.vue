<template>
  <header class="h-10 px-1.5 flex items-center shrink-0">
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
import { rightPanelRef } from '../../index';
import Tooltip from '@/components/common/tooltip.vue';
</script>

<style scoped lang="scss"></style>
