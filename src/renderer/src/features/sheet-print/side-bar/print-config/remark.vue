<template>
  <Field
    name="remark"
    label="备注"
    :icon="PencilLineIcon"
    v-slot="{ componentField }"
  >
    <Input placeholder="当前打印任务的备注" v-bind="componentField" />
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/field.vue';
import { Input } from '@/components/ui/input';
import { PencilLineIcon } from '@lucide/vue';
</script>

<style scoped lang="scss"></style>

