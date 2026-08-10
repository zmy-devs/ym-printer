<template>
  <section
    class="p-2 relative flex justify-between items-center gap-1 border-b"
  >
    <Button class="mr-auto" variant="ghost" size="sm">
      <span class="text-sm">共{{ selectedDoc.pageCount }}页</span>
    </Button>

    <NumberField
      class="absolute left-1/2 -translate-x-1/2"
      :step="0.05"
      :min="0.05"
      :max="2"
      :format-options="{
        style: 'percent',
      }"
      v-model="scale"
    >
      <NumberFieldContent class="bg-transparent!">
        <NumberFieldDecrement />

        <NumberFieldInput class="border-none ring-0! shadow-none" />

        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>

    <ToggleGroup variant="outline" type="single" v-model="viewMode">
      <ToggleGroupItem
        v-for="item in Object.keys(viewMap)"
        :key="item"
        :value="item"
      >
        <span>{{ viewMap[item] }}</span>
      </ToggleGroupItem>
    </ToggleGroup>
  </section>
</template>

<script setup lang="ts">
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field';
import { usePdfStore } from '@/stores/pdf';
import { Button } from '@/components/ui/button';
import { useDocStore } from '@/stores/doc';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { viewMap } from '@/map';

const { selectedDoc } = storeToRefs(useDocStore());
const { scale } = storeToRefs(usePdfStore());
const { viewMode } = storeToRefs(usePdfStore());
</script>

<style scoped lang="scss"></style>
