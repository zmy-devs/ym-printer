<template>
  <footer
    class="w-full p-1 absolute bottom-0 left-0 flex items-center gap-4"
    v-if="docs.length"
  >
    <Button variant="ghost" size="sm">
      <span class="text-xs">
        打印完成文档: {{ selectedWorkspaceFinishDocsCount }} /
        {{ selectedWorkspaceDocsCount }}
      </span>
    </Button>

    <div class="ml-auto" v-if="settings.price">
      <Button
        size="sm"
        variant="destructive"
        @click="handleCancel"
        v-if="status != 'default'"
      >
        <XIcon />

        <span class="text-xs"> 取消</span>
      </Button>

      <ButtonGroup v-else>
        <Button class="border-r" size="sm" @click="setStatus('check')">
          <SquareCheckIcon />

          <span class="text-xs"> 多选</span>
        </Button>

        <Button size="sm" @click="setStatus('price')">
          <DollarSignIcon />

          <span class="text-xs"> 计价</span>
        </Button>
      </ButtonGroup>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { DollarSignIcon, XIcon, SquareCheckIcon } from '@lucide/vue';
import { setStatus, status } from '../index';
import { cancelCheckAll } from '../check';
import { useDocStore } from '@/stores/doc';
import { Button } from '@/components/ui/button';
import { useWorkspaceStore } from '@/stores/workspace';
import { totalCount } from '@/utils/total';
import { useSettingsStore } from '@/stores/settings';
import { ButtonGroup } from '@/components/ui/button-group';

const { settings } = storeToRefs(useSettingsStore());
const { selectedWorkspaceID } = storeToRefs(useWorkspaceStore());
const { docs } = storeToRefs(useDocStore());

const selectedWorkspaceDocsCount = computed(() => {
  return totalCount(
    docs.value,
    (item) => item.workspaceId == selectedWorkspaceID.value,
  );
});

const selectedWorkspaceFinishDocsCount = computed(() => {
  return totalCount(
    docs.value,
    (item) =>
      item.workspaceId == selectedWorkspaceID.value && item.status == 'printed',
  );
});

//处理取消计价
const handleCancel = () => {
  setStatus();
  cancelCheckAll();
};
</script>

<style scoped lang="scss">
footer {
  background: linear-gradient(to top, var(--background) 10%, transparent);
}
</style>
