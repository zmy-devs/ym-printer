import { SplitterPanel } from 'reka-ui';
import type { InjectionKey, ShallowRef } from 'vue';

// 工作区面板组件实例类型
type WorkspacePanel = InstanceType<typeof SplitterPanel>;

// 创建工作区上下文需要的根组件面板实例
type WorkspaceContextOptions = {
  panelRef: Readonly<ShallowRef<WorkspacePanel | null>>;
  rightPanelRef: Readonly<ShallowRef<WorkspacePanel | null>>;
};

// 创建工作区子组件共享的状态与操作
const createWorkspaceContext = ({
  panelRef,
  rightPanelRef,
}: WorkspaceContextOptions) => {
  // 切换左侧边栏可见性
  const toggleSidebar = () => {
    if (!panelRef.value) {
      return;
    }

    panelRef.value.isCollapsed
      ? panelRef.value.expand()
      : panelRef.value.collapse();
  };

  // 切换右侧边栏可见性
  const toggleRightSidebar = () => {
    if (!rightPanelRef.value) {
      return;
    }

    rightPanelRef.value.isCollapsed
      ? rightPanelRef.value.expand()
      : rightPanelRef.value.collapse();
  };

  return {
    panelRef,
    rightPanelRef,
    toggleSidebar,
    toggleRightSidebar,
  };
};

// 工作区子组件共享的上下文类型
type WorkspaceContext = ReturnType<typeof createWorkspaceContext>;

// 工作区上下文标识
const workspaceContextKey: InjectionKey<WorkspaceContext> =
  Symbol('WorkspaceContext');

// 创建并提供当前工作区上下文
export const provideWorkspaceContext = (options: WorkspaceContextOptions) => {
  // 当前工作区上下文
  const context = createWorkspaceContext(options);

  provide(workspaceContextKey, context);

  return context;
};

// 获取上层工作区提供的上下文
export const useWorkspaceContext = () => {
  // 当前组件所在工作区的上下文
  const context = inject(workspaceContextKey);

  if (!context) {
    throw new Error('工作区子组件必须在工作区内使用');
  }

  return context;
};
