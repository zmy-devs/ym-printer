<template>
  <Field
    name="mode"
    label="打印模式"
    :icon="SlidersHorizontalIcon"
    v-slot="{ componentField }"
  >
    <Select v-bind="componentField">
      <SelectTrigger class="min-w-0 w-full">
        <SelectValue placeholder="请选择打印模式">
          {{ modeMap[componentField.modelValue] }}
        </SelectValue>
      </SelectTrigger>

      <SelectContent>
        <SelectItem
          v-for="item in Object.keys(modeMap)"
          :key="item"
          :value="item"
        >
          <div class="flex flex-col">
            <span>
              {{ modeMap[item] }}
            </span>

            <span class="text-xs text-muted-foreground">
              {{ modeDescriptionMap[item] }}
            </span>
          </div>
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
import { modeDescriptionMap, modeMap } from '@/map';
import { SlidersHorizontalIcon } from '@lucide/vue';
</script>

<style scoped lang="scss"></style>
