<template>
  <ScrollArea class="min-h-0" view-class="p-4">
    <FieldGroup>
      <Printer />

      <Remark />

      <Copies />

      <Range />

      <DuplexMode />

      <Color />

      <Orientation />
    </FieldGroup>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import { FieldGroup } from '@/components/ui/field';
import Remark from './remark.vue';
import Printer from './printer.vue';
import Copies from './copies.vue';
import Range from './range.vue';
import DuplexMode from './duplex-mode.vue';
import Color from './color.vue';
import Orientation from './orientation.vue';
</script>

<style scoped lang="scss"></style>
