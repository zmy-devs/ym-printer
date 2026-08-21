import { isSupportedDocument } from '@shared/document';
import { showErrorToast } from '@/utils/toast';
import { useDocStore } from '@/stores/doc.store';
import { useGroupStore } from '@/stores/group.store';
import { useSelectionStore } from '@/stores/selection.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { usePrintConfigStore } from '@/stores/print-config.store';

// 提供文档的跨实体业务操作
export const useDocumentService = () => {
  // 工作空间实体状态
  const workspaceStore = useWorkspaceStore();

  // 分组实体状态
  const groupStore = useGroupStore();

  // 文档实体状态
  const docStore = useDocStore();

  // 当前选择状态
  const selectionStore = useSelectionStore();

  // 文档打印配置与运行状态
  const printConfigStore = usePrintConfigStore();

  // 获取指定分组内的有序文档
  const getGroupDocs = (groupId: string) => {
    return docStore.getDocs(groupStore.getGroupDocIds(groupId));
  };

  // 获取指定工作空间内的全部文档
  const getWorkspaceDocs = (workspaceId: string) => {
    // 工作空间下的全部文档标识
    const docIds = workspaceStore
      .getWorkspaceGroupIds(workspaceId)
      .flatMap((groupId) => {
        return groupStore.getGroupDocIds(groupId);
      });

    return docStore.getDocs(docIds);
  };

  // 选择当前分组内的文档
  const selectDoc = (docId: string) => {
    selectionStore.selectDoc(docId);
  };

  // 导入文档并关联到指定或当前分组
  const addDocs = async (groupId = selectionStore.groupId, files?: File[]) => {
    if (!groupId) {
      return;
    }

    // 目标分组
    const group = groupStore.getGroup(groupId);

    if (!group) {
      return;
    }

    // 支持导入的文档文件
    const documentFiles = files?.filter((file) => {
      return isSupportedDocument(file.name);
    });

    // 有效文档的原生文件路径
    const paths = documentFiles?.map(api.getFilePath) ?? [];

    if (files && paths.length === 0) {
      return;
    }

    // 主进程解析出的纯文档实体
    const importedDocs = await ipc.addDoc(paths);

    // 当前工作空间已有的文档路径
    const existingPaths = new Set(
      getWorkspaceDocs(group.workspaceId).map((doc) => doc.path),
    );

    // 当前批次内去重并关联分组后的文档实体
    const validDocs = importedDocs.flatMap((doc) => {
      if (existingPaths.has(doc.path)) {
        showErrorToast(`${doc.name} 已存在`);
        return [];
      }

      existingPaths.add(doc.path);

      return [{ ...doc, groupId }];
    });

    docStore.addDocs(validDocs);

    groupStore.appendGroupDocIds(
      groupId,
      validDocs.map((doc) => doc.id),
    );

    validDocs.map(async (doc) => {
      try {
        await ipc.parserDoc(doc);
        // 解析完成后仍存在的文档实体
        const storedDoc = docStore.getDoc(doc.id);

        if (storedDoc) {
          storedDoc.status = 'ready';

          printConfigStore.initPrintState(storedDoc.id);
        }
      } catch {
        // 解析失败后仍存在的文档实体
        const storedDoc = docStore.getDoc(doc.id);

        if (storedDoc) {
          storedDoc.status = 'error';
        }
      }
    });
  };

  // 重新读取文档路径并刷新内容缓存
  const reloadDoc = async (docId: string) => {
    // 待重新加载的文档
    const doc = docStore.getDoc(docId);

    if (!doc) {
      return false;
    }

    doc.status = 'loading';
    printConfigStore.removePrintData(docId);

    try {
      // 当前源文件最新内容摘要
      const md5 = await ipc.reloadDoc(doc);

      // 重载完成后仍存在的文档实体
      const storedDoc = docStore.getDoc(docId);

      if (!storedDoc) {
        return false;
      }

      storedDoc.md5 = md5;
      storedDoc.status = 'ready';

      printConfigStore.initPrintState(storedDoc.id);

      return true;
    } catch {
      // 重载失败后仍存在的文档实体
      const storedDoc = docStore.getDoc(docId);

      if (storedDoc) {
        storedDoc.status = 'error';
      }

      return false;
    }
  };

  // 删除文档实体及所属分组排序
  const removeDocs = (ids: string | string[]) => {
    // 待删除的文档标识
    const docIds = Array.isArray(ids) ? ids : [ids];

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

  // 将文档移动到同一工作空间内的目标分组
  const moveDocs = (groupId: string, docIds: string | string[]) => {
    docIds = Array.isArray(docIds) ? docIds : [docIds];

    // 目标分组
    const targetGroup = groupStore.getGroup(groupId);

    if (!targetGroup) {
      return;
    }

    // 待移动的文档实体
    const docs = docStore.getDocs(docIds);

    docs.forEach((doc) => {
      groupStore.removeGroupDocIds(doc.groupId, [doc.id]);
      doc.groupId = groupId;
    });

    groupStore.appendGroupDocIds(groupId, docIds);
  };

  return {
    getGroupDocs,
    getWorkspaceDocs,
    selectDoc,
    addDocs,
    reloadDoc,
    removeDocs,
    clearGroupDocs,
    moveDocs,
  };
};
