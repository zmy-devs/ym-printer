<template>
  <Field
    name="copies"
    label="打印份数"
    :icon="StickyNotesIcon"
    v-slot="{ componentField }"
  >
    <NumberField
      class="w-full"
      :default-value="1"
      :min="1"
      :max="999"
      v-bind="componentField"
    >
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput class="shadow-xs" />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
import { StickyNotesIcon } from '@lucide/vue';
</script>

<style scoped lang="scss"></style>
