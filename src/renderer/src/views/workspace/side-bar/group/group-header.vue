<template>
  <section class="px-2 flex items-center">
    <span class="ml-2 text-xs text-muted-foreground">我的组</span>

    <Tooltip trigger-class="ml-auto" label="新建组" shortcut="Ctrl+N">
      <Button variant="outline" size="xs" @click="handleAdd">
        <PlusIcon class="size-4" />

        新建组
      </Button>
    </Tooltip>
  </section>
</template>

<script setup lang="ts">
import Tooltip from '@/components/common/tooltip.vue';
import { Button } from '@/components/ui/button';
import { eventBus } from '@/utils/event-bus';
import { PlusIcon } from '@lucide/vue';

const handleAdd = () => {
  eventBus.emit('dialog-group:add:show');
};
</script>

<style scoped lang="scss"></style>
