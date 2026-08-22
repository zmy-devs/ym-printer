<template>
  <header class="h-10 px-2 flex items-center shrink-0 app-drag">
    <Tooltip label="当前打印机任务队列" side="bottom">
      <Button class="app-no-drag bg-accent" variant="ghost" size="icon-xs">
        <PrinterIcon />
      </Button>
    </Tooltip>
  </header>
</template>

<script setup lang="ts">
import { PrinterIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import Tooltip from '@/components/tooltip.vue';
</script>

<style scoped lang="scss"></style>
