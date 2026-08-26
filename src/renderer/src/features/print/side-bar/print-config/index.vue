<template>
  <ScrollArea class="min-h-0" view-class="p-4">
    <FieldGroup>
      <Printer :disabled="disabledControls.includes('printer')" />

      <Remark :disabled="disabledControls.includes('remark')" />

      <Copies :disabled="disabledControls.includes('copies')" />

      <Range :disabled="disabledControls.includes('range')" />

      <DuplexMode :disabled="disabledControls.includes('duplex-mode')" />

      <Color :disabled="disabledControls.includes('color')" />

      <Orientation :disabled="disabledControls.includes('orientation')" />
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
import { useSheetPrintContext } from '../../context';

// 当前需要禁用的打印控件
const { disabledControls } = useSheetPrintContext();
</script>

<style scoped lang="scss"></style>
