import { Component } from 'vue';

import GroupView from './views/group.vue';
import WorkspaceView from './views/workspace.vue';
import { BriefcaseIcon, FolderClosedIcon } from '@lucide/vue';
import { useGroupStore } from '@/stores/group.store';
import { useSettingsStore } from '@/stores/settings.store';

export interface OnboardingRoute {
  title: string;
  description: string;
  icon: Component;
  component: Component;
  fields: string[];
}

export const onboardingRouter: OnboardingRoute[] = [];

//当前选中的索引
const selectedRouteIndex = ref(0);

//当前路由
export const currentRoute = computed(() => {
  return onboardingRouter[selectedRouteIndex.value];
});

//是不是第一步
export const isFirst = computed(() => {
  return selectedRouteIndex.value == 0;
});

//是不是最后一步
export const isLast = computed(() => {
  return selectedRouteIndex.value == onboardingRouter.length - 1;
});

//上一步
export const preStep = () => {
  if (isFirst.value) {
    return;
  }

  selectedRouteIndex.value -= 1;
};

//下一步
export const nextStep = async () => {
  if (isLast.value) {
    return;
  }

  selectedRouteIndex.value += 1;
};

//初始化路由
export const initRouter = () => {
  // 应用设置状态
  const settingsStore = useSettingsStore();
  // 本机分组状态
  const groupStore = useGroupStore();

  if (!settingsStore.settings.clientName.trim()) {
    onboardingRouter.push({
      title: '为你的工作空间命名',
      description: '工作空间名称会显示在团队协作和局域网发现列表中。',
      icon: BriefcaseIcon,
      component: WorkspaceView,
      fields: ['workspaceName'],
    });
  }

  if (groupStore.groupIds.length == 0) {
    onboardingRouter.push({
      title: '让我们新建你的第一个组',
      description: '请根据提示输入对应内容以新建你的第一个组。',
      icon: FolderClosedIcon,
      component: GroupView,
      fields: ['groupName', 'groupPrinter'],
    });
  }

  if (onboardingRouter.length == 0) {
    useRouter().replace('/doc');
  }
};
