<template>
  <section class="flex items-center">
    <Button variant="ghost" @click="handleCheckAll">
      <SquareCheckIcon />

      <span>全选文档</span>
    </Button>

    <Button variant="ghost" @click="handleCancelCheckAll">
      <SquareIcon />

      <span>取消全选</span>
    </Button>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { SquareCheckIcon, SquareIcon } from '@lucide/vue';
import { cancelCheck, checkAll } from '../check';
import { useDocStore } from '@/stores/doc';
import { useWorkspaceStore } from '@/stores/workspace';

const { selectedWorkspaceID } = storeToRefs(useWorkspaceStore());
const { docs } = storeToRefs(useDocStore());

//全选
const handleCheckAll = () => {
  handleCancelCheckAll();

  const ids = docs.value
    .filter((item) => item.workspaceId == selectedWorkspaceID.value)
    .map((item) => item.id);

  checkAll(ids);
};

//取消全选
const handleCancelCheckAll = () => {
  const ids = docs.value
    .filter((item) => item.workspaceId == selectedWorkspaceID.value)
    .map((item) => item.id);

  cancelCheck(ids);
};
</script>

<style scoped lang="scss"></style>
