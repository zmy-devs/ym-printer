<template>
  <section class="h-10 pl-2 pr-34 flex items-center shrink-0 app-drag">
    <Tooltip label="切换侧边栏可见性" side="bottom">
      <Button
        class="app-no-drag"
        variant="ghost"
        size="icon-xs"
        @click="toggleSilderbar"
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
import {
  panelRef,
  rightPanelRef,
  toggleRightSidebar,
  toggleSilderbar,
} from '../index';
</script>

<style scoped lang="scss"></style>
