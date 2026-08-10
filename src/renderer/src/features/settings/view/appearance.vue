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
              <SelectValue placeholder="请选择基础主题" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                v-for="item in Object.keys(baseThemeMap)"
                :key="item"
                :value="item"
              >
                {{ baseThemeMap[item] }}
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
              <SelectValue placeholder="请选择文档主题" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                v-for="item in Object.keys(previewThemeMap)"
                :key="item"
                :value="item"
              >
                {{ previewThemeMap[item] }}
              </SelectItem>
            </SelectContent>
          </Select>
        </ItemActions>
      </Item>
    </ItemGroup>
  </Container>
</template>

<script setup lang="ts">
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
import { baseThemeMap, previewThemeMap } from '@/map';
import { productName } from '@shared/app-info';
import { useThemeStore } from '@/stores/theme';

// 当前主题设置状态
const { baseTheme, previewThemeRaw } = storeToRefs(useThemeStore());
</script>

<style scoped lang="scss"></style>
