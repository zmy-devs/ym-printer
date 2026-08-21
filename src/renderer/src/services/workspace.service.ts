import { nanoid } from 'nanoid';
import type { Group, Workspace } from '@type';
import { useDocStore } from '@/stores/doc.store';
import { useGroupStore } from '@/stores/group.store';
import { useSelectionStore } from '@/stores/selection.store';
import { useWorkspaceStore } from '@/stores/workspace.store';

// 默认分组初始名称
const defaultGroupName = '默认分组';

// 提供工作空间的跨实体业务操作
export const useWorkspaceService = () => {
  // 工作空间实体状态
  const workspaceStore = useWorkspaceStore();

  // 分组实体状态
  const groupStore = useGroupStore();

  // 文档实体状态
  const docStore = useDocStore();

  // 当前选择状态
  const selectionStore = useSelectionStore();

  // 选择工作空间及其首个分组
  const selectWorkspace = (workspaceId: string) => {
    selectionStore.selectWorkspace(workspaceId);

    const groupIds = workspaceStore.getWorkspaceGroupIds(workspaceId);

    selectionStore.selectGroup(groupIds[0]);
  };

  // 初始化工作空间及首个分组选择
  const initSelection = () => {
    if (!selectionStore.workspaceId) {
      return;
    }

    // 当前工作空间下按排序取首个分组
    const firstGroupId = workspaceStore.getWorkspaceGroupIds(
      selectionStore.workspaceId,
    )[0];

    if (!firstGroupId) {
      return;
    }

    selectionStore.selectGroup(firstGroupId);
  };

  // 创建工作空间及其首个分组
  const createWorkspace = (data: Pick<Workspace, 'name' | 'printer'>) => {
    // 新工作空间标识
    const workspaceId = nanoid();

    // 新分组标识
    const groupId = nanoid();

    // 新分组实体
    const group: Group = {
      id: groupId,
      name: defaultGroupName,
      workspaceId,
    };

    // 新工作空间实体
    const workspace: Workspace = {
      id: workspaceId,
      name: data.name,
      printer: data.printer,
    };

    groupStore.addGroup(group);

    workspaceStore.addWorkspace(workspace);
    workspaceStore.setWorkspaceGroupIds(workspaceId, [groupId]);

    selectionStore.selectWorkspace(workspaceId);
    selectionStore.selectGroup(groupId);
  };

  // 级联删除工作空间及其下级实体
  const removeWorkspace = (workspaceId: string) => {
    // 待删除的工作空间
    const workspace = workspaceStore.getWorkspace(workspaceId);

    if (!workspace) {
      return;
    }

    // 待删除的分组实体
    const targetGroupIds = workspaceStore.getWorkspaceGroupIds(workspaceId);

    // 待删除的文档标识
    const targetDocIds = targetGroupIds.flatMap((groupId) => {
      return groupStore.getGroupDocIds(groupId);
    });

    docStore.removeDocs(targetDocIds);
    groupStore.removeGroup(targetGroupIds);
    workspaceStore.removeWorkspace(workspaceId);

    if (selectionStore.workspaceId !== workspaceId) {
      return;
    }

    // 删除后首个可用工作空间
    const fallbackWorkspaceId = workspaceStore.workspaceIds[0];

    if (fallbackWorkspaceId) {
      selectWorkspace(fallbackWorkspaceId);
    }
  };

  // 更新工作空间基础信息
  const editWorkspace = (workspace: Workspace) => {
    workspaceStore.updateWorkspace(workspace.id, workspace);
  };

  return {
    selectWorkspace,
    initSelection,
    createWorkspace,
    removeWorkspace,
    editWorkspace,
  };
};
