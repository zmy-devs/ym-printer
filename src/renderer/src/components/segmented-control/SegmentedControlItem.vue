<template>
  <ToggleGroupItem
    data-slot="segmented-control-item"
    v-bind="forwardedProps"
    :class="
      cn(
        'p-1.5 flex-1 flex-center rounded-md text-sm outline-none transition-colors disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm [&>span]:truncate',
        props.class,
      )
    "
  >
    <slot />
  </ToggleGroupItem>
</template>

<script setup lang="ts">
import type { ToggleGroupItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { reactiveOmit } from '@vueuse/core';
import { ToggleGroupItem, useForwardProps } from 'reka-ui';
import { cn } from '@/lib/utils';

// 分段选项的组件入参
const props = defineProps<
  ToggleGroupItemProps & {
    class?: HTMLAttributes['class'];
    value: string;
  }
>();

// 传递给底层选项的属性
const delegatedProps = reactiveOmit(props, 'class');

// 底层选项可接收的属性
const forwardedProps = useForwardProps(delegatedProps);
</script>

<style scoped lang="scss"></style>
