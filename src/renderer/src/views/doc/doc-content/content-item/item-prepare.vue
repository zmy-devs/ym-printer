<template>
  <ItemBase v-bind="$props" @click="handlePrint(data.id)">
    <template #icon v-if="status == 'price'">
      <Checkbox
        :id="data.id"
        :model-value="checked.has(data.id)"
        @update:model-value="toggleCheck(data.id)"
      />
    </template>

    <template #before-title v-if="data.remark">
      <span> {{ data.remark }}</span>

      <span class="mx-1 text-muted-foreground"> | </span>
    </template>

    <template #actions>
      <ButtonGroup>
        <Tooltip label="准备就绪，开始打印">
          <Button variant="outline" size="sm" @click.stop="handleNext">
            <PrinterIcon /> 开始
          </Button>
        </Tooltip>

        <Tooltip label="取消">
          <Button variant="outline" size="icon-sm" @click.stop="handleCancel">
            <XIcon class="size-4" />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </template>
  </ItemBase>
</template>

<script setup lang="ts">
import { Checkbox } from '@/components/ui/checkbox';
import { Doc } from '@type';
import { Button } from '@/components/ui/button';
import { PrinterIcon, XIcon } from '@lucide/vue';
import Tooltip from '@/components/tooltip.vue';
import { printNext, printCancel } from '@/stores/print';
import { ButtonGroup } from '@/components/ui/button-group';
import { status } from '../../index';
import { checked, toggleCheck } from '../../check.js';
import ItemBase from './item-base/index.vue';

const props = defineProps<{
  data: Doc;
}>();

const handleNext = () => {
  printNext(props.data.id);
};

const handleCancel = () => {
  printCancel(props.data.id);
};

const handlePrint: (id: string) => void = inject('handlePrint')!;
</script>

<style scoped lang="scss"></style>
