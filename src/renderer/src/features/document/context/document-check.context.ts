import type { InjectionKey } from 'vue';
import { useCheck } from '@/hooks/use-check';

// 文档勾选上下文数据类型
type DocumentCheckContext = ReturnType<typeof useCheck>;

// 文档勾选上下文标识
const documentCheckContextKey: InjectionKey<DocumentCheckContext> = Symbol(
  'DocumentCheckContext',
);

// 创建并提供文档勾选上下文
export const provideDocumentCheckContext = () => {
  // 当前功能范围共享的文档勾选状态
  const context = useCheck();

  provide(documentCheckContextKey, context);

  return context;
};

// 获取上层提供的文档勾选上下文
export const useDocumentCheckContext = () => {
  // 当前组件所在功能范围的文档勾选状态
  const context = inject(documentCheckContextKey);

  if (!context) {
    throw new Error('文档勾选组件必须在文档勾选上下文中使用');
  }

  return context;
};
