<template>
  <HoverCard :openDelay="500">
    <HoverCardTrigger :class="class">
      <Button variant="ghost" size="xs" v-if="status == 'downloading'">
        <span class="text-xs">正在下载...</span>
      </Button>

      <Button
        class="h-6.5 px-2.5"
        size="xs"
        v-if="status == 'downloaded'"
        @click="installUpdate"
      >
        <span class="text-xs">更新</span>
      </Button>
    </HoverCardTrigger>

    <HoverCardContent class="py-2 flex flex-col gap-2">
      <div class="flex items-center gap-4">
        <img src="@/assets/icon.png" class="size-12" />

        <div class="flex flex-col">
          <span class="text-sm">{{ productName }}</span>

          <span class="text-sm text-muted-foreground">
            当前版本: {{ appVersion }}
          </span>

          <span class="text-sm text-muted-foreground">
            最新版本: {{ latestVersion }}
          </span>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
</template>

<script setup lang="ts">
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { productName, appVersion } from '@shared/app-info';
import { useUpdateStore } from '@/stores/useUpdateStore';

const { latestVersion, status } = storeToRefs(useUpdateStore());
const { installUpdate } = useUpdateStore();

defineProps<{
  class?: string;
}>();
</script>

<style scoped lang="scss"></style>
