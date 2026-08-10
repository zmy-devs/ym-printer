<template>
  <Container>
    <div class="pt-8 flex flex-col gap-8">
      <ItemGroup>
        <p class="py-3 px-4">更新配置</p>

        <ItemSeparator />

        <Item size="sm">
          <ItemContent>
            <ItemTitle>自动更新</ItemTitle>

            <ItemDescription> 开启后自动获取更新 </ItemDescription>
          </ItemContent>

          <ItemActions>
            <Switch v-model="config.autoUpdate" />
          </ItemActions>
        </Item>

      </ItemGroup>

      <ItemGroup>
        <p class="py-3 px-4">更新</p>

        <ItemSeparator />

        <Item size="sm">
          <ItemContent>
            <ItemTitle>更新内容</ItemTitle>

            <ItemDescription> 查看当前版本更新内容</ItemDescription>
          </ItemContent>

          <ItemActions>
            <Button size="sm" variant="outline" @click="handleUpdateContent">
              查看
            </Button>
          </ItemActions>
        </Item>

        <Item size="sm">
          <ItemContent>
            <ItemTitle>检查更新</ItemTitle>

            <ItemDescription> 查看当前版本更新内容</ItemDescription>
          </ItemContent>

          <ItemActions>
            <Button size="sm" @click="checkUpdate" v-if="status == 'init'">
              检查更新
            </Button>

            <span class="text-sm" v-else>{{ updateLabel }}</span>

            <Button
              size="sm"
              @click="installUpdate"
              v-if="status == 'downloaded'"
            >
              安装更新
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { Switch } from '@/components/ui/switch';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemSeparator,
  ItemTitle,
  ItemActions,
  ItemGroup,
} from '@/components/ui/item';
import Container from '@/components/container/index.vue';
import { useConfigStore } from '@/stores/useConfigStore';
import { Button } from '@/components/ui/button';
import { repoMap, updateMap } from '@/map';
import { useUpdateStore } from '@/stores/useUpdateStore';

const { config } = storeToRefs(useConfigStore());
const { status, downloadProgress } = storeToRefs(useUpdateStore());
const { checkUpdate, installUpdate } = useUpdateStore();

//更新文字
const updateLabel = computed(() => {
  const res = updateMap[status.value];

  if (typeof res == 'function') {
    return res(downloadProgress.value);
  }

  return res;
});

//查看更新内容
const handleUpdateContent = () => {
  ipc.openUrl(repoMap.gitee.updateContentUrl);
};
</script>

<style scoped lang="scss"></style>
