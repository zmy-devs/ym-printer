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
              v-model="clientName"
            />

            <InputGroupAddon align="inline-end" v-if="isClientNameChanged">
              <InputGroupButton variant="default" @click="handleSaveClientName">
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
import Container from '@/components/container.vue';
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
const clientName = ref(settings.value.clientName);

// 工作空间名称是否已修改
const isClientNameChanged = computed(() => {
  return clientName.value !== settings.value.clientName;
});

// 保存工作空间名称
const handleSaveClientName = () => {
  settings.value.clientName = clientName.value;
};
</script>

<style scoped lang="scss"></style>
