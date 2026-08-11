<template>
  <section class="h-10 pl-3 pr-2 flex items-center gap-2 shrink-0">
    <FileIcon :ext="selectedDoc?.ext" size="24" />

    <span class="text-sm"> {{ selectedDoc?.name }}</span>

    <Tooltip label="切换文档主题">
      <Button
        class="ml-auto text-muted-foreground"
        variant="ghost"
        size="icon-sm"
        @click="togglePreviewTheme"
      >
        <MoonIcon class="size-4.5" v-if="previewTheme == 'dark'" />

        <SunIcon class="size-4.5" v-else />
      </Button>
    </Tooltip>

    <Tooltip label="关闭">
      <SheetClose>
        <Button
          class="ml-auto text-muted-foreground"
          variant="ghost"
          size="icon-sm"
        >
          <XIcon class="size-5" />
        </Button>
      </SheetClose>
    </Tooltip>
  </section>
</template>

<script setup lang="ts">
import { SheetClose } from '@/components/ui/sheet';
import FileIcon from '@/components/file-icon.vue';
import { useDocStore } from '@/stores/doc';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon, XIcon } from '@lucide/vue';
import Tooltip from '@/components/tooltip.vue';
import { useThemeStore } from '@/stores/theme';

const { selectedDoc } = storeToRefs(useDocStore());
const { previewTheme } = storeToRefs(useThemeStore());
const { togglePreviewTheme } = useThemeStore();
</script>

<style scoped lang="scss"></style>
