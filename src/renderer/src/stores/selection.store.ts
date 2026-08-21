import { useStorage } from '@vueuse/core';
import { storagePre } from '@shared/app-info';
import { useDocStore } from './doc.store';
import { useGroupStore } from './group.store';
import { useWorkspaceStore } from './workspace.store';

export const useSelectionStore = defineStore('selection', () => {
  // 工作空间实体状态
  const workspaceStore = useWorkspaceStore();

  // 分组实体状态
  const groupStore = useGroupStore();

  // 文档实体状态
  const docStore = useDocStore();

  // 当前浏览的工作空间标识
  const workspaceId = useStorage<string | null>(
    `${storagePre}:selected-workspace-id`,
    null,
  );

  // 当前浏览的分组标识
  const groupId = ref<string | null>(null);

  // 当前浏览的文档标识
  const docId = ref<string | null>(null);

  // 当前选中的工作空间
  const selectedWorkspace = computed(() => {
    if (!workspaceId.value) {
      return;
    }

    return workspaceStore.getWorkspace(workspaceId.value);
  });

  // 当前工作空间下的有序分组标识
  const selectedGroupIds = computed({
    get: () => {
      if (!workspaceId.value) {
        return [];
      }

      return workspaceStore.getWorkspaceGroupIds(workspaceId.value);
    },
    set: (groupIds) => {
      if (!workspaceId.value) {
        return;
      }

      workspaceStore.setWorkspaceGroupIds(workspaceId.value, groupIds);
    },
  });

  // 当前工作空间下的有序分组
  const selectedGroups = computed(() => {
    return groupStore.getGroups(selectedGroupIds.value);
  });

  // 当前选中的分组
  const selectedGroup = computed(() => {
    if (!groupId.value) {
      return;
    }

    return groupStore.getGroup(groupId.value);
  });

  // 当前分组下的有序文档标识
  const selectedDocIds = computed({
    get: () => {
      if (!groupId.value) {
        return [];
      }

      return groupStore.getGroupDocIds(groupId.value);
    },
    set: (docIds) => {
      if (!groupId.value) {
        return;
      }

      groupStore.setGroupDocIds(groupId.value, docIds);
    },
  });

  // 当前分组下的有序文档
  const selectedDocs = computed(() => {
    return docStore.getDocs(selectedDocIds.value);
  });

  // 当前选中的文档
  const selectedDoc = computed(() => {
    if (!docId.value) {
      return;
    }

    return docStore.getDoc(docId.value);
  });

  // 选择工作空间并清理下级选择
  const selectWorkspace = (nextWorkspaceId: string) => {
    if (workspaceId.value === nextWorkspaceId) {
      return;
    }

    workspaceId.value = nextWorkspaceId;
    groupId.value = null;
    docId.value = null;
  };

  // 选择分组并清理文档选择
  const selectGroup = (nextGroupId: string) => {
    if (groupId.value === nextGroupId) {
      return;
    }

    groupId.value = nextGroupId;
    docId.value = null;
  };

  // 选择文档
  const selectDoc = (nextDocId: string) => {
    if (docId.value == nextDocId) {
      return;
    }

    docId.value = nextDocId;
  };

  return {
    workspaceId,
    groupId,
    docId,
    selectedWorkspace,
    selectedGroupIds,
    selectedGroups,
    selectedGroup,
    selectedDocIds,
    selectedDocs,
    selectedDoc,
    selectWorkspace,
    selectGroup,
    selectDoc,
  };
});
