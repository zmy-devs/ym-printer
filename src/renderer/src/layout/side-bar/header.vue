<template>
  <section class="h-10 p-1.5 flex shrink-0">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button class="max-w-full px-2!" variant="ghost" size="sm">
          <BriefcaseIcon />

          <span class="truncate font-medium">{{ workspaceTitle }}</span>

          <ChevronsUpDownIcon class="size-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" class="w-60">
        <DropdownMenuItem>
          <UsersRoundIcon />

          <span>开启团队协作</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </section>
</template>

<script setup lang="ts">
import { BriefcaseIcon, ChevronsUpDownIcon, UsersRoundIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSettingsStore } from '@/stores/settings.store';

// 应用设置数据
const { settings } = storeToRefs(useSettingsStore());
// 当前工作空间标题
const workspaceTitle = computed(() => {
  return `${settings.value.clientName}的工作空间`;
});
</script>

<style scoped lang="scss"></style>
