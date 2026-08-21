<template>
  <Container class="flex flex-col gap-8">
    <ItemGroup>
      <p class="px-4 py-3">界面</p>

      <ItemSeparator />

      <Item size="sm">
        <ItemContent>
          <ItemTitle>基础主题</ItemTitle>

          <ItemDescription>设置 {{ productName }} 的基础主题</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Select v-model="baseTheme">
            <SelectTrigger class="w-40">
              <SelectValue>
                <component :is="selectedBaseThemeOption.icon" class="size-4" />

                <span>{{ selectedBaseThemeOption.label }}</span>
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                v-for="option in baseThemeOptions"
                :key="option.value"
                :value="option.value"
              >
                <component :is="option.icon" class="size-4" />

                <span>{{ option.label }}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </ItemActions>
      </Item>

      <Item size="sm">
        <ItemContent>
          <ItemTitle>主题色</ItemTitle>

          <ItemDescription>设置界面控件的强调色</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Select v-model="themeColor">
            <SelectTrigger class="w-40">
              <SelectValue>
                <span
                  class="size-4 shrink-0 rounded-full border"
                  :style="{ background: themeColorMap[themeColor].color }"
                />

                <span>{{ themeColorMap[themeColor].label }}</span>
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                v-for="(option, value) in themeColorMap"
                :key="value"
                :value="value"
              >
                <span
                  class="size-4 shrink-0 rounded-full border"
                  :style="{ background: option.color }"
                />

                <span>{{ option.label }}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </ItemActions>
      </Item>

      <Item size="sm">
        <ItemContent>
          <ItemTitle>文档主题</ItemTitle>

          <ItemDescription>设置预览文档的主题</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Select v-model="previewThemeRaw">
            <SelectTrigger class="w-40">
              <SelectValue>
                <component
                  :is="selectedPreviewThemeOption.icon"
                  class="size-4"
                />

                <span>{{ selectedPreviewThemeOption.label }}</span>
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                v-for="option in previewThemeOptions"
                :key="option.value"
                :value="option.value"
              >
                <component :is="option.icon" class="size-4" />

                <span>{{ option.label }}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </ItemActions>
      </Item>
    </ItemGroup>
  </Container>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { baseThemeMap, previewThemeMap, themeColorMap } from '@/map';
import { productName } from '@shared/app-info';
import { type ThemeMode, useThemeStore } from '@/stores/theme.store';
import { MonitorIcon, MoonIcon, SunIcon } from '@lucide/vue';

// 明暗主题选项结构
type ThemeOption = {
  value: ThemeMode;
  label: string;
  icon: Component;
};

// 主题状态仓库
const themeStore = useThemeStore();

// 当前主题设置状态
const { baseTheme, previewThemeRaw, themeColor } = storeToRefs(themeStore);

// 基础主题下拉选项
const baseThemeOptions: ThemeOption[] = [
  { value: 'auto', label: baseThemeMap.auto, icon: MonitorIcon },
  { value: 'light', label: baseThemeMap.light, icon: SunIcon },
  { value: 'dark', label: baseThemeMap.dark, icon: MoonIcon },
];

// 文档主题下拉选项
const previewThemeOptions: ThemeOption[] = [
  { value: 'auto', label: previewThemeMap.auto, icon: MonitorIcon },
  { value: 'light', label: previewThemeMap.light, icon: SunIcon },
  { value: 'dark', label: previewThemeMap.dark, icon: MoonIcon },
];

// 当前基础主题选项
const selectedBaseThemeOption = computed(() => {
  return (
    baseThemeOptions.find((option) => {
      return option.value === baseTheme.value;
    }) ?? baseThemeOptions[0]
  );
});

// 当前文档主题选项
const selectedPreviewThemeOption = computed(() => {
  return (
    previewThemeOptions.find((option) => {
      return option.value === previewThemeRaw.value;
    }) ?? previewThemeOptions[0]
  );
});
</script>

<style scoped lang="scss"></style>
