<template>
  <Dialog v-model:open="model">
    <DialogContent
      :aria-describedby="undefined"
      :class="
        cn(
          $attrs.class,
          'sm:max-w-200 h-150 p-0! flex flex-col gap-0 bg-sidebar overflow-hidden',
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
