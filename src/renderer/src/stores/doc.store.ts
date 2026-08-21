import type { Doc } from '@type';

// 文档标识到实体的扁平映射
type DocMap = Record<string, Doc>;

export const useDocStore = defineStore('doc', () => {
  // 当前会话内的全部文档实体
  const docs = ref<DocMap>({});

  // 根据标识获取文档
  const getDoc = (docId: string) => {
    return docs.value[docId];
  };

  // 根据有序标识获取文档列表
  const getDocs = (docIds: string[] = []) => {
    return docIds.flatMap((docId) => {
      // 有效的文档实体
      const doc = getDoc(docId);

      return doc ? [doc] : [];
    });
  };

  // 新增或覆盖文档实体
  const addDocs = (items: Doc[]) => {
    items.forEach((doc) => {
      docs.value[doc.id] = doc;
    });
  };

  // 删除文档实体
  const removeDocs = (docIds: string[]) => {
    docIds.forEach((docId) => {
      delete docs.value[docId];
    });
  };

  return {
    docs,
    getDoc,
    getDocs,
    addDocs,
    removeDocs,
  };
});
