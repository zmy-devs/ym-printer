<template>
  <section class="flex items-center">
    <Button variant="ghost" @click="handleCheckAll">
      <SquareCheckIcon />

      <span>全选文档</span>
    </Button>

    <Button variant="ghost" @click="handleCheckFinishAll">
      <SquareCheckIcon />

      <span>全选打印完成文档</span>
    </Button>

    <Button variant="ghost" @click="handleCancelCheckAll">
      <SquareIcon />

      <span>取消全选</span>
    </Button>

    <span class="ml-auto mr-2 text-sm text-green-700 dark:text-green-500">
      总价: {{ price }} 元
    </span>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { SquareCheckIcon, SquareIcon } from '@lucide/vue';
import { cancelCheck, checkAll, checked } from '../check';
import { useDocStore } from '@/stores/doc';
import { getPrice } from '@/utils/price';
import { useWorkspaceStore } from '@/stores/workspace';

const { selectedWorkspaceID } = storeToRefs(useWorkspaceStore());
const { docs } = storeToRefs(useDocStore());
const { getDoc } = useDocStore();

//总价
const price = computed(() => {
  let res = 0;

  for (const id of checked.value) {
    const doc = getDoc(id);

    if (!doc) {
      continue;
    }

    res += getPrice(doc) * 100;
  }

  return (res / 100).toFixed(2);
});

//全选
const handleCheckAll = () => {
  handleCancelCheckAll();

  const ids = docs.value
    .filter(
      (item) =>
        item.workspaceId == selectedWorkspaceID.value &&
        (item.status == 'printed' ||
          item.status == 'prepare' ||
          item.status == 'printing'),
    )
    .map((item) => item.id);

  checkAll(ids);
};

//全选
const handleCheckFinishAll = () => {
  handleCancelCheckAll();

  const ids = docs.value
    .filter(
      (item) =>
        item.workspaceId == selectedWorkspaceID.value &&
        item.status == 'printed',
    )
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
