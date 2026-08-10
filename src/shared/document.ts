// 支持导入的文档扩展名
export const supportedDocumentExtensions = ['doc', 'docx', 'pdf', 'wps'];

// 判断文件名或文件路径是否为支持的文档
export const isSupportedDocument = (name: string) => {
  // 从文件名或路径中提取并规范化扩展名
  const extension = name.split('.').at(-1)?.toLowerCase();

  if (!extension) {
    return false;
  }

  return supportedDocumentExtensions.includes(extension);
};
