<template>
  <Container class="flex flex-col gap-8">
    <ItemGroup>
      <p class="px-4 py-3">关于</p>

      <ItemSeparator />

      <Item size="sm">
        <ItemContent>
          <ItemTitle>反馈问题</ItemTitle>

          <ItemDescription>反馈应用存在的 bug</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Button size="sm" variant="outline" @click="handleOpenIssue">
            反馈
          </Button>
        </ItemActions>
      </Item>

      <Item size="sm">
        <ItemContent>
          <ItemTitle>版本</ItemTitle>

          <ItemDescription>当前应用的版本</ItemDescription>
        </ItemContent>

        <ItemActions>v{{ appVersion }}</ItemActions>
      </Item>
    </ItemGroup>

    <ItemGroup>
      <p class="px-4 py-3">重置</p>

      <ItemSeparator />

      <Item size="sm">
        <ItemContent>
          <ItemTitle>恢复默认设置</ItemTitle>

          <ItemDescription>把设置还原成默认配置</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Button size="sm" variant="destructive" @click="handleReset">
            重置
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  </Container>
</template>

<script setup lang="ts">
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
import { Button } from '@/components/ui/button';
import { appVersion } from '@shared/app-info';
import { useSettingsStore } from '@/stores/settings.store';
import { issueUrl } from '@/map';
import MessageBox from '@/components/message-box';

// 重置应用配置的方法
const { resetSettings } = useSettingsStore();

// 在浏览器中打开问题反馈页
const handleOpenIssue = () => {
  ipc.openUrl(issueUrl);
};

// 确认后恢复默认设置
const handleReset = async () => {
  const confirmed = await MessageBox.confirm({
    title: '是否要恢复默认设置',
    description: '此操作将会将应用的所有设置恢复成默认设置。',
  });

  if (!confirmed) {
    return;
  }

  resetSettings();
};
</script>

<style scoped lang="scss"></style>
