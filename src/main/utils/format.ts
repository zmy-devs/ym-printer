import { extname } from 'path';

interface RawPrinterTask {
  ID: number;
  DocumentName: string;
  JobStatus: string;
}

// 将系统打印任务转换为应用内任务数据
export const formatPrinterTask = (rawTask: RawPrinterTask) => {
  // 从任务文件名提取与文档一致的后缀
  const ext = extname(rawTask.DocumentName).slice(1);

  return {
    id: rawTask.ID,
    name: rawTask.DocumentName,
    ext,
    status: rawTask.JobStatus.split(',').map((s) => s.trim()),
  };
};
