import { eventBus } from '@/utils/event-bus';
import { Doc } from '@type';
import { isSupportedDocument } from '@shared/document';
import { useWorkspaceStore } from './workspace';
import { nanoid } from 'nanoid';

export const useDocStore = defineStore('doc', () => {
  const { selectedWorkspaceID } = storeToRefs(useWorkspaceStore());

  //所有文件
  const docs = ref<Doc[]>([]);

  //当前选中的文件id
  const selectedDocID = ref('');

  //当前选中的文件
  const selectedDoc = computed<Doc>(() => {
    return (
      getDoc(selectedDocID.value) || {
        status: 'init',
        workspaceId: '',
        groupId: '',
        id: '',
        name: '',
        path: '',
        md5: '',
        ext: '',
        pageCount: 0,
        remark: '',
        printer: '',
        count: 0,
        mode: '',
        range: '',
        cartridge: '',
        orientation: '',
      }
    );
  });

  //获取文档
  const getDoc = (id: string) => {
    return docs.value.find((item) => item.id == id);
  };

  //选中文件
  const selectDoc = (id: string) => {
    selectedDocID.value = id;
  };

  //删除文件
  const removeDoc = (ids: string | string[]) => {
    ids = Array.isArray(ids) ? ids : [ids];

    docs.value = docs.value.filter((doc) => !ids.includes(doc.id));
  };

  //添加文件
  const addDoc = (files: File[]) => {
    // 仅保留支持导入的拖拽或粘贴文件
    const documentFiles = files.filter((file) => {
      return isSupportedDocument(file.name);
    });

    // 在预加载上下文中转换有效文件的原生路径
    const paths = documentFiles
      .map((file) => {
        return api.getFilePath(file);
      })
      .filter((path) => {
        return path !== '';
      });

    if (paths.length == 0) {
      return;
    }

    ipc.addDoc({
      workspaceId: selectedWorkspaceID.value,
      paths,
    });
  };

  //清空
  const clearDoc = (workspaceId: string) => {
    docs.value = docs.value.filter((doc) => doc.workspaceId !== workspaceId);
  };

  //设置工作空间id
  const setDocWorkspaceId = (ids: string | string[], workspaceId: string) => {
    ids = Array.isArray(ids) ? ids : [ids];

    docs.value.forEach((doc) => {
      if (!ids.includes(doc.id)) {
        return;
      }

      doc.workspaceId = workspaceId;
    });
  };

  //设置分组id
  const setDocGroupId = (
    ids: string | string[],
    groupId: string = nanoid(),
  ) => {
    ids = Array.isArray(ids) ? ids : [ids];

    docs.value.forEach((doc) => {
      if (!ids.includes(doc.id)) {
        return;
      }

      doc.groupId = groupId;
    });
  };

  //文件获取完成
  ipc.on('addDocFinish', (_, data: Doc[]) => {
    const paths = docs.value.map((item) => item.path);

    for (const item of data) {
      if (paths.includes(item.path)) {
        eventBus.emit('error:show', `${item.name} 已存在`);
        continue;
      }

      docs.value.push(item);

      const doc = getDoc(item.id)!;

      ipc
        .parserDoc(item)
        .then(() => {
          doc.status = 'init';
        })
        .catch(() => {
          doc.status = 'error';
        });
    }
  });

  return {
    docs,
    selectedDocID,
    selectedDoc,
    addDoc,
    clearDoc,
    removeDoc,
    selectDoc,
    getDoc,
    setDocWorkspaceId,
    setDocGroupId,
  };
});
