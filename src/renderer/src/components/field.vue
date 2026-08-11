<template>
  <FormField v-slot="{ componentField, errorMessage }" :name="name">
    <FormItem>
      <FormLabel class="flex items-center gap-1.5">
        <component v-if="icon" :is="icon" class="size-3.5" />

        {{ errorMessage ? errorMessage : label }}
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

defineProps<{
  name: string;
  label: string;
  icon?: Component;
}>();
</script>

<style scoped lang="scss"></style>

