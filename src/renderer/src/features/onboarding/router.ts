import { Component } from 'vue';

import PrinterView from './views/printer.vue';
import WorkspaceView from './views/workspace.vue';
import { FolderClosedIcon, PrinterIcon } from '@lucide/vue';
import { useWorkspaceStore } from '@/stores/workspace';
import { usePrinterStore } from '@/stores/printer';

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
  if (usePrinterStore().selectedPrinter == '') {
    onboardingRouter.push({
      title: '让我们选择你的默认打印机',
      description: '请选择你电脑上的一个打印机作为默认打印机',
      icon: PrinterIcon,
      component: PrinterView,
      fields: ['defaultPrinter'],
    });
  }

  if (useWorkspaceStore().workspace.length == 0) {
    onboardingRouter.push({
      title: '让我们新建你的第一个工作空间',
      description: '请根据提示输入对应的内容已新建你的工作空间。',
      icon: FolderClosedIcon,
      component: WorkspaceView,
      fields: ['workspaceName', 'workspacePrinter'],
    });
  }

  if (onboardingRouter.length == 0) {
    useRouter().replace('/doc');
  }
};
