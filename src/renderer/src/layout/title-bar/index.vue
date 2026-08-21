<template>
  <section class="h-10 pl-1.5 pr-37 flex items-center shrink-0 app-drag">
    <Tooltip label="切换侧边栏可见性" side="right">
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

    <TitleBarUpdate class="ml-auto" />
  </section>
</template>

<script setup lang="ts">
import Tooltip from '@/components/tooltip.vue';
import { Button } from '@/components/ui/button';
import { PanelLeftCloseIcon, PanelLeftIcon } from '@lucide/vue';
import { panelRef, toggleSilderbar } from '../index';
import TitleBarUpdate from './title-bar-update.vue';
</script>

<style scoped lang="scss"></style>
