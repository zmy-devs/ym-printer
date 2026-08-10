<template>
  <section class="flex flex-col relative">
    <DocHeader class="p-1 z-10" />

    <div
      class="wh-full absolute left-50 top-50 -translate-x-50 -translate-y-50"
      v-if="!hasDocs"
    >
      <DocEmpty />
    </div>

    <ScrollArea class="min-h-0" view-class="pb-12" v-else>
      <DocContent />
    </ScrollArea>

    <DocFooter v-if="hasDocs" />
  </section>
</template>

<script setup lang="ts">
import { ScrollArea } from '@/components/ui/scroll-area';
import DocHeader from './doc-header/index.vue';
import DocContent from './doc-content/index.vue';
import DocEmpty from './doc-empty.vue';
import DocFooter from './doc-footer/index.vue';
import { useDocStore } from '@/stores/doc';
import { useWorkspaceStore } from '@/stores/workspace';
import { useSettingsStore } from '@/stores/settings';
import { setStatus } from './index';

const { settings } = storeToRefs(useSettingsStore());
const { docs } = storeToRefs(useDocStore());
const { selectedWorkspaceID } = storeToRefs(useWorkspaceStore());

const hasDocs = computed(() =>
  docs.value.some((item) => item.workspaceId == selectedWorkspaceID.value),
);

//防止进入计价后关闭计价模式
watch(
  () => settings.value.price,
  (value) => {
    if (!value) {
      setStatus();
    }
  },
);
</script>

<style scoped lang="scss"></style>
