<template>
  <footer class="w-full p-1 flex items-center" v-if="selectedGroupDocsCount">
    <Button class="text-xs" variant="ghost" size="sm">
      打印完成文档: {{ selectedGroupFinishDocsCount }} /
      {{ selectedGroupDocsCount }}
    </Button>
  </footer>
</template>

<script setup lang="ts">
import { useSelectionStore } from '@/stores/selection.store';
import { Button } from '@/components/ui/button';
import { usePrintConfigStore } from '@/stores/print-config.store';

// 当前分类内的有序文档
const { selectedDocs } = storeToRefs(useSelectionStore());

// 文档打印配置状态
const printConfigStore = usePrintConfigStore();

// 当前分类内的文档数量
const selectedGroupDocsCount = computed(() => {
  return selectedDocs.value.length;
});

// 当前分类内已打印完成的文档数量
const selectedGroupFinishDocsCount = computed(() => {
  return selectedDocs.value.filter((item) => {
    return printConfigStore.getPrintState(item.id)?.status === 'completed';
  }).length;
});
</script>

<style scoped lang="scss">
footer {
  background: linear-gradient(to top, var(--background) 50%, transparent);
}
</style>
