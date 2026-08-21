<template>
  <Empty class="wh-full">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <FilesIcon />
      </EmptyMedia>

      <EmptyTitle>暂无文档</EmptyTitle>

      <EmptyDescription>
        你还没有新增任何文档，请开始新增你的文档. <br />
        你可以通过拖拽文档到应用上新增文档
      </EmptyDescription>
    </EmptyHeader>

    <EmptyContent>
      <Tooltip label="在当前组中新增文档" shortcut="Ctrl+O">
        <AddDocButton />
      </Tooltip>
    </EmptyContent>
  </Empty>
</template>

<script setup lang="ts">
import { FilesIcon } from '@lucide/vue';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import Tooltip from '@/components/tooltip.vue';
import AddDocButton from '@/components/add-doc-button.vue';
</script>
