import { randomUUID } from 'crypto';
import workerPath from './worker?nodeWorker';

type WorkerMessage =
  | {
      type: 'ready';
      data: {
        launchMs: number;
        warmupMs: number;
      };
    }
  | {
      type: 'success';
      data: {
        taskId: string;
        openMs: number;
        exportMs: number;
      };
    }
  | {
      type: 'error';
      data: {
        taskId: string;
        message: string;
      };
    }
  | {
      type: 'startupError';
      data: {
        message: string;
      };
    };

// 等待转换完成的任务控制器
type TaskController = PromiseWithResolvers<void>;

// Word 专用工作线程
const worker = workerPath({
  workerData: 'word',
});

// 当前 Word 启动任务，确保只启动一次
let wordReadyPromise: Promise<void> | null = null;

// 当前 Word 启动任务的控制器
let wordReadyController: PromiseWithResolvers<void> | null = null;

// 等待响应的转换任务
const taskControllers = new Map<string, TaskController>();

// 将未完成任务全部标记为失败
const rejectPendingTasks = (error: Error) => {
  taskControllers.forEach((controller) => {
    controller.reject(error);
  });

  taskControllers.clear();
};

// 处理 Word 工作线程的消息
const handleWorkerMessage = (message: WorkerMessage) => {
  switch (message.type) {
    case 'ready':
      wordReadyController?.resolve();
      wordReadyController = null;

      console.info(
        `Word 预热完成：启动 ${message.data.launchMs}ms，PDF 导出组件 ${message.data.warmupMs}ms`,
      );
      return;
    case 'success': {
      const taskController = taskControllers.get(message.data.taskId);

      if (!taskController) {
        return;
      }

      taskController.resolve();
      taskControllers.delete(message.data.taskId);

      console.info(
        `Word 转 PDF 完成：打开文档 ${message.data.openMs}ms，导出 ${message.data.exportMs}ms`,
      );
      return;
    }
    case 'error': {
      const taskController = taskControllers.get(message.data.taskId);

      if (!taskController) {
        return;
      }

      taskController.reject(new Error(message.data.message));
      taskControllers.delete(message.data.taskId);
      return;
    }
    case 'startupError': {
      const startupError = new Error(message.data.message);

      wordReadyController?.reject(startupError);
      wordReadyController = null;
      wordReadyPromise = null;
      return;
    }
  }
};

// 处理工作线程异常退出
const handleWorkerError = (error: Error) => {
  wordReadyController?.reject(error);
  wordReadyController = null;
  wordReadyPromise = null;
  rejectPendingTasks(error);
};

worker.on('message', handleWorkerMessage);
worker.on('error', handleWorkerError);

// 创建并预热 Word 实例
export const createWord = () => {
  if (wordReadyPromise) {
    return wordReadyPromise;
  }

  // 当前启动任务的控制器
  const controller = Promise.withResolvers<void>();

  wordReadyController = controller;
  wordReadyPromise = controller.promise;

  worker.postMessage({
    action: 'open',
  });

  return wordReadyPromise;
};

// 关闭 Word 实例
export const exitWord = () => {
  worker.postMessage({
    action: 'exit',
  });
};

// 将 Word 文档转换为 PDF
export const toPdf = async (inputPath: string, outputPath: string) => {
  await createWord();

  // 本次转换的唯一标识
  const taskId = randomUUID();

  // 本次转换的等待控制器
  const controller = Promise.withResolvers<void>();

  taskControllers.set(taskId, controller);

  worker.postMessage({
    action: 'save',
    params: {
      inputPath,
      outputPath,
      taskId,
    },
  });

  return controller.promise;
};
