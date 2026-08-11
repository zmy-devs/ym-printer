<template>
  <Field
    name="range"
    label="打印范围"
    :icon="FileTextIcon"
    v-slot="{ componentField }"
  >
    <DropdownMenu v-model:open="isPresetMenuOpen">
      <InputGroup>
        <DropdownMenuTrigger as-child>
          <div class="w-full">
            <InputGroupInput
              placeholder="格式 1,1-,-10,-"
              v-bind="componentField"
              @blur="handlePresetMenuClose"
              @focus="handlePresetMenuOpen"
            />
          </div>
        </DropdownMenuTrigger>

        <InputGroupAddon align="inline-end">
          <Tooltip label="新增预设">
            <InputGroupButton
              variant="ghost"
              size="icon-xs"
              @click="handleAddPreset(componentField.modelValue)"
            >
              <ClipboardPlusIcon class="text-foreground" />
            </InputGroupButton>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>

      <DropdownMenuContent
        class="min-w-56"
        align="start"
        side="bottom"
        @open-auto-focus.prevent
      >
        <DropdownMenuLabel v-if="presets.length == 0">
          暂无预设
        </DropdownMenuLabel>

        <DropdownMenuItem
          class="group hover:bg-accent"
          v-for="item of presets"
          :key="item.id"
          @click="
            componentField['onUpdate:modelValue']!(item.value);
            handlePresetMenuClose();
          "
        >
          <span>
            {{ item.name }}
          </span>

          <span class="text-xs text-muted-foreground">
            {{ item.value }}
          </span>

          <div class="ml-auto flex gap-1 opacity-0 group-hover:opacity-100">
            <Tooltip label="编辑">
              <Button
                variant="ghost"
                size="icon-xs"
                @click.stop="handleEditPreset(item)"
              >
                <PencilLine class="size-3.5" />
              </Button>
            </Tooltip>

            <Tooltip label="删除">
              <Button
                variant="ghost"
                size="icon-xs"
                @click.stop="removePreset(item.id)"
              >
                <Trash2 class="size-3.5" />
              </Button>
            </Tooltip>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Field>
</template>

<script setup lang="ts">
import Field from '@/components/field.vue';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  ClipboardPlusIcon,
  FileTextIcon,
  PencilLine,
  Trash2,
} from '@lucide/vue';
import { Preset, usePresetStore } from '@/stores/preset';
import Tooltip from '@/components/tooltip.vue';
import { eventBus } from '@/utils/event-bus';
import { Button } from '@/components/ui/button';

const { presets } = storeToRefs(usePresetStore());
const { removePreset } = usePresetStore();

// 预设下拉菜单的显示状态
const isPresetMenuOpen = ref(false);

//打开打印范围预设
const handleAddPreset = (data: string) => {
  eventBus.emit('dialog-preset:add:show', data);
};

//打开打印范围预设
const handleEditPreset = (data: Preset) => {
  eventBus.emit('dialog-preset:edit:show', data);
};

// 输入框聚焦时展示预设菜单
const handlePresetMenuOpen = () => {
  isPresetMenuOpen.value = true;
};

// 输入框失焦或选择预设后关闭菜单
const handlePresetMenuClose = () => {
  isPresetMenuOpen.value = false;
};
</script>

<style scoped lang="scss"></style>
