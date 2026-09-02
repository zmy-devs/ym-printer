// 当前勾选的文档标识
export const checked = ref(new Set<string>());

// 当前是否处于文档选择模式
export const isChecking = computed(() => {
  return checked.value.size > 0;
});

// 切换指定文档的勾选状态
export const toggleCheck = (id: string) => {
  if (checked.value.has(id)) {
    checked.value.delete(id);
    return;
  }

  checked.value.add(id);
};

// 勾选指定文档集合
export const checkAll = (ids: string[]) => {
  for (const id of ids) {
    checked.value.add(id);
  }
};

// 取消指定文档集合的勾选
export const cancelCheck = (ids: string[]) => {
  for (const id of ids) {
    checked.value.delete(id);
  }
};

// 取消全部文档的勾选
export const cancelCheckAll = () => {
  checked.value.clear();
};
