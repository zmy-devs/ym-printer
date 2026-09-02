import { nanoid } from 'nanoid';
import type { PrintQueue } from '@type';

// 管理待处理的打印任务队列
export const usePrintQueueStore = defineStore('print-queue', () => {
  // 等待上传的打印任务
  const printQueue = ref<PrintQueue[]>([]);

  // 队列是否正在消费
  const isProcessing = ref(false);

  // 向队列末尾添加打印任务
  const addPrintQueue = (task: Omit<PrintQueue, 'id'>) => {
    // 新增任务唯一标识
    const id = nanoid();

    printQueue.value.push({ ...task, id });

    return id;
  };

  // 取出队列头部的打印任务
  const takePrintQueue = () => {
    return printQueue.value.shift();
  };

  // 更新队列消费状态
  const setProcessing = (value: boolean) => {
    isProcessing.value = value;
  };

  // 移除尚未开始的指定打印任务
  const removePrintQueue = (queueId: string) => {
    printQueue.value = printQueue.value.filter((task) => {
      return task.id !== queueId;
    });
  };

  // 移除指定文档全部尚未开始的打印任务
  const removePrintQueueFromDoc = (docId: string) => {
    printQueue.value = printQueue.value.filter((task) => {
      return task.docId !== docId;
    });
  };

  return {
    printQueue,
    isProcessing,
    addPrintQueue,
    takePrintQueue,
    setProcessing,
    removePrintQueue,
    removePrintQueueFromDoc,
  };
});
