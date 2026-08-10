<template>
  <Item class="dark:hover:bg-accent/30" size="sm">
    <ItemContent>
      <ItemTitle>{{ data.name }}</ItemTitle>

      <ItemDescription>{{ data.value }}</ItemDescription>
    </ItemContent>

    <ItemActions>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline" size="icon-sm">
            <MoreHorizontalIcon class="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent class="min-w-52">
          <DropdownMenuItem @click="handleEdit">
            <PencilLineIcon />

            <span>编辑</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem variant="destructive" @click="handleRemove">
            <Trash2Icon />

            <span>删除当前预设</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ItemActions>
  </Item>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';
import { eventBus } from '@/utils/event-bus';
import { type Preset, usePresetStore } from '@/stores/preset';
import { MoreHorizontalIcon, PencilLineIcon, Trash2Icon } from '@lucide/vue';

// 预设项展示数据
const props = defineProps<{
  data: Preset;
}>();

// 删除预设的方法
const { removePreset } = usePresetStore();

// 打开预设编辑弹窗
const handleEdit = () => {
  eventBus.emit('dialog-preset-form:show', {
    type: 'edit',
    data: props.data,
  });
};

// 删除当前预设并显示提示
const handleRemove = () => {
  removePreset(props.data.id);
  eventBus.emit('success:show', `已删除“${props.data.name}”`);
};
</script>

<style scoped lang="scss"></style>
