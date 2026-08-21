<template>
  <TooltipProvider>
    <RouterView />

    <Print />

    <DialogSetting />

    <DialogGroup />

    <DialogPreset />

    <DialogPrinterTask />
  </TooltipProvider>

  <Toaster />
</template>

<script setup lang="ts">
import Print from '@/features/print/index.vue';
import DialogSetting from '@/features/settings/index.vue';
import DialogGroup from '@/features/dialog/group/index.vue';
import DialogPreset from '@/features/dialog/preset/index.vue';
import DialogPrinterTask from '@/features/dialog/printer-task/index.vue';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { usePrinterStore } from '@/stores/printer.store';
import { useRuntime } from '@/runtime';
import { useGroupService } from '@/services/group.service';
import { initUpdateService } from '@/services/update.service';
import 'vue-sonner/style.css';

//初始化pinia
initUpdateService();
usePrinterStore().getPrinters();
useGroupService().initSelection();
useRuntime();
</script>

<style lang="scss"></style>
