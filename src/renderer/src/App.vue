<template>
  <TooltipProvider>
    <RouterView />

    <Print />

    <DialogSetting />

    <GroupDialog />

    <PresetDialog />

    <WorkspaceDialog />

    <PrinterTaskDialog />
  </TooltipProvider>

  <Toaster class="dark" />
</template>

<script setup lang="ts">
import Print from '@/features/print/index.vue';
import DialogSetting from '@/features/settings/index.vue';
import { GroupDialog } from '@/features/group';
import PresetDialog from '@/features/preset/index.vue';
import WorkspaceDialog from '@/features/workspace/index.vue';
import PrinterTaskDialog from '@/features/printer-task/index.vue';
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
