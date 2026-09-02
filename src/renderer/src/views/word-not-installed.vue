<template>
  <section class="wh-screen grid grid-rows-[40px_minmax(0,1fr)] bg-background">
    <header class="app-drag"></header>

    <main class="flex-1 flex-center">
      <Empty class="size-full rounded-none border-0">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlertIcon class="text-destructive-foreground" />
          </EmptyMedia>

          <EmptyTitle>未检测到 Microsoft Word</EmptyTitle>

          <EmptyDescription>
            应用需要桌面版 Microsoft Word 完成文档转换。<br />
            请安装 Word 后重启应用。
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button @click="handleInstallWord">
            <DownloadIcon />

            <span>安装 Word</span>
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  </section>
</template>

<script setup lang="ts">
import { TriangleAlertIcon, DownloadIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { wordDownloadUrl } from '@/map';

// 在系统默认浏览器中打开 Word 官方页面
const handleInstallWord = () => {
  return ipc.openUrl(wordDownloadUrl);
};
</script>

<style scoped lang="scss"></style>
