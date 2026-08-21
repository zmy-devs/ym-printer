import { useEventListener } from '@vueuse/core';
import MessageBox from '@/components/message-box';
import { useDocumentService } from '@/services/document.service';

// 注册主窗口关闭防误触逻辑
export const useWindowClose = () => {
  // 全部文档查询能力
  const { getAllDocs } = useDocumentService();

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

  // 根据打印 Sheet 与全部文档拦截窗口关闭
  useEventListener(window, 'beforeunload', (event) => {
    if (allowClose.value) {
      return;
    }

    // 全部组中的文档数量
    const documentCount = getAllDocs().length;

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
      description: '当前还有文档，确定要关闭吗？',
      confirmButtonText: '关闭',
      cancelButtonText: '取消',
    }).then(handleConfirmClose);
  });
};
