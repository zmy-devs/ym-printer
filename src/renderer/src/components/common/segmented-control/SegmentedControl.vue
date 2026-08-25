<template>
  <ToggleGroupRoot
    data-slot="segmented-control"
    v-bind="forwardedProps"
    type="single"
    :model-value="model"
    :class="
      cn(
        {
          'cursor-not-allowed': forwardedProps.disabled,
        },
        'w-full flex items-center gap-1 rounded-lg p-1 bg-accent/50',
        props.class,
      )
    "
    @update:model-value="handleUpdateModelValue"
  >
    <slot />
  </ToggleGroupRoot>
</template>

<script setup lang="ts">
import type { ToggleGroupRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ToggleGroupRoot, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

// 分段选择器的可透传配置
const props = defineProps<
  Omit<ToggleGroupRootProps<string>, 'defaultValue' | 'modelValue' | 'type'> & {
    class?: HTMLAttributes['class'];
  }
>();

// 当前选中的分段值
const model = defineModel<string>();

// 传递给底层选择器的属性
const delegatedProps = reactiveOmit(props, 'class');

// 底层选择器可接收的属性
const forwardedProps = useForwardProps(delegatedProps);

// 更新有效的分段值并忽略取消选择操作
const handleUpdateModelValue = (value: unknown) => {
  if (typeof value !== 'string') {
    return;
  }

  model.value = value;
};
</script>

<style scoped lang="scss"></style>
