<template>
  <Container class="flex flex-col gap-8">
    <ItemGroup>
      <p class="px-4 py-3">工作空间</p>

      <ItemSeparator />

      <Item>
        <ItemContent>
          <ItemTitle>工作空间 ID</ItemTitle>

          <ItemDescription>用于唯一标识当前工作空间</ItemDescription>
        </ItemContent>

        <ItemActions>
          <span class="truncate text-muted-foreground">
            {{ settings.workspaceId }}
          </span>

          <Tooltip label="点击复制 ID">
            <Button
              class="shrink-0"
              variant="ghost"
              size="icon-xs"
              @click="handleCopyWorkspaceId"
            >
              <CopyIcon class="text-muted-foreground" />
            </Button>
          </Tooltip>
        </ItemActions>
      </Item>
    </ItemGroup>
  </Container>
</template>

<script setup lang="ts">
import Container from '@/components/common/container.vue';
import Tooltip from '@/components/common/tooltip.vue';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import { useSettingsStore } from '@/stores/settings.store';
import { CopyIcon } from '@lucide/vue';
import { useClipboard } from '@vueuse/core';

// 应用设置状态
const settingsStore = useSettingsStore();
// 应用设置数据
const { settings } = storeToRefs(settingsStore);
// 工作空间 ID 复制方法
const { copy } = useClipboard();

// 复制工作空间 ID
const handleCopyWorkspaceId = () => {
  copy(settings.value.workspaceId);
};
</script>

<style scoped lang="scss"></style>
