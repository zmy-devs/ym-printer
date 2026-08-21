import { useEventListener } from '@vueuse/core';
import MessageBox from '@/components/message-box';
import { useDocumentService } from '@/services/document.service';
import { useSelectionStore } from '@/stores/selection.store';

// 注册主窗口关闭防误触逻辑
export const useWindowClose = () => {
  // 当前工作空间选择状态
  const selectionStore = useSelectionStore();

  // 当前工作空间文档查询能力
  const { getWorkspaceDocs } = useDocumentService();

  // 是否已经确认允许关闭窗口
  const allowClose = ref(false);

  // 是否正在显示关闭确认框
  const confirming = ref(false);

  // 确认关闭后放行下一次窗口关闭事件
  const handleConfirmClose = (confirmed: boolean) => {
    confirming.value = false;

    if (!confirmed) {
      return;
    }

    allowClose.value = true;
    window.close();
  };

  // 根据打印 Sheet 与当前工作空间文档拦截窗口关闭
  useEventListener(window, 'beforeunload', (event) => {
    if (allowClose.value) {
      return;
    }

    // 当前选中的工作空间标识
    const workspaceId = selectionStore.workspaceId;

    // 当前工作空间中的文档数量
    const documentCount = workspaceId
      ? getWorkspaceDocs(workspaceId).length
      : 0;

    if (documentCount === 0) {
      return;
    }

    event.preventDefault();

    if (confirming.value) {
      return;
    }

    confirming.value = true;

    MessageBox.confirm({
      title: '确认关闭',
      description: '当前工作空间中还有文档，确定要关闭吗？',
      confirmButtonText: '关闭',
      cancelButtonText: '取消',
    }).then(handleConfirmClose);
  });
};
