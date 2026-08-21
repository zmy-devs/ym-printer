<template>
  <Button variant="ghost" @click="handleCheckAll">
    <SquareCheckIcon />

    <span>全选文档</span>
  </Button>

  <Button variant="ghost" @click="cancelCheckAll">
    <SquareIcon />

    <span>取消全选</span>
  </Button>

  <span class="ml-auto mr-2 text-sm font-medium" v-if="settings.price">
    总价: {{ price }} 元
  </span>
</template>

<script setup lang="ts">
import { useSelectionStore } from '@/stores/selection.store';
import { Button } from '@/components/ui/button';
import { SquareCheckIcon, SquareIcon } from '@lucide/vue';
import { cancelCheckAll, checkAll, checked } from '../check';
import { useDocStore } from '@/stores/doc.store';
import { useSettingsStore } from '@/stores/settings.store';
import { getPrice } from '@/utils/price';
import { usePrintConfigStore } from '@/stores/print-config.store';

// 文档状态仓库
const docStore = useDocStore();
// 当前分类内的有序文档
const { selectedDocs } = storeToRefs(useSelectionStore());
// 文档查询方法
const { getDoc } = docStore;
// 文档打印配置状态
const printConfigStore = usePrintConfigStore();
// 应用计价设置
const { settings } = storeToRefs(useSettingsStore());

// 求和一组金额
const sum = (values: number[]) => {
  return values.reduce((total, value) => {
    return total + value;
  }, 0);
};

// 当前勾选文档的总价
const price = computed(() => {
  // 当前勾选文档的价格列表
  const prices = Array.from(checked.value).map((id) => {
    // 当前计价文档
    const doc = getDoc(id);

    if (!doc) {
      return 0;
    }

    return getPrice(printConfigStore.getPrintConfig(doc.id));
  });
  // 当前勾选文档的总价
  const totalPrice = sum(prices);

  return totalPrice.toFixed(2);
});

// 全选当前分类内的文档
const handleCheckAll = () => {
  // 当前分类内的文档标识
  const ids = selectedDocs.value.map((item) => item.id);

  checkAll(ids);
};
</script>

<style scoped lang="scss"></style>
