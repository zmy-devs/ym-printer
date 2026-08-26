<template>
  <Field name="printer" v-slot="{ componentField }">
    <SelectPrinter
      class="w-full"
      variant="outline"
      :disabled="disabled"
      v-bind="componentField"
    />
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import SelectPrinter from '@/components/features/select-printer.vue';

// 打印机配置控件参数
defineProps<{
  disabled?: boolean;
}>();
</script>

<style scoped lang="scss"></style>
