import { nanoid } from 'nanoid';
import type { Group } from '@type';
import { useDocStore } from '@/stores/doc.store';
import { useGroupStore } from '@/stores/group.store';
import { useSelectionStore } from '@/stores/selection.store';
import { useWorkspaceStore } from '@/stores/workspace.store';

// 提供分组的跨实体业务操作
export const useGroupService = () => {
  const workspaceStore = useWorkspaceStore();
  const groupStore = useGroupStore();
  const docStore = useDocStore();
  const selectionStore = useSelectionStore();

  // 选择当前工作空间内的分组
  const selectGroup = (groupId: string) => {
    selectionStore.selectGroup(groupId);
  };

  // 在当前工作空间创建并选中分组
  const createGroup = (name: string) => {
    if (!selectionStore.workspaceId) {
      return;
    }

    // 新分组实体
    const group: Group = {
      id: nanoid(),
      name,
      workspaceId: selectionStore.workspaceId,
    };

    groupStore.addGroup(group);
    workspaceStore.appendWorkspaceGroupId(group.workspaceId, group.id);

    selectionStore.selectGroup(group.id);
  };

  // 级联删除非唯一分组及其文档
  const removeGroup = (groupId: string) => {
    // 待删除的分组
    const group = groupStore.getGroup(groupId);

    if (!group) {
      return;
    }

    // 待删除分组下的文档标识
    const docIds = groupStore.getGroupDocIds(groupId);

    docStore.removeDocs(docIds);
    groupStore.removeGroup(groupId);
    workspaceStore.removeWorkspaceGroupId(group.workspaceId, groupId);

    if (selectionStore.groupId !== groupId) {
      return;
    }

    // 删除后仍有效的首个分组
    const fallbackGroupId = workspaceStore.getWorkspaceGroupIds(
      group.workspaceId,
    )[0];

    if (fallbackGroupId) {
      selectionStore.selectGroup(fallbackGroupId);
      return;
    }
  };

  // 重命名分组
  const renameGroup = (groupId: string, name: string) => {
    // 待重命名的分组
    const group = groupStore.getGroup(groupId);

    if (!group) {
      return;
    }

    group.name = name;
  };

  return {
    selectGroup,
    createGroup,
    removeGroup,
    renameGroup,
  };
};
