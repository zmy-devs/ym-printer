import type { Doc, PrintConfig, PrintState, PrintStatus } from '@type';
import { showErrorToast, showSuccessToast } from '@/utils/toast';
import {
  getPhasePageNumbers,
  isSimplexPrint,
  type PrintPhase,
} from '@/utils/print';
import { useDocStore } from './doc.store';
import { usePrintQueueStore } from './print-queue.store';
import { clone } from '@/utils/clone';
import { useSelectionStore } from './selection.store';

// 文档打印配置的扁平映射
type PrintConfigMap = Record<string, PrintConfig>;

// 文档打印状态的扁平映射
type PrintStateMap = Record<string, PrintState>;

// 禁止编辑或重新加载文档的打印流程状态
const disabledPrintStatuses: PrintStatus[] = ['queued', 'uploading', 'waiting'];

// 创建默认打印运行状态
const createDefaultPrintState = (): PrintState => {
  return {
    status: 'idle',
  };
};

export const usePrintConfigStore = defineStore('print-config', () => {
  // 当前文档选择状态
  const selectionStore = useSelectionStore();

  // 打印队列状态
  const printQueueStore = usePrintQueueStore();

  // 文档实体状态
  const docStore = useDocStore();

  // 文档标识对应的打印配置
  const printConfigs = ref<PrintConfigMap>({});

  // 文档标识对应的打印运行状态
  const printStates = ref<PrintStateMap>({});

  // 获取指定文档的打印配置
  const getPrintConfig = (docId: string) => {
    return printConfigs.value[docId];
  };

  // 获取指定文档的打印运行状态
  const getPrintState = (docId: string) => {
    return printStates.value[docId];
  };

  // 判断指定或当前选中文档是否处于不可编辑的打印状态
  const isPrintDisabled = (docId = selectionStore.docId) => {
    // 当前文档的打印流程状态
    const status = getPrintState(docId)?.status;

    return disabledPrintStatuses.includes(status);
  };

  // 为已就绪文档初始化打印运行状态
  const initPrintState = (docId: string) => {
    if (!printStates.value[docId]) {
      printStates.value[docId] = createDefaultPrintState();
    }
  };

  // 移除文档全部打印配置与运行状态
  const removePrintData = (docId: string) => {
    printQueueStore.removePrintQueueFromDoc(docId);

    delete printConfigs.value[docId];
    delete printStates.value[docId];
  };

  // 直接设置已经解析完成的打印配置
  const setPrintConfig = (docId: string, config: PrintConfig) => {
    printConfigs.value[docId] = config;
  };

  // 将普通流程的指定阶段加入上传队列
  const enqueuePrintPhase = (docId: string, phase: PrintPhase) => {
    // 当前文档
    const doc = docStore.getDoc(docId);
    // 当前文档打印配置
    const config = getPrintConfig(docId);
    // 当前文档打印运行状态
    const state = getPrintState(docId);

    if (!doc || !config || !state) {
      return;
    }

    // 本阶段需要上传的页码
    const pageNumbers = getPhasePageNumbers(config, phase);
    // 是否为全单面打印任务
    const simplex = isSimplexPrint(config.pageNumbers);

    state.status = 'queued';
    const queueId = printQueueStore.addPrintQueue({
      docId,
      // 当前阶段页码已冻结的打印配置
      config: { ...clone(config), pageNumbers },
      // 当前任务真正开始上传时更新状态
      start: () => {
        state.status = 'uploading';
      },
      // 当前阶段成功后推进双面流程或标记完成
      end: () => {
        delete state.queueId;

        if (phase === 'initial' && !simplex) {
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
    setPrintConfig(doc.id, config);

    // 当前文档打印运行状态
    const state = getPrintState(doc.id);

    if (!state) {
      return;
    }

    state.status = 'preparing';
    delete state.queueId;
  };

  // 保存配置并直接开始普通打印流程
  const startPrint = (doc: Doc, config: PrintConfig) => {
    setPrintConfig(doc.id, config);
    enqueuePrintPhase(doc.id, 'initial');
  };

  // 保存配置并直接标记为打印完成
  const completePrint = (doc: Doc, config: PrintConfig) => {
    setPrintConfig(doc.id, config);

    // 当前文档打印运行状态
    const state = getPrintState(doc.id);

    if (!state) {
      return;
    }

    state.status = 'completed';
    delete state.queueId;
  };

  // 开始已预备文档的普通打印流程
  const startPreparedPrint = (docId: string) => {
    enqueuePrintPhase(docId, 'initial');
  };

  // 继续双面打印的正面上传任务
  const continuePrint = (docId: string) => {
    enqueuePrintPhase(docId, 'front');
  };

  // 取消准备、排队、等待或失败的普通打印流程
  const cancelPrint = (docId: string) => {
    // 打印队列仓库
    const printQueueStore = usePrintQueueStore();
    // 当前文档打印运行状态
    const state = getPrintState(docId);

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
    const state = getPrintState(docId);

    if (!state || state.status !== 'failed') {
      return;
    }

    enqueuePrintPhase(docId, 'initial');
  };

  // 根据表单临时配置加入补救打印任务
  const addRecoveryPrint = (
    doc: Doc,
    config: PrintConfig,
    phase: 'all' | 'front' | 'back',
  ) => {
    // 补救任务的异步完成控制器
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    // 本次补救实际上传的页码
    const recoveryPageNumbers = getPhasePageNumbers(
      config,
      phase === 'front' ? 'front' : 'initial',
    );

    printQueueStore.addPrintQueue({
      docId: doc.id,
      // 当前补救页码已冻结的打印配置
      config: { ...clone(config), pageNumbers: recoveryPageNumbers },
      // 补救成功后结束提示任务
      end: resolve,
      // 补救失败后结束提示任务
      error: reject,
    });

    return promise;
  };

  return {
    printConfigs,
    printStates,
    getPrintConfig,
    getPrintState,
    isPrintDisabled,
    initPrintState,
    removePrintData,
    setPrintConfig,
    preparePrint,
    startPrint,
    completePrint,
    startPreparedPrint,
    continuePrint,
    cancelPrint,
    retryPrint,
    addRecoveryPrint,
  };
});
