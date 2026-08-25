import { BriefcaseIcon, FolderClosedIcon } from '@lucide/vue';
import type { Component } from 'vue';
import { useGroupStore } from '@/stores/group.store';
import { useSettingsStore } from '@/stores/settings.store';
import FirstGroupStep from './steps/first-group-step.vue';
import WorkspaceNameStep from './steps/workspace-name-step.vue';

// 首次配置表单数据
export type InitialSetupValues = {
  workspaceName: string;
  groupName: string;
  groupPrinter: string;
};

// 首次配置步骤标识
type InitialSetupStepId = 'workspace-name' | 'first-group';

// 首次配置步骤展示与校验契约
type InitialSetupStep = {
  id: InitialSetupStepId;
  title: string;
  description: string;
  icon: Component;
  component: Component;
  fields: readonly (keyof InitialSetupValues)[];
};

// 首次配置步骤定义
const initialSetupSteps: readonly InitialSetupStep[] = [
  {
    id: 'workspace-name',
    title: '为你的工作空间命名',
    description: '工作空间名称会显示在团队协作和局域网发现列表中。',
    icon: BriefcaseIcon,
    component: WorkspaceNameStep,
    fields: ['workspaceName'],
  },
  {
    id: 'first-group',
    title: '让我们新建你的第一个组',
    description: '请根据提示输入对应内容以新建你的第一个组。',
    icon: FolderClosedIcon,
    component: FirstGroupStep,
    fields: ['groupName', 'groupPrinter'],
  },
];

// 获取当前仍需完成的首次配置步骤
export const getInitialSetupSteps = () => {
  // 应用设置状态
  const settingsStore = useSettingsStore();
  // 本机分组状态
  const groupStore = useGroupStore();

  return initialSetupSteps.filter((step) => {
    if (step.id === 'workspace-name') {
      return !settingsStore.settings.workspaceName.trim();
    }

    return groupStore.groupIds.length === 0;
  });
};

// 判断应用是否仍需完成首次配置
export const hasPendingInitialSetup = () => {
  return getInitialSetupSteps().length > 0;
};
