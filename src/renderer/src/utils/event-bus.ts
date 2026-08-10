import { presetTypeMap, workspaceTypeMap } from '@/map';
import type { Preset } from '@/stores/preset';
import type { Workspace } from '@/stores/workspace';

// 定义事件到函数类型的映射
type EventMap = {
  'success:show': [msg: string];
  'loading:show': [
    option: {
      successMsg?: string;
      errorMsg?: string;
      loadingMsg?: string;
      cb: () => Promise<void>;
    },
  ];
  'error:show': [msg: string];

  'dialog-print:show': [];
  'dialog-print-task:show': [];
  'dialog-setting:show': [id?: string];

  'dialog-workspace:show': [
    option: {
      type: keyof typeof workspaceTypeMap;
      data?: Workspace;
    },
  ];

  'dialog-preset:show': [];

  'dialog-preset-form:show': [
    option: {
      type: keyof typeof presetTypeMap;
      data?: Preset;
    },
  ];
};

type EventName = keyof EventMap;
type EventHandler<T extends EventName> = (...args: EventMap[T]) => void;

class EventBus {
  // 事件监听器集合
  private listeners = new Map<EventName, Set<(...args: any[]) => void>>();

  // 监听事件
  on<T extends EventName>(eventName: T, handler: EventHandler<T>) {
    const handlers = this.listeners.get(eventName) ?? new Set();

    handlers.add(handler);
    this.listeners.set(eventName, handlers);

    return () => {
      handlers.delete(handler);

      if (handlers.size === 0) {
        this.listeners.delete(eventName);
      }
    };
  }

  // 触发事件
  emit<T extends EventName>(eventName: T, ...args: EventMap[T]) {
    this.listeners.get(eventName)?.forEach((handler) => {
      handler(...args);
    });
  }
}

// 全局事件总线
export const eventBus = new EventBus();
