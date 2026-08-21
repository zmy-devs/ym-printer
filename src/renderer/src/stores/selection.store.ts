import { useStorage } from '@vueuse/core';
import { storagePre } from '@shared/app-info';
import { useDocStore } from './doc.store';
import { useGroupStore } from './group.store';

export const useSelectionStore = defineStore('selection', () => {
  // 分组实体状态
  const groupStore = useGroupStore();

  // 文档实体状态
  const docStore = useDocStore();

  // 当前浏览的分组标识
  const groupId = useStorage(`${storagePre}:selected-group-id`, '');

  // 当前浏览的文档标识
  const docId = ref('');

  // 当前有序分组标识
  const selectedGroupIds = computed({
    get: () => {
      return groupStore.groupIds;
    },
    set: (groupIds) => {
      groupStore.groupIds = groupIds;
    },
  });

  // 当前有序分组
  const selectedGroups = computed(() => {
    return groupStore.getGroups();
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

  // 选择分组并清理文档选择
  const selectGroup = (nextGroupId: string) => {
    if (groupId.value === nextGroupId) {
      return;
    }

    groupId.value = nextGroupId;
    docId.value = '';
  };

  // 选择文档
  const selectDoc = (nextDocId: string) => {
    if (docId.value == nextDocId) {
      return;
    }

    docId.value = nextDocId;
  };

  return {
    groupId,
    docId,
    selectedGroupIds,
    selectedGroups,
    selectedGroup,
    selectedDocIds,
    selectedDocs,
    selectedDoc,
    selectGroup,
    selectDoc,
  };
});
