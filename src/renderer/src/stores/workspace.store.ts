import { useStorage } from '@vueuse/core';
import { storagePre } from '@shared/app-info';
import type { Workspace } from '@type';

// 工作空间标识到实体的扁平映射
type WorkspaceMap = Record<string, Workspace>;

export const useWorkspaceStore = defineStore('workspace', () => {
  // 全部工作空间实体
  const workspaces = useStorage<WorkspaceMap>(`${storagePre}:workspaces`, {});

  // 工作空间展示与拖拽顺序
  const workspaceIds = useStorage<string[]>(`${storagePre}:workspace-ids`, []);

  // 工作空间下分组的展示与拖拽顺序
  const groupOrderByWorkspace = useStorage<Record<string, string[]>>(
    `${storagePre}:group-order-by-workspace`,
    {},
  );

  // 根据标识获取工作空间
  const getWorkspace = (workspaceId: string) => {
    return workspaces.value[workspaceId];
  };

  // 按当前顺序获取全部工作空间
  const getWorkspaces = () => {
    return workspaceIds.value.map(getWorkspace);
  };

  // 新增工作空间实体
  const addWorkspace = (workspace: Workspace) => {
    workspaces.value[workspace.id] = workspace;
    workspaceIds.value.push(workspace.id);
    groupOrderByWorkspace.value[workspace.id] = [];
  };

  // 更新工作空间基础信息
  const updateWorkspace = (
    workspaceId: string,
    data: Partial<Omit<Workspace, 'id'>>,
  ) => {
    Object.assign(getWorkspace(workspaceId)!, data);
  };

  // 删除工作空间实体及其排序标识
  const removeWorkspace = (workspaceId: string) => {
    delete workspaces.value[workspaceId];
    delete groupOrderByWorkspace.value[workspaceId];

    workspaceIds.value = workspaceIds.value.filter((id) => id !== workspaceId);
  };

  // 获取工作空间下的分组排序
  const getWorkspaceGroupIds = (workspaceId: string) => {
    return groupOrderByWorkspace.value[workspaceId];
  };

  // 设置工作空间下的分组排序
  const setWorkspaceGroupIds = (workspaceId: string, groupIds: string[]) => {
    groupOrderByWorkspace.value[workspaceId] = groupIds;
  };

  // 向工作空间追加分组排序
  const appendWorkspaceGroupId = (workspaceId: string, groupId: string) => {
    getWorkspaceGroupIds(workspaceId).push(groupId);
  };

  // 从工作空间移除分组排序
  const removeWorkspaceGroupId = (workspaceId: string, groupId: string) => {
    const ids = getWorkspaceGroupIds(workspaceId).filter((id) => {
      return id !== groupId;
    });

    setWorkspaceGroupIds(workspaceId, ids);
  };

  return {
    workspaces,
    workspaceIds,
    groupOrderByWorkspace,
    getWorkspace,
    getWorkspaces,
    getWorkspaceGroupIds,
    setWorkspaceGroupIds,
    addWorkspace,
    updateWorkspace,
    removeWorkspace,
    appendWorkspaceGroupId,
    removeWorkspaceGroupId,
  };
});
