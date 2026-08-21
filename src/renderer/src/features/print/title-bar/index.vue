<template>
  <section class="h-10 pl-3 pr-2 flex items-center gap-2 shrink-0">
    <FileIcon :ext="selectedDoc?.ext" />

    <span class="text-sm font-medium">
      {{ selectedDoc?.name }}
    </span>

    <Tooltip label="切换文档主题">
      <Button
        class="ml-auto"
        variant="ghost"
        size="icon-sm"
        @click="togglePreviewTheme"
      >
        <MoonIcon class="size-4.5" v-if="previewTheme == 'dark'" />

        <SunIcon class="size-4.5" v-else />
      </Button>
    </Tooltip>

    <SheetClose>
      <Button variant="ghost" size="icon-sm">
        <XIcon class="size-4.5" />
      </Button>
    </SheetClose>
  </section>
</template>

<script setup lang="ts">
import { SheetClose } from '@/components/ui/sheet';
import FileIcon from '@/components/file-icon.vue';
import { useSelectionStore } from '@/stores/selection.store';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, XIcon } from '@lucide/vue';
import Tooltip from '@/components/tooltip.vue';
import { useThemeStore } from '@/stores/theme.store';

const { selectedDoc } = storeToRefs(useSelectionStore());
const { previewTheme } = storeToRefs(useThemeStore());
const { togglePreviewTheme } = useThemeStore();
</script>

<style scoped lang="scss"></style>
