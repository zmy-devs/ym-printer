<template>
  <SelectPrinter
    value-class="font-medium"
    v-model="selectedGroup.printer"
    v-if="selectedGroup"
  />

  <AddDocButton class="ml-auto" size="sm" v-if="hasCurrentGroupDocs" />
</template>

<script setup lang="ts">
import SelectPrinter from '@/components/select-printer.vue';
import { useSelectionStore } from '@/stores/selection.store';
import AddDocButton from '@/components/add-doc-button.vue';

// 当前分组的文档列表和分组信息
const { selectedDocs, selectedGroup } = storeToRefs(useSelectionStore());

// 当前分组是否已有文档
const hasCurrentGroupDocs = computed(() => {
  return selectedDocs.value.length > 0;
});
</script>

<style scoped lang="scss"></style>
