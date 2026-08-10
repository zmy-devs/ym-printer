import { DirectiveBinding } from 'vue';

interface DragOptions {
  onEnter?: (e: DragEvent) => void;
  onOver?: (e: DragEvent) => void;
  onLeave?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  onChange?: (isDragging: boolean) => void;
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<DragOptions>) {
    // 1. 使用计数器解决嵌套子元素触发 dragleave 的问题
    let dragCounter = 0;

    const handleChange = (value: boolean) => {
      if (binding.value?.onChange) binding.value.onChange(value);
    };

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();

      // 2. 核心过滤：如果你只想响应“外部文件”拖入，解除下面代码注释
      // const isFile = e.dataTransfer?.types.includes("Files");
      // if (!isFile) return;

      dragCounter++;

      // 只有第一次进入容器（或其子元素）时触发
      if (dragCounter === 1) {
        handleChange(true);
        if (binding.value?.onEnter) binding.value.onEnter(e);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      // 必须阻止默认行为，否则 drop 事件不会触发
      e.preventDefault();
      if (binding.value?.onOver) binding.value.onOver(e);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;

      // 只有当计数器归零，说明鼠标真正离开了该元素及其所有子元素
      if (dragCounter === 0) {
        handleChange(false);
        if (binding.value?.onLeave) binding.value.onLeave(e);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      // 结束后重置计数器
      dragCounter = 0;
      handleChange(false);
      if (binding.value?.onDrop) binding.value.onDrop(e);
    };

    // 绑定事件
    el.addEventListener('dragenter', handleDragEnter);
    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('dragleave', handleDragLeave);
    el.addEventListener('drop', handleDrop);

    // 存储引用以便卸载
    (el as any)._dragHandlers = {
      handleDragEnter,
      handleDragOver,
      handleDragLeave,
      handleDrop,
    };
  },

  unmounted(el: HTMLElement) {
    const handlers = (el as any)._dragHandlers;
    if (handlers) {
      el.removeEventListener('dragenter', handlers.handleDragEnter);
      el.removeEventListener('dragover', handlers.handleDragOver);
      el.removeEventListener('dragleave', handlers.handleDragLeave);
      el.removeEventListener('drop', handlers.handleDrop);
      delete (el as any)._dragHandlers;
    }
  },
};
