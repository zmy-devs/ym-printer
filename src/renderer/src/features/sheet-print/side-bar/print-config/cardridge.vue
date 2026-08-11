<template>
  <Field
    name="cartridge"
    label="墨盒颜色"
    :icon="PaletteIcon"
    v-slot="{ componentField }"
  >
    <Select v-bind="componentField">
      <SelectTrigger class="min-w-0 w-full">
        <SelectValue placeholder="请选择墨盒颜色" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem
          v-for="item in Object.keys(cartridgeMap)"
          :key="item"
          :value="item"
        >
          {{ cartridgeMap[item] }}
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
import { cartridgeMap } from '@/map';
import { PaletteIcon } from '@lucide/vue';
</script>

<style scoped lang="scss"></style>
