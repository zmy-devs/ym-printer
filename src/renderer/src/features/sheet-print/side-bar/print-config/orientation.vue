<template>
  <Field
    name="orientation"
    label="方向"
    :icon="RotateCwIcon"
    v-slot="{ componentField }"
  >
    <Select v-bind="componentField">
      <SelectTrigger class="min-w-0 w-full">
        <SelectValue placeholder="请选择方向" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem
          v-for="item in Object.keys(orientationMap)"
          :key="item"
          :value="item"
        >
          {{ orientationMap[item] }}
        </SelectItem>
      </SelectContent>
    </Select>
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/field.vue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { orientationMap } from '@/map';
import { RotateCwIcon } from '@lucide/vue';
</script>

<style scoped lang="scss"></style>
