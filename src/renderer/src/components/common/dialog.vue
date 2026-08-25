<template>
  <Dialog v-model:open="model">
    <DialogContent
      :aria-describedby="undefined"
      :class="
        cn(
          $attrs.class,
          'w-[calc(100vw-4rem)] h-180 max-h-[calc(100dvh-4rem)] flex flex-col gap-0 overflow-hidden p-0! sm:max-w-250',
        )
      "
      @open-auto-focus.prevent
    >
      <VisuallyHidden as-child>
        <DialogTitle />
      </VisuallyHidden>

      <slot></slot>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { VisuallyHidden } from 'reka-ui';

const model = defineModel<boolean>();
</script>

<style scoped lang="scss"></style>
