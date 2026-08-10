<template>
  <TooltipProvider>
    <RouterView />

    <SheetPrint />

    <DialogSetting />

    <DialogWorkspace />

    <DialogPreset />

    <DialogPrintTask />
  </TooltipProvider>

  <Toaster />
</template>

<script setup lang="ts">
import SheetPrint from '@/features/sheet-print/index.vue';
import DialogSetting from '@/features/settings/index.vue';
import DialogWorkspace from '@/features/dialog/workspace/index.vue';
import DialogPreset from '@/features/dialog/preset/index.vue';
import DialogPrintTask from '@/features/dialog/print-task/index.vue';
import { TooltipProvider } from '@/components/ui/tooltip';
import { eventBus } from '@/utils/event-bus';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'vue-sonner';
import { useUpdateStore } from '@/stores/update';
import { usePrinterStore } from '@/stores/printer';
import { useThemeStore } from '@/stores/theme';
import { useEventListener } from '@vueuse/core';
import 'vue-sonner/style.css';
import { useWorkspaceStore } from '@/stores/workspace';

//初始化pinia
useUpdateStore();
usePrinterStore();
useThemeStore();
const { selectedWorkspaceID } = storeToRefs(useWorkspaceStore());

eventBus.on('success:show', (message) => {
  toast.success(message, {
    duration: 1500,
    position: 'top-center',
  });
});

eventBus.on('loading:show', (option) => {
  toast.promise(option.cb, {
    loading: option.loadingMsg || '加载中...',
    success: option.successMsg || '操作成功',
    error: option.errorMsg || '操作失败',
    duration: 1500,
    position: 'top-center',
  });
});

eventBus.on('error:show', (message) => {
  toast.error(message, {
    duration: 1500,
    position: 'top-center',
  });
});

//快捷键
useEventListener('keydown', (e) => {
  //添加工作区
  if (e.ctrlKey && e.key == 'n') {
    eventBus.emit('dialog-workspace:show', {
      type: 'add',
    });

    return;
  }

  //打开设置
  if (e.ctrlKey && e.key == ',') {
    eventBus.emit('dialog-setting:show');
    return;
  }

  //添加文档
  if (e.ctrlKey && e.key == 'o') {
    ipc.addDoc({
      workspaceId: selectedWorkspaceID.value,
    });
    return;
  }

  //添加文档
  if (e.ctrlKey && e.key == 'e') {
    eventBus.emit('dialog-workspace:show', {
      type: 'edit',
    });
    return;
  }
});
</script>

<style lang="scss"></style>
