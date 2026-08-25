<template>
  <Field
    name="duplexMode"
    label="双面方式"
    :icon="FilesIcon"
    tooltip="自动：自动双面打印
    手动：手动双面打印"
    v-slot="{ componentField }"
  >
    <Tooltip label="当前打印机不支持双面打印" :disabled="canAutoDuplex">
      <span>
        <SegmentedControl v-bind="componentField" :disabled="!canAutoDuplex">
          <SegmentedControlItem value="auto">自动</SegmentedControlItem>

          <SegmentedControlItem value="manual">手动</SegmentedControlItem>
        </SegmentedControl>
      </span>
    </Tooltip>
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/components/common/segmented-control';
import Tooltip from '@/components/common/tooltip.vue';
import { useSheetPrintContext } from '../../context';
import { FilesIcon } from '@lucide/vue';

// 打印 Sheet 共享状态
const { canAutoDuplex } = useSheetPrintContext();
</script>

<style scoped lang="scss"></style>
