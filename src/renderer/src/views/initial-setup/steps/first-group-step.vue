<template>
  <section class="flex flex-col gap-8">
    <Field name="groupName" label="组名称" v-slot="{ componentField }">
      <Input placeholder="请输入组名称" v-bind="componentField" />
    </Field>

    <Field name="groupPrinter" label="组打印机" v-slot="{ componentField }">
      <SelectPrinter
        class="w-full"
        variant="outline"
        :icon-visible="false"
        v-bind="componentField"
      />
    </Field>
  </section>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import SelectPrinter from '@/components/features/select-printer.vue';
import { Input } from '@/components/ui/input';
</script>

<style scoped lang="scss"></style>
