import { useStorage } from '@vueuse/core';
import { storagePre } from '@shared/app-info';
import type { Group } from '@type';

// 分组标识到实体的扁平映射
type GroupMap = Record<string, Group>;

export const useGroupStore = defineStore('group', () => {
  // 全部分组实体
  const groups = useStorage<GroupMap>(`${storagePre}:workspace-groups`, {});

  // 当前会话内分组下文档的展示与拖拽顺序
  const docOrderByGroup = useStorage<Record<string, string[]>>(
    `${storagePre}:doc-order-by-worksgrouppace`,
    {},
  );

  // 根据标识获取分组
  const getGroup = (groupId: string) => {
    return groups.value[groupId];
  };

  // 根据有序标识获取分组列表
  const getGroups = (groupIds: string[]) => {
    return groupIds.map(getGroup);
  };

  // 新增分组实体
  const addGroup = (group: Group) => {
    groups.value[group.id] = group;
    docOrderByGroup.value[group.id] = [];
  };

  // 删除分组实体
  const removeGroup = (groupIds: string | string[]) => {
    groupIds = Array.isArray(groupIds) ? groupIds : [groupIds];

    groupIds.forEach((groupId) => {
      delete groups.value[groupId];
      delete docOrderByGroup.value[groupId];
    });
  };

  // 获取分组下的文档排序
  const getGroupDocIds = (groupId: string) => {
    return docOrderByGroup.value[groupId];
  };

  // 设置分组下的文档排序
  const setGroupDocIds = (groupId: string, docIds: string[]) => {
    docOrderByGroup.value[groupId] = docIds;
  };

  // 向分组追加文档排序
  const appendGroupDocIds = (groupId: string, docIds: string[]) => {
    getGroupDocIds(groupId).push(...docIds);
  };

  // 从分组移除文档排序
  const removeGroupDocIds = (groupId: string, docIds: string | string[]) => {
    docIds = Array.isArray(docIds) ? docIds : [docIds];

    // 移除目标文档后的分组文档排序
    const ids = getGroupDocIds(groupId).filter((id) => {
      return !docIds.includes(id);
    });

    setGroupDocIds(groupId, ids);
  };

  return {
    groups,
    docOrderByGroup,
    getGroup,
    getGroups,
    getGroupDocIds,
    setGroupDocIds,
    addGroup,
    removeGroup,
    appendGroupDocIds,
    removeGroupDocIds,
  };
});
