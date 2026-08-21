<template>
  <Container class="flex flex-col gap-8">
    <ItemGroup>
      <p class="px-4 py-3">更新配置</p>

      <ItemSeparator />

      <Item size="sm">
        <ItemContent>
          <ItemTitle>自动更新</ItemTitle>

          <ItemDescription>开启后自动获取更新</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Switch v-model="settings.autoUpdate" />
        </ItemActions>
      </Item>
    </ItemGroup>

    <ItemGroup>
      <p class="px-4 py-3">更新</p>

      <ItemSeparator />

      <Item size="sm">
        <ItemContent>
          <ItemTitle>更新内容</ItemTitle>

          <ItemDescription>查看当前版本更新内容</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Button size="sm" variant="outline" @click="handleOpenUpdateContent">
            查看
          </Button>
        </ItemActions>
      </Item>

      <Item size="sm">
        <ItemContent>
          <ItemTitle>检查更新</ItemTitle>

          <ItemDescription>检查当前版本是否有可用更新</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Button v-if="status === 'init'" size="sm" @click="checkUpdate">
            检查更新
          </Button>

          <span v-else class="text-sm">{{ updateLabel }}</span>

          <Button
            v-if="status === 'downloaded'"
            size="sm"
            @click="installUpdate"
          >
            安装更新
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  </Container>
</template>

<script setup lang="ts">
import { Switch } from '@/components/ui/switch';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import Container from '@/components/container.vue';
import { useSettingsStore } from '@/stores/settings.store';
import { Button } from '@/components/ui/button';
import { updateContentUrl, updateMap } from '@/map';
import {
  checkUpdate,
  downloadProgress,
  installUpdate,
  status,
} from '@/services/update.service';

// 当前更新配置状态
const { settings } = storeToRefs(useSettingsStore());

// 当前更新状态的显示文案
const updateLabel = computed(() => {
  const label = updateMap[status.value];

  if (typeof label === 'function') {
    return label(downloadProgress.value);
  }

  return label;
});

// 在浏览器中打开更新说明
const handleOpenUpdateContent = () => {
  ipc.openUrl(updateContentUrl);
};
</script>

<style scoped lang="scss"></style>
