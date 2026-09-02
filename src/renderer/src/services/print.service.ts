import type { Doc, PrintConfig, PrintPhase, PrintQueue } from '@type';
import { isAutoDuplexPrint, isSimplexPrint } from '@shared/print';
import { useDocStore } from '@/stores/doc.store';
import { usePrintConfigStore } from '@/stores/print-config.store';
import { usePrintQueueStore } from '@/stores/print-queue.store';
import { clone } from '@/utils/clone';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

// 提供打印流程编排与队列消费能力
export const usePrintService = () => {
  // 文档实体状态
  const docStore = useDocStore();

  // 文档打印配置与运行状态
  const printConfigStore = usePrintConfigStore();

  // 待处理的打印任务队列状态
  const printQueueStore = usePrintQueueStore();

  // 串行消费全部待处理打印任务
  const runPrintQueue = async () => {
    if (printQueueStore.isProcessing) {
      return;
    }

    printQueueStore.setProcessing(true);

    try {
      while (true) {
        // 当前出队并上传的打印任务
        const task = printQueueStore.takePrintQueue();

        if (!task) {
          return;
        }

        // 当前任务关联的文档
        const doc = docStore.getDoc(task.docId);

        try {
          if (!doc) {
            throw new Error('文档已不存在');
          }

          task.start?.();
          await ipc.print(toRaw(doc), toRaw(task.config), task.phase);
          task.end?.();
        } catch (error) {
          console.error(error);
          task.error?.(error);
        }
      }
    } finally {
      printQueueStore.setProcessing(false);
    }
  };

  // 添加打印任务并启动队列消费
  const addPrintQueue = (task: Omit<PrintQueue, 'id'>) => {
    // 新增打印任务标识
    const queueId = printQueueStore.addPrintQueue(task);

    runPrintQueue();

    return queueId;
  };

  // 将普通流程的指定阶段加入打印队列
  const enqueuePrintPhase = (docId: string, phase: PrintPhase) => {
    // 当前文档
    const doc = docStore.getDoc(docId);

    // 当前文档打印配置
    const config = printConfigStore.getPrintConfig(docId);

    // 当前文档打印运行状态
    const state = printConfigStore.getPrintState(docId);

    if (!doc || !config || !state) {
      return;
    }

    // 是否由打印机驱动自动完成双面
    const autoDuplex = isAutoDuplexPrint(config);

    // 是否为全单面打印任务
    const simplex = isSimplexPrint(config.pageNumbers);

    state.status = 'queued';

    // 当前阶段加入队列后的任务标识
    const queueId = addPrintQueue({
      docId,
      // 当前阶段使用的完整冻结打印配置
      config: clone(config),
      // 由 Electron 根据阶段计算实际页码
      phase,
      // 当前任务真正开始上传时更新状态
      start: () => {
        state.status = 'uploading';
      },
      // 当前阶段成功后推进双面流程或标记完成
      end: () => {
        delete state.queueId;

        if (phase === 'all' && !simplex && !autoDuplex) {
          state.status = 'waiting';
          return;
        }

        state.status = 'completed';
        showSuccessToast(`打印完成 “${doc.name}”`);
      },
      // 当前阶段失败后允许重新发起打印
      error: () => {
        state.status = 'failed';
        delete state.queueId;
        showErrorToast(`打印失败 “${doc.name}”`);
      },
    });

    state.queueId = queueId;
  };

  // 将当前配置保存为预备打印任务
  const preparePrint = (doc: Doc, config: PrintConfig) => {
    printConfigStore.setPrintConfig(doc.id, config);

    // 当前文档打印运行状态
    const state = printConfigStore.getPrintState(doc.id);

    if (!state) {
      return;
    }

    state.status = 'preparing';
    delete state.queueId;
  };

  // 保存配置并直接开始普通打印流程
  const startPrint = (doc: Doc, config: PrintConfig) => {
    printConfigStore.setPrintConfig(doc.id, config);
    enqueuePrintPhase(doc.id, 'all');
  };

  // 保存配置并直接标记为打印完成
  const completePrint = (doc: Doc, config: PrintConfig) => {
    printConfigStore.setPrintConfig(doc.id, config);

    // 当前文档打印运行状态
    const state = printConfigStore.getPrintState(doc.id);

    if (!state) {
      return;
    }

    state.status = 'completed';
    delete state.queueId;
  };

  // 开始已预备文档的普通打印流程
  const startPreparedPrint = (docId: string) => {
    enqueuePrintPhase(docId, 'all');
  };

  // 继续双面打印的正面上传任务
  const continuePrint = (docId: string) => {
    enqueuePrintPhase(docId, 'front');
  };

  // 取消准备、排队、等待或失败的普通打印流程
  const cancelPrint = (docId: string) => {
    // 当前文档打印运行状态
    const state = printConfigStore.getPrintState(docId);

    if (!state) {
      return;
    }

    if (state.queueId) {
      printQueueStore.removePrintQueue(state.queueId);
    }

    state.status = 'idle';
    delete state.queueId;
  };

  // 重试失败的完整打印流程
  const retryPrint = (docId: string) => {
    // 当前文档打印运行状态
    const state = printConfigStore.getPrintState(docId);

    if (!state || state.status !== 'failed') {
      return;
    }

    enqueuePrintPhase(docId, 'all');
  };

  // 根据表单临时配置加入补救打印任务
  const addRecoveryPrint = (
    doc: Doc,
    config: PrintConfig,
    phase: PrintQueue['phase'],
  ) => {
    // 补救任务的异步完成控制器
    const { promise, resolve, reject } = Promise.withResolvers<void>();

    addPrintQueue({
      docId: doc.id,
      // 当前补救任务使用的完整冻结打印配置
      config: clone(config),
      // 由 Electron 根据阶段计算实际页码
      phase,
      // 补救成功后结束提示任务
      end: resolve,
      // 补救失败后结束提示任务
      error: reject,
    });

    return promise;
  };

  // 移除指定文档的待处理任务与打印数据
  const removePrintData = (docId: string) => {
    printQueueStore.removePrintQueueFromDoc(docId);
    printConfigStore.removePrintData(docId);
  };

  return {
    preparePrint,
    startPrint,
    completePrint,
    startPreparedPrint,
    continuePrint,
    cancelPrint,
    retryPrint,
    addRecoveryPrint,
    removePrintData,
  };
};
