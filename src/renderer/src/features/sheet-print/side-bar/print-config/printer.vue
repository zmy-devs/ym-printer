<template>
  <Field name="printer" v-slot="{ componentField }">
    <SelectPrinter class="w-full" variant="outline" v-bind="componentField" />
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/field.vue';
import SelectPrinter from '@/components/select-printer.vue';
</script>

<style scoped lang="scss"></style>
