import { useStorage } from '@vueuse/core';
import { storagePre } from '@shared/app-info';
import type { Group } from '@type';
import { toArray } from '@/utils/normalize';

// 分组标识到实体的扁平映射
type GroupMap = Record<string, Group>;

export const useGroupStore = defineStore('group', () => {
  // 全部分组实体
  const groups = useStorage<GroupMap>(`${storagePre}:groups`, {});

  // 分组展示与拖拽顺序
  const groupIds = useStorage<string[]>(`${storagePre}:group-ids`, []);

  // 分组下文档的展示与拖拽顺序
  const docOrderByGroup = ref<Record<string, string[]>>({});

  // 根据标识获取分组
  const getGroup = (groupId: string) => {
    return groups.value[groupId];
  };

  // 根据有序标识获取分组列表
  const getGroups = () => {
    return groupIds.value.flatMap((groupId) => {
      // 有效的分组实体
      const group = getGroup(groupId);

      return group ? [group] : [];
    });
  };

  // 新增分组实体
  const addGroup = (group: Group) => {
    groups.value[group.id] = group;
    groupIds.value.push(group.id);
  };

  // 更新分组基础信息
  const updateGroup = (groupId: string, data: Partial<Omit<Group, 'id'>>) => {
    Object.assign(getGroup(groupId)!, data);
  };

  // 删除分组实体
  const removeGroup = (ids: string | string[]) => {
    // 待删除的分组标识集合
    const targetGroupIds = toArray(ids);

    targetGroupIds.forEach((groupId) => {
      delete groups.value[groupId];
      delete docOrderByGroup.value[groupId];
    });

    groupIds.value = groupIds.value.filter((groupId) => {
      return !targetGroupIds.includes(groupId);
    });
  };

  // 获取分组下的文档排序
  const getGroupDocIds = (groupId: string) => {
    docOrderByGroup.value[groupId] ??= [];

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
    // 待移除的文档标识集合
    const targetDocIds = toArray(docIds);

    // 移除目标文档后的分组文档排序
    const ids = getGroupDocIds(groupId).filter((id) => {
      return !targetDocIds.includes(id);
    });

    setGroupDocIds(groupId, ids);
  };

  return {
    groups,
    groupIds,
    docOrderByGroup,
    getGroup,
    getGroups,
    getGroupDocIds,
    setGroupDocIds,
    addGroup,
    updateGroup,
    removeGroup,
    appendGroupDocIds,
    removeGroupDocIds,
  };
});
