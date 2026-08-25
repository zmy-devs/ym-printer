<template>
  <FormField v-slot="{ componentField, errorMessage }" :name="name">
    <FormItem>
      <FormLabel class="flex items-center gap-1.5" v-if="label">
        <component v-if="icon" :is="icon" class="size-3.5" />

        {{ errorMessage ? errorMessage : label }}

        <Tooltip :label="tooltip" v-if="tooltip">
          <CircleQuestionMarkIcon class="size-3 text-muted-foreground" />
        </Tooltip>
      </FormLabel>

      <FormControl>
        <slot :componentField="componentField"></slot>
      </FormControl>
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { CircleQuestionMarkIcon } from '@lucide/vue';
import Tooltip from './tooltip.vue';

defineProps<{
  name: string;
  label?: string;
  icon?: Component;
  tooltip?: string;
}>();
</script>

<style scoped lang="scss"></style>
