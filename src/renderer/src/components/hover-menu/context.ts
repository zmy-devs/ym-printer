import { inject } from 'vue';
import type { InjectionKey } from 'vue';

// HoverMenu 子组件共享的悬浮控制方法
type HoverMenuContext = {
  handleOpen: () => void;
  handleClose: () => void;
  handleScheduleClose: () => void;
  handleCancelClose: () => void;
};

// HoverMenu 组合组件的上下文标识
export const hoverMenuContextKey: InjectionKey<HoverMenuContext> =
  Symbol('HoverMenuContext');

// 获取 HoverMenu 组合组件的悬浮控制方法
export const useHoverMenuContext = () => {
  // 当前 HoverMenu 根组件提供的上下文
  const context = inject(hoverMenuContextKey);

  if (!context) {
    throw new Error('HoverMenu 组件必须在 HoverMenu 根组件内使用');
  }

  return context;
};
