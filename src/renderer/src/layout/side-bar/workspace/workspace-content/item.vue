<template>
  <section
    class="h-13 px-3 flex flex-col justify-center gap-1 rounded-[6px] hover:bg-accent dark:hover:bg-accent/50 transition-colors"
    :class="{
      'bg-accent dark:bg-accent/50': isSelected,
    }"
    :title="data.name"
    @click="handleClick"
  >
    <span class="text-sm truncate">{{ data.name }}</span>

    <div class="flex items-center gap-1.5">
      <FolderOpenIcon class="size-4 text-muted-foreground" v-if="isSelected" />

      <FolderClosedIcon class="size-4 text-muted-foreground" v-else />

      <span class="text-xs text-muted-foreground truncate"> · </span>

      <span class="text-xs text-muted-foreground truncate">
        {{ docCount }} 个文档
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Workspace } from '@/stores/workspace';
import { FolderClosedIcon, FolderOpenIcon } from '@lucide/vue';
import { useWorkspaceStore } from '@/stores/workspace';
import { useDocStore } from '@/stores/doc';
import { totalCount } from '@/utils/total';

const { selectedWorkspaceID } = storeToRefs(useWorkspaceStore());
const { selectWorkspace } = useWorkspaceStore();
const { docs } = storeToRefs(useDocStore());

const router = useRouter();
const route = useRoute();

const props = defineProps<{
  data: Workspace;
}>();

const docCount = computed(() => {
  return totalCount(docs.value, (item) => item.workspaceId === props.data.id);
});

//是否选中
const isSelected = computed(() => {
  return (
    route.path.includes('doc') && selectedWorkspaceID.value == props.data.id
  );
});

//处理点击
const handleClick = () => {
  selectWorkspace(props.data.id);
  router.push('/doc');
};
</script>

<style scoped lang="scss"></style>
