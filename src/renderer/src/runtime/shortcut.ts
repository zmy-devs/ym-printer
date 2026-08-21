import { useEventListener } from '@vueuse/core';
import { eventBus } from '@/utils/event-bus';
import { useDocumentService } from '@/services/document.service';
import { useSelectionStore } from '@/stores/selection.store';

// 注册应用快捷键
export const useShortcut = () => {
  // 当前分组业务状态
  const { selectedGroup } = storeToRefs(useSelectionStore());

  // 当前分组文档导入能力
  const { addDocs } = useDocumentService();

  // 监听粘贴的文档文件
  useEventListener('paste', (event) => {
    // 剪贴板中的文件列表
    const files = event.clipboardData?.files;

    if (!files || files.length === 0) return;

    addDocs(undefined, Array.from(files));
  });

  // 监听键盘快捷键
  useEventListener('keydown', (event) => {
    // 新建工作空间
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'n') {
      eventBus.emit('dialog-workspace:add:show');
      return;
    }

    // 新建分组
    if (event.ctrlKey && !event.shiftKey && event.key === 'n') {
      eventBus.emit('dialog-group:add:show');
      return;
    }

    // 打开设置
    if (event.ctrlKey && event.key === ',') {
      eventBus.emit('dialog-setting:show');
      return;
    }

    // 添加文档
    if (event.ctrlKey && event.key === 'o') {
      addDocs();
      return;
    }

    // 编辑当前分组
    if (event.ctrlKey && event.key === 'e' && selectedGroup.value) {
      eventBus.emit('dialog-group:edit:show', selectedGroup.value);
    }
  });
};
