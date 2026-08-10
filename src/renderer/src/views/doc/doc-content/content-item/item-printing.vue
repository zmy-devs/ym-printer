<template>
  <ItemBase v-bind="$props" @click="handlePrint(data.id)">
    <template #icon>
      <Checkbox
        :id="data.id"
        v-if="status == 'price'"
        :model-value="checked.has(data.id)"
        @update:model-value="toggleCheck(data.id)"
      />

      <Spinner class="size-7 text-muted-foreground" v-else />
    </template>

    <template #before-title v-if="data.remark">
      <span> {{ data.remark }}</span>

      <span class="mx-1 text-muted-foreground"> | </span>
    </template>

    <template #actions>
      <span class="text-muted-foreground" v-if="data.status == 'upload'">
        正在上传...
      </span>

      <ButtonGroup v-if="data.status == 'printing'">
        <Tooltip label="继续打印奇数页">
          <Button variant="outline" size="sm" @click.stop="handleNext">
            <ArrowRightIcon /> 继续
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
import ItemBase from './item-base/index.vue';
import { Checkbox } from '@/components/ui/checkbox';
import { Doc } from '@type';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, XIcon } from '@lucide/vue';
import Tooltip from '@/components/tooltip.vue';
import { printNext, printCancel } from '@/stores/print';
import { ButtonGroup } from '@/components/ui/button-group';
import { checked, toggleCheck } from '../../check.js';
import { status } from '../../index';

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
