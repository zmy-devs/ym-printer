<template>
  <Dialog v-model:open="open">
    <DialogContent
      :aria-describedby="undefined"
      class="h-[min(70vh,35rem)] max-w-xl! overflow-hidden p-0!"
    >
      <DialogHeader class="border-b px-6 py-4">
        <DialogTitle>打印范围预设</DialogTitle>
      </DialogHeader>

      <Container class="h-[calc(100%-65px)] flex flex-col gap-8">
        <PresetEmpty v-if="presets.length === 0" />

        <ItemGroup v-else>
          <div class="flex items-center">
            <p class="px-4 py-3">打印范围预设</p>

            <Button class="ml-auto w-fit" size="sm" @click="handleAdd">
              <PlusIcon />

              <span>新建预设</span>
            </Button>
          </div>

          <ItemSeparator class="mb-4" />

          <PresetItem
            v-for="preset in presets"
            :key="preset.id"
            :data="preset"
          />
        </ItemGroup>
      </Container>
    </DialogContent>
  </Dialog>

  <PresetFormDialog />
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ItemGroup, ItemSeparator } from '@/components/ui/item';
import Container from '@/components/container.vue';
import { eventBus } from '@/utils/event-bus';
import { usePresetStore } from '@/stores/preset';
import { PlusIcon } from '@lucide/vue';
import PresetEmpty from './preset-empty.vue';
import PresetFormDialog from './form-dialog.vue';
import PresetItem from './preset-item.vue';

// 预设管理弹窗开关状态
const open = ref(false);

// 当前预设列表
const { presets } = storeToRefs(usePresetStore());

// 打开新建预设弹窗
const handleAdd = () => {
  eventBus.emit('dialog-preset-form:show', {
    type: 'add',
  });
};

// 响应预设管理弹窗打开事件
eventBus.on('dialog-preset:show', () => {
  open.value = true;
});
</script>

<style scoped lang="scss"></style>
