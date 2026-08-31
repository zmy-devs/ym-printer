<template>
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <CircleXIcon class="text-destructive-foreground" />
      </EmptyMedia>

      <EmptyTitle>文档加载失败</EmptyTitle>

      <EmptyDescription>
        当前文档加载失败，请检查文档是否存在、格式是否正确或网络连接是否正常后重试。
      </EmptyDescription>

      <EmptyContent>
        <Button :disabled="reloadLock" @click="reloadLock || handleReload()">
          <Spinner v-if="reloadLock" />

          <RotateCwIcon v-else />

          重新加载
        </Button>
      </EmptyContent>
    </EmptyHeader>
  </Empty>
</template>

<script setup lang="ts">
import { CircleXIcon, RotateCwIcon } from '@lucide/vue';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useSheetPrintContext } from '../context';

// 文档重新加载操作锁与执行函数
const { reloadLock, handleReload } = useSheetPrintContext();
</script>

<style scoped lang="scss"></style>
