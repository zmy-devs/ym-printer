<template>
  <TooltipProvider>
    <RouterView />

    <SheetPrint />

    <DialogSetting />

    <DialogWorkspace />

    <DialogGroup />

    <DialogPreset />

    <DialogPrinterTask />
  </TooltipProvider>

  <Toaster />
</template>

<script setup lang="ts">
import SheetPrint from '@/features/sheet-print/index.vue';
import DialogSetting from '@/features/settings/index.vue';
import DialogWorkspace from '@/features/dialog/workspace/index.vue';
import DialogGroup from '@/features/dialog/group/index.vue';
import DialogPreset from '@/features/dialog/preset/index.vue';
import DialogPrinterTask from '@/features/dialog/printer-task/index.vue';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { usePrinterStore } from '@/stores/printer.store';
import 'vue-sonner/style.css';
import { useRuntime } from '@/runtime';
import { useWorkspaceService } from '@/services/workspace.service';
import { initializeUpdateService } from '@/services/update.service';

//初始化pinia
initializeUpdateService();
usePrinterStore().getPrinters();
useWorkspaceService().initSelection();
useRuntime();
</script>

<style lang="scss"></style>
