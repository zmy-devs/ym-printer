import type { Preset } from '@/stores/preset.store';
import type { Group, Workspace } from '@type';

// 定义事件到函数类型的映射
type EventMap = {
  'dialog-print:show': [];
  'dialog-print-task:show': [];
  'dialog-setting:show': [id?: string];

  'dialog-workspace:add:show': [];
  'dialog-workspace:edit:show': [data: Workspace];

  'dialog-group:add:show': [];
  'dialog-group:edit:show': [data: Group];

  'dialog-preset:add:show': [data: string];
  'dialog-preset:edit:show': [data: Preset];
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
