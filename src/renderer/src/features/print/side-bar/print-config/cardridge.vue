<template>
  <Field
    name="color"
    label="颜色"
    :icon="PaletteIcon"
    v-slot="{ componentField }"
  >
    <SegmentedControl v-bind="componentField">
      <SegmentedControlItem
        v-for="[value, label] in Object.entries(cartridgeMap)"
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
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/components/common/segmented-control';
import { cartridgeMap } from '@/map';
import { PaletteIcon } from '@lucide/vue';
</script>

<style scoped lang="scss"></style>
