<template>
  <Field
    name="pageRange"
    label="打印范围"
    :icon="FileTextIcon"
    tooltip="页码：1(第1页)，3(第3页)，-1(倒数第1页)，-3(倒数第3页)
    范围：1-3(第1页到第3页)，1--1(第1页到倒数第1页)

    单面：当前范围所有内容单面打印
    双面：当前范围所有内容双面打印"
    v-slot="{ componentField }"
  >
    <RangeEditor
      :model-value="componentField.modelValue"
      :disabled="disabled"
      @update:model-value="componentField['onUpdate:modelValue']"
      @blur="componentField.onBlur"
    />
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import { FileTextIcon } from '@lucide/vue';
import RangeEditor from '@/components/features/print-range-editor/index.vue';

// 打印范围配置控件参数
defineProps<{
  disabled?: boolean;
}>();
</script>

<style scoped lang="scss"></style>
