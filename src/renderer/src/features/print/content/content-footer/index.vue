<template>
  <fieldset
    class="preview-toolbar"
    :disabled="disabledControls.includes('preview')"
  >
    <div class="absolute bottom-2 left-2 z-10 pointer-events-auto">
      <Button
        class="backdrop-blur-2xl bg-background/30"
        variant="ghost"
        size="sm"
      >
        <span class="text-sm">共{{ selectedDoc?.pageCount ?? 0 }}页</span>
      </Button>
    </div>

    <div class="absolute right-2 bottom-2 z-10 pointer-events-auto">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            class="backdrop-blur-2xl bg-background/30"
            variant="ghost"
            size="sm"
          >
            <span class="text-sm">{{ scalePercent }}%</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          side="top"
          class="w-52"
          @open-auto-focus="handleFocusScaleInput"
        >
          <InputGroup class="ring-0!">
            <InputGroupInput
              class="[&::-webkit-inner-spin-button]:appearance-none"
              type="number"
              min="5"
              max="200"
              step="5"
              v-model="scalePercent"
            />

            <InputGroupAddon align="inline-end"> % </InputGroupAddon>
          </InputGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            class="hover:bg-accent"
            @select.prevent="handleIncreaseScale"
          >
            放大

            <DropdownMenuShortcut>Ctrl + 上滚轮</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            class="hover:bg-accent"
            @select.prevent="handleDecreaseScale"
          >
            缩小

            <DropdownMenuShortcut>Ctrl + 下滚轮</DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            class="hover:bg-accent"
            v-for="option in zoomOptions"
            :key="option"
            @select.prevent="handleSetScale(option)"
          >
            缩放至{{ option }}%
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </fieldset>
</template>

<script setup lang="ts">
import { usePdfStore } from '@/stores/pdf.store';
import { Button } from '@/components/ui/button';
import { useSelectionStore } from '@/stores/selection.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import InputGroup from '@/components/ui/input-group/InputGroup.vue';
import { InputGroupInput } from '@/components/ui/input-group';
import InputGroupAddon from '@/components/ui/input-group/InputGroupAddon.vue';
import { useSheetPrintContext } from '../../context';

// 当前预览文档
const { selectedDoc } = storeToRefs(useSelectionStore());
// 当前缩放倍率
const { scale } = storeToRefs(usePdfStore());
// 缩放控制方法
const { addScale, subScale } = usePdfStore();
// 当前需要禁用的打印控件
const { disabledControls } = useSheetPrintContext();

// 快捷缩放百分比
const zoomOptions = [50, 100, 200];

// 供界面展示和输入的缩放百分比
const scalePercent = computed({
  get: () => {
    return Math.round(scale.value * 100);
  },
  set: (value: number) => {
    scale.value = Math.min(Math.max(value / 100, 0.05), 2);
  },
});

// 放大预览
const handleIncreaseScale = () => {
  addScale();
};

// 菜单打开时聚焦缩放输入框
const handleFocusScaleInput = (event: Event) => {
  event.preventDefault();
  const menuContent = event.currentTarget as HTMLElement | null;
  menuContent?.querySelector('input')?.focus();
};

// 缩小预览
const handleDecreaseScale = () => {
  subScale();
};

// 设置快捷缩放倍率
const handleSetScale = (value: number) => {
  scalePercent.value = value;
};
</script>

<style scoped lang="scss">
.preview-toolbar {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}
</style>
