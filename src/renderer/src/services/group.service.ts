import { nanoid } from 'nanoid';
import type { Group } from '@type';
import { useGroupStore } from '@/stores/group.store';
import { useSelectionStore } from '@/stores/selection.store';

// 提供分组的跨实体业务操作
export const useGroupService = () => {
  const groupStore = useGroupStore();
  const selectionStore = useSelectionStore();

  // 初始化当前分组选择
  const initSelection = () => {
    // 已选中且仍存在的分组
    const selectedGroup = selectionStore.groupId
      ? groupStore.getGroup(selectionStore.groupId)
      : undefined;

    if (selectedGroup) {
      return;
    }

    const firstGroupId = groupStore.groupIds[0];

    if (firstGroupId) {
      selectionStore.selectGroup(firstGroupId);
    }
  };

  // 选择分组
  const selectGroup = (groupId: string) => {
    selectionStore.selectGroup(groupId);
  };

  // 创建并选中分组
  const createGroup = (data: Pick<Group, 'name' | 'printer'>) => {
    // 新分组实体
    const group: Group = {
      id: nanoid(),
      name: data.name,
      printer: data.printer,
    };

    groupStore.addGroup(group);

    selectionStore.selectGroup(group.id);
  };

  // 级联删除非唯一分组及其文档
  const removeGroup = (groupId: string) => {
    // 待删除的分组
    const group = groupStore.getGroup(groupId);

    if (!group) {
      return;
    }

    groupStore.removeGroup(groupId);

    if (selectionStore.groupId !== groupId) {
      return;
    }

    // 删除后仍有效的首个分组
    const fallbackGroupId = groupStore.groupIds[0];

    if (fallbackGroupId) {
      selectionStore.selectGroup(fallbackGroupId);
      return;
    }
  };

  // 更新分组基础信息
  const editGroup = (group: Group) => {
    groupStore.updateGroup(group.id, group);
  };

  return {
    initSelection,
    selectGroup,
    createGroup,
    removeGroup,
    editGroup,
  };
};
