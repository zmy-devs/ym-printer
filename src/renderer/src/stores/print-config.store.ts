import type { PrintConfig, PrintState, PrintStatus } from '@type';

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

// 管理文档打印配置与运行状态
export const usePrintConfigStore = defineStore('print-config', () => {
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

  // 判断指定文档是否处于不可编辑的打印状态
  const isPrintDisabled = (docId: string) => {
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

  // 移除文档打印配置与运行状态
  const removePrintData = (docId: string) => {
    delete printConfigs.value[docId];
    delete printStates.value[docId];
  };

  // 设置指定文档的打印配置
  const setPrintConfig = (docId: string, config: PrintConfig) => {
    printConfigs.value[docId] = config;
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
  };
});
