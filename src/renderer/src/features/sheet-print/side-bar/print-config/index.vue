<template>
  <ScrollArea class="min-h-0" view-class="p-4">
    <FieldGroup>
      <Printer />

      <Remark />

      <Count />

      <Range />

      <Cardridge />

      <Orientation />
    </FieldGroup>
  </ScrollArea>
</template>

<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import { FieldGroup } from '@/components/ui/field';
import Remark from './remark.vue';
import Printer from './printer.vue';
import Count from './count.vue';
import Range from './range.vue';
import Cardridge from './cardridge.vue';
import Orientation from './orientation.vue';
</script>

<style scoped lang="scss"></style>
