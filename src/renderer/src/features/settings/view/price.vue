<template>
  <Container class="flex flex-col gap-8">
    <ItemGroup>
      <p class="px-4 py-3">计价配置</p>

      <ItemSeparator />

      <Item size="sm">
        <ItemContent>
          <ItemTitle>计价模式</ItemTitle>

          <ItemDescription>开启后可以对文档进行计价</ItemDescription>
        </ItemContent>

        <ItemActions>
          <Switch v-model="settings.price" />
        </ItemActions>
      </Item>
    </ItemGroup>

    <fieldset class="flex flex-col gap-8" :disabled="!settings.price">
      <ItemGroup>
        <p class="px-4 py-3">黑白价格</p>

        <ItemSeparator />

        <Item size="sm">
          <ItemContent>
            <ItemTitle>单面价格</ItemTitle>

            <ItemDescription>黑白单面打印的价格</ItemDescription>
          </ItemContent>

          <ItemActions>
            <NumberField
              v-model="settings.blackSimplexPrice"
              :min="0"
              :max="999"
              :step="0.01"
              :format-options="numberFormatOptions"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </ItemActions>
        </Item>

        <Item size="sm">
          <ItemContent>
            <ItemTitle>双面价格</ItemTitle>

            <ItemDescription>黑白双面打印的价格</ItemDescription>
          </ItemContent>

          <ItemActions>
            <NumberField
              v-model="settings.blackDuplexPrice"
              :min="0"
              :max="999"
              :step="0.01"
              :format-options="numberFormatOptions"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </ItemActions>
        </Item>
      </ItemGroup>

      <ItemGroup>
        <p class="px-4 py-3">彩色价格</p>

        <ItemSeparator />

        <Item size="sm">
          <ItemContent>
            <ItemTitle>单面价格</ItemTitle>

            <ItemDescription>彩色单面打印的价格</ItemDescription>
          </ItemContent>

          <ItemActions>
            <NumberField
              v-model="settings.colorSimplexPrice"
              :min="0"
              :max="999"
              :step="0.01"
              :format-options="numberFormatOptions"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </ItemActions>
        </Item>

        <Item size="sm">
          <ItemContent>
            <ItemTitle>双面价格</ItemTitle>

            <ItemDescription>彩色双面打印的价格</ItemDescription>
          </ItemContent>

          <ItemActions>
            <NumberField
              v-model="settings.colorDuplexPrice"
              :min="0"
              :max="999"
              :step="0.01"
              :format-options="numberFormatOptions"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </ItemActions>
        </Item>
      </ItemGroup>
    </fieldset>
  </Container>
</template>

<script setup lang="ts">
import { Switch } from '@/components/ui/switch';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
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

// 价格字段的两位小数格式
const numberFormatOptions = {
  style: 'decimal' as const,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

// 当前计价配置状态
const { settings } = storeToRefs(useSettingsStore());
</script>

<style scoped lang="scss"></style>
