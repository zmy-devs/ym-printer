<template>
  <Field
    name="pageRange"
    label="打印范围"
    :icon="FileTextIcon"
    v-slot="{ componentField }"
  >
    <RangeEditor
      :model-value="componentField.modelValue"
      @update:model-value="componentField['onUpdate:modelValue']"
      @blur="componentField.onBlur"
    />
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/field.vue';
import { FileTextIcon } from '@lucide/vue';
import RangeEditor from '@/components/print-range-editor/index.vue';
</script>

<style scoped lang="scss"></style>
