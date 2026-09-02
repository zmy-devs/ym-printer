import { SplitterPanel } from 'reka-ui';

export const panelRef = ref<InstanceType<typeof SplitterPanel>>();

// 右侧边栏面板实例
export const rightPanelRef = ref<InstanceType<typeof SplitterPanel>>();

export const toggleSilderbar = () => {
  if (!panelRef.value) {
    return;
  }

  panelRef.value.isCollapsed
    ? panelRef.value.expand()
    : panelRef.value.collapse();
};

// 切换右侧边栏可见性
export const toggleRightSidebar = () => {
  if (!rightPanelRef.value) {
    return;
  }

  rightPanelRef.value.isCollapsed
    ? rightPanelRef.value.expand()
    : rightPanelRef.value.collapse();
};
