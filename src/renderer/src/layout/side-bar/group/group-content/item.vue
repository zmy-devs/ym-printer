<template>
  <section
    class="h-13 flex flex-col justify-center gap-1 rounded-md px-3 transition-colors hover:bg-accent dark:hover:bg-accent/50"
    :class="{
      'bg-accent! dark:bg-accent/50!': isSelected,
    }"
    :title="group?.name"
    @click="$emit('click', id)"
  >
    <header class="flex items-center gap-2">
      <span class="truncate text-sm">
        {{ group?.name }}
      </span>
    </header>

    <div
      class="flex items-center gap-1.5 text-xs text-muted-foreground [&>svg]:size-4 [&>span]:truncate"
    >
      <FolderOpenIcon v-if="isSelected" />

      <FolderClosedIcon v-else />

      <span> · </span>

      <span> {{ docCount }} 个文档 </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FolderOpenIcon, FolderClosedIcon } from '@lucide/vue';
import { useGroupStore } from '@/stores/group.store';
import { useDocumentService } from '@/services/document.service';

// 分组选择方法
const { getGroup } = useGroupStore();

// 分组文档查询方法
const { getGroupDocs } = useDocumentService();

// 分组列表项参数
const props = defineProps<{
  id: string;
  isSelected?: boolean;
}>();

defineEmits<{
  click: [id: string];
}>();

// 当前列表项对应的分组实体
const group = computed(() => {
  return getGroup(props.id);
});

// 当前列表项内的文档数量
const docCount = computed(() => {
  return getGroupDocs(props.id).length;
});
</script>

<style scoped lang="scss"></style>
