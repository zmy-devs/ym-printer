<template>
  <section class="h-10 pl-2 pr-34 flex items-center shrink-0 app-drag">
    <Tooltip label="切换侧边栏可见性" side="bottom">
      <Button
        class="app-no-drag"
        variant="ghost"
        size="icon-xs"
        @click="toggleSidebar"
      >
        <PanelLeftCloseIcon v-if="panelRef?.isExpanded" />

        <PanelLeftIcon v-else />
      </Button>
    </Tooltip>

    <Tooltip trigger-class="ml-auto" label="切换右侧边栏可见性" side="bottom">
      <Button
        class="app-no-drag"
        variant="ghost"
        size="icon-xs"
        @click="toggleRightSidebar"
      >
        <PanelRightCloseIcon v-if="rightPanelRef?.isExpanded" />

        <PanelRightIcon v-else />
      </Button>
    </Tooltip>
  </section>
</template>

<script setup lang="ts">
import Tooltip from '@/components/common/tooltip.vue';
import { Button } from '@/components/ui/button';
import {
  PanelLeftCloseIcon,
  PanelLeftIcon,
  PanelRightCloseIcon,
  PanelRightIcon,
} from '@lucide/vue';
import { useWorkspaceContext } from '../index';

// 当前工作区的边栏面板实例与切换操作
const { panelRef, rightPanelRef, toggleRightSidebar, toggleSidebar } =
  useWorkspaceContext();
</script>

<style scoped lang="scss"></style>
