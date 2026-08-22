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
import { usePrintConfigStore } from '@/stores/print-config.store';

// 判断当前文档打印状态是否禁用操作
const { isPrintDisabled } = usePrintConfigStore();

// 处于不可编辑打印状态时禁用配置表单
const isPrintConfigDisabled = computed(() => {
  return isPrintDisabled();
});
</script>

<style scoped lang="scss"></style>
