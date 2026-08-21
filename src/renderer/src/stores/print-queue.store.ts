import { nanoid } from 'nanoid';
import type { PrintQueue } from '@type';
import { useDocStore } from './doc.store';

export const usePrintQueueStore = defineStore('print-queue', () => {
  const docStore = useDocStore();

  // 等待上传的打印任务
  const printQueue = ref<PrintQueue[]>([]);

  // 队列是否正在消费
  const isProcessing = ref(false);

  // 串行消费全部待上传打印任务
  const runPrintQueue = async () => {
    if (isProcessing.value) {
      return;
    }

    isProcessing.value = true;

    while (printQueue.value.length > 0) {
      // 当前出队并上传的打印任务
      const task = printQueue.value.shift()!;

      // 当前任务关联的文档
      const doc = docStore.getDoc(task.docId);

      try {
        if (!doc) {
          throw new Error('文档已不存在');
        }

        task.start && task.start();
        await ipc.print(doc, task.config, task.config.pageNumbers);
        task.end && task.end();
      } catch (error) {
        task.error && task.error(error);
      }
    }

    isProcessing.value = false;
  };

  // 新增一个冻结配置的打印任务
  const addPrintQueue = (task: Omit<PrintQueue, 'id'>) => {
    // 新增任务唯一标识
    const id = nanoid();
    // 包含唯一标识的完整打印任务
    const printTask = { ...task, id };

    printQueue.value.push(printTask);

    runPrintQueue();

    return id;
  };

  // 移除尚未开始的指定打印任务
  const removePrintQueue = (queueId: string) => {
    // 移除后的待上传任务
    const nextPrintQueue = printQueue.value.filter((task) => {
      return task.id !== queueId;
    });

    if (nextPrintQueue.length === printQueue.value.length) {
      return;
    }

    printQueue.value = nextPrintQueue;
  };

  // 移除指定文档全部尚未开始的打印任务
  const removePrintQueueFromDoc = (docId: string) => {
    printQueue.value = printQueue.value.filter((task) => {
      return task.docId !== docId;
    });
  };

  return {
    printQueue,
    addPrintQueue,
    removePrintQueue,
    removePrintQueueFromDoc,
  };
});
