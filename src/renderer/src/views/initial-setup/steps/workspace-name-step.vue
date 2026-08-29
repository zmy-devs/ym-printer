<template>
  <section>
    <Field
      name="workspaceName"
      label="工作空间名称"
      v-slot="{ componentField }"
    >
      <Input
        placeholder="请输入工作空间名称"
        maxlength="65"
        v-bind="componentField"
      />
    </Field>
  </section>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import { Input } from '@/components/ui/input';
</script>

<style scoped lang="scss"></style>
