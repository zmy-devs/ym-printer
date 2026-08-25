<template>
  <Field name="printer" v-slot="{ componentField }">
    <SelectPrinter class="w-full" variant="outline" v-bind="componentField" />
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import SelectPrinter from '@/components/features/select-printer.vue';
</script>

<style scoped lang="scss"></style>
