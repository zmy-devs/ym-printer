<template>
  <Field
    name="remark"
    label="备注"
    :icon="PencilLineIcon"
    v-slot="{ componentField }"
  >
    <Input
      placeholder="当前打印任务的备注"
      :disabled="disabled"
      v-bind="componentField"
    />
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import { Input } from '@/components/ui/input';
import { PencilLineIcon } from '@lucide/vue';

// 备注配置控件参数
defineProps<{
  disabled?: boolean;
}>();
</script>

<style scoped lang="scss"></style>
