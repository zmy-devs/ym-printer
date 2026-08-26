<template>
  <Field
    name="orientation"
    label="方向"
    :icon="RotateCwIcon"
    v-slot="{ componentField }"
  >
    <SegmentedControl v-bind="componentField" :disabled="disabled">
      <SegmentedControlItem
        v-for="[value, label] in Object.entries(orientationMap)"
        :key="value"
        :value="value"
      >
        {{ label }}
      </SegmentedControlItem>
    </SegmentedControl>
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import { orientationMap } from '@/map';
import { RotateCwIcon } from '@lucide/vue';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/components/common/segmented-control';

// 方向配置控件参数
defineProps<{
  disabled?: boolean;
}>();
</script>

<style scoped lang="scss"></style>
