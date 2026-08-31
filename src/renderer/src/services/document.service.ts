import { isSupportedDocument } from '@shared/document';
import { showErrorToast } from '@/utils/toast';
import { useDocStore } from '@/stores/doc.store';
import { useGroupStore } from '@/stores/group.store';
import { useSelectionStore } from '@/stores/selection.store';
import { usePrintConfigStore } from '@/stores/print-config.store';
import { toArray } from '@/utils/normalize';
import type { Doc, DocStatus, PrintStatus } from '@type';

// 主进程导入后、尚未关联分组的文档数据
type ImportedDoc = Omit<Doc, 'groupId'>;

// 允许移除的文档解析状态
const removableDocStatuses: DocStatus[] = ['ready', 'error'];

// 允许移除的打印流程状态
const removablePrintStatuses: PrintStatus[] = [
  'idle',
  'preparing',
  'waiting',
  'completed',
  'failed',
];

// 提供文档的跨实体业务操作
export const useDocumentService = () => {
  const groupStore = useGroupStore();
  const docStore = useDocStore();
  const selectionStore = useSelectionStore();
  const printConfigStore = usePrintConfigStore();

  // 获取指定分组内的有序文档
  const getGroupDocs = (groupId: string) => {
    return docStore.getDocs(groupStore.getGroupDocIds(groupId));
  };

  // 获取全部分组内的文档
  const getAllDocs = () => {
    // 全部分组内的文档标识
    const docIds = groupStore.groupIds.flatMap(groupStore.getGroupDocIds);

    return docStore.getDocs(docIds);
  };

  // 获取支持导入的文件路径
  const getDocumentPaths = (files?: File[]) => {
    // 支持导入的文档文件
    const documentFiles = files?.filter((file) => {
      return isSupportedDocument(file.name);
    });

    // 有效文档的原生文件路径
    return documentFiles?.map(api.getFilePath) ?? [];
  };

  // 调用主进程选择并导入文档
  const importDocs = async (files?: File[]) => {
    // 待导入的有效文件路径
    const paths = getDocumentPaths(files);

    if (files && paths.length === 0) {
      return [];
    }

    return ipc.addDoc(toRaw(paths));
  };

  // 过滤重复文档并关联目标分组
  const getNewDocs = (groupId: string, importedDocs: ImportedDoc[]) => {
    // 全部组中已有的文档路径
    const existingPaths = new Set(getAllDocs().map((doc) => doc.path));

    return importedDocs.flatMap((doc) => {
      if (existingPaths.has(doc.path)) {
        showErrorToast(`${doc.name} 已存在`);
        return [];
      }

      existingPaths.add(doc.path);

      return [{ ...doc, groupId }];
    });
  };

  // 异步解析已保存的单个文档
  const parseDoc = async (docId: string) => {
    const doc = docStore.getDoc(docId);

    try {
      await ipc.parserDoc(toRaw(doc));

      doc.status = 'ready';
    } catch {
      doc.status = 'error';
    } finally {
      printConfigStore.initPrintState(doc.id);
    }
  };

  // 导入文档并关联到指定或当前分组
  const addDocs = async (groupId = selectionStore.groupId, files?: File[]) => {
    if (!groupId) {
      return;
    }

    // 主进程解析出的纯文档实体
    const importedDocs = await importDocs(files);

    // 当前批次内去重并关联分组后的文档实体
    const newDocs = getNewDocs(groupId, importedDocs);

    if (newDocs.length === 0) {
      return;
    }

    // 新增的文档id
    const docIds = newDocs.map((doc) => doc.id);

    //添加文档
    docStore.addDocs(newDocs);

    //添加到组中排序
    groupStore.appendGroupDocIds(groupId, docIds);

    //解析
    docIds.forEach(parseDoc);
  };

  // 重新读取文档路径并刷新内容缓存
  const reloadDoc = async (docId = selectionStore.docId) => {
    // 待重新加载的文档
    const doc = docStore.getDoc(docId);

    if (!doc) {
      return;
    }

    doc.status = 'loading';

    try {
      // 当前源文件最新内容摘要
      const md5 = await ipc.reloadDoc(toRaw(doc));

      doc.md5 = md5;
      doc.status = 'ready';

      printConfigStore.initPrintState(doc.id);
    } catch (e) {
      console.error(e);

      doc.status = 'error';
    }
  };

  // 判断单个文档是否可安全移除
  const canRemoveDoc = (docId: string) => {
    // 待判断的文档实体
    const doc = docStore.getDoc(docId);

    if (!doc || !removableDocStatuses.includes(doc.status)) {
      return false;
    }

    // 当前文档打印运行状态
    const printStatus = printConfigStore.getPrintState(docId)?.status;

    return !printStatus || removablePrintStatuses.includes(printStatus);
  };

  // 判断多个文档是否都可安全移除
  const canRemoveDocs = (ids: string | string[]) => {
    // 待判断的文档标识
    const docIds = toArray(ids);

    return docIds.every(canRemoveDoc);
  };

  // 删除文档实体及所属分组排序
  const removeDocs = (ids: string | string[]) => {
    // 待删除的文档标识
    const docIds = toArray(ids);

    docIds.forEach((docId) => {
      // 待删除的文档
      const doc = docStore.getDoc(docId);

      if (doc) {
        groupStore.removeGroupDocIds(doc.groupId, docId);
      }

      printConfigStore.removePrintData(docId);
    });

    docStore.removeDocs(docIds);
  };

  // 清空指定分组内的文档
  const clearGroupDocs = (groupId: string) => {
    removeDocs(groupStore.getGroupDocIds(groupId));
  };

  // 将文档移动到目标分组
  const moveDocs = (groupId: string, docIds: string | string[]) => {
    // 待移动的文档标识集合
    const targetDocIds = toArray(docIds);

    // 目标分组
    const targetGroup = groupStore.getGroup(groupId);

    if (!targetGroup) {
      return;
    }

    // 待移动的文档实体
    const docs = docStore.getDocs(targetDocIds);

    docs.forEach((doc) => {
      groupStore.removeGroupDocIds(doc.groupId, [doc.id]);
      doc.groupId = groupId;
    });

    groupStore.appendGroupDocIds(groupId, targetDocIds);
  };

  return {
    getGroupDocs,
    getAllDocs,
    addDocs,
    reloadDoc,
    canRemoveDocs,
    removeDocs,
    clearGroupDocs,
    moveDocs,
  };
};
