<template>
  <Container class="flex flex-col gap-8">
    <ItemGroup>
      <p class="px-4 py-3">团队协作</p>

      <ItemSeparator />

      <Item>
        <ItemContent>
          <ItemTitle>工作空间名称</ItemTitle>

          <ItemDescription>
            你的工作空间名称最多可包含 65 个字符
          </ItemDescription>

          <InputGroup class="max-w-70 mt-3">
            <InputGroupInput
              placeholder="请输入你的工作空间名称"
              v-model="workspaceName"
            />

            <InputGroupAddon align="inline-end" v-if="isWorkspaceNameChanged">
              <InputGroupButton
                variant="default"
                @click="handleSaveWorkspaceName"
              >
                <span class="text-xs">保存</span>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </ItemContent>
      </Item>

      <Item>
        <ItemContent>
          <ItemTitle>客户端 ID</ItemTitle>

          <ItemDescription>用于在团队协作中唯一标识当前客户端</ItemDescription>

          <Input
            class="max-w-70 mt-3"
            readonly
            :model-value="settings.clientId"
          />
        </ItemContent>
      </Item>
    </ItemGroup>
  </Container>
</template>

<script setup lang="ts">
import Container from '@/components/common/container.vue';
import { Input } from '@/components/ui/input';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';
import { useSettingsStore } from '@/stores/settings.store';

// 应用设置状态
const settingsStore = useSettingsStore();
// 应用设置数据
const { settings } = storeToRefs(settingsStore);
// 待保存的工作空间名称
const workspaceName = ref(settings.value.workspaceName);

// 工作空间名称是否已修改
const isWorkspaceNameChanged = computed(() => {
  return workspaceName.value !== settings.value.workspaceName;
});

// 保存工作空间名称
const handleSaveWorkspaceName = () => {
  settings.value.workspaceName = workspaceName.value;
};
</script>

<style scoped lang="scss"></style>
