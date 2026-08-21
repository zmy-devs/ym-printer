<template>
  <fieldset
    class="min-h-0 flex flex-1 flex-col"
    :disabled="isPrintConfigDisabled"
  >
    <PrintConfig />

    <Footer class="mt-auto border-t" />
  </fieldset>
</template>

<script setup lang="ts">
import PrintConfig from './print-config/index.vue';
import Footer from './footer.vue';
import { useSelectionStore } from '@/stores/selection.store';
import { usePrintConfigStore } from '@/stores/print-config.store';

// 当前选中文档
const { docId } = storeToRefs(useSelectionStore());

// 文档打印配置状态
const printConfigStore = usePrintConfigStore();

const disabledStatus = ['queued', 'uploading', 'waiting'];

// 处于不可编辑打印状态时禁用配置表单
const isPrintConfigDisabled = computed(() => {
  // 当前文档打印运行状态
  const status = printConfigStore.getPrintState(docId.value)?.status;

  return disabledStatus.includes(status);
});
</script>

<style scoped lang="scss"></style>
