import { rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { parentPort } from 'worker_threads';
import winax from 'winax';

interface SaveOption {
  inputPath: string;
  outputPath: string;
  taskId: string;
}

interface MessageOption {
  action: 'open' | 'exit' | 'save';
  params?: SaveOption;
}

// 工作线程与主线程的通信端口
const port = parentPort;

if (!port) {
  throw new Error('Word 工作线程缺少通信端口');
}

// 常驻的 Word COM 实例
let word: winax.Object | null = null;

// 获取错误的可读文本
const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : String(error);
};

// 关闭并释放 Word COM 实例
const closeWord = () => {
  if (!word) {
    return;
  }

  try {
    word.Quit();
  } catch (error) {
    console.error('退出 Word 失败:', error);
  } finally {
    word = null;
  }
};

// 预热 Word 的 PDF 导出组件，避免首个真实文档承担冷启动开销
const warmupPdfExport = () => {
  // 预热 PDF 的临时输出路径
  const outputPath = join(
    tmpdir(),
    `ym-printer-word-warmup-${process.pid}.pdf`,
  );

  // 用于激活 PDF 导出组件的空白文档
  const document = word!.Documents.Add();

  try {
    document.ExportAsFixedFormat(outputPath, 17);
  } finally {
    document.Close(false);
    rmSync(outputPath, { force: true });
  }
};

// 启动 Word 并完成一次导出预热
const openWord = () => {
  if (word) {
    return {
      launchMs: 0,
      warmupMs: 0,
    };
  }

  // 创建 COM 实例前的时间戳
  const launchStartedAt = performance.now();

  word = new winax.Object('Word.Application');
  word.Visible = false;
  word.DisplayAlerts = 0;
  word.AutomationSecurity = 3;

  // Word COM 启动耗时
  const launchMs = Math.round(performance.now() - launchStartedAt);

  // 激活 PDF 导出组件前的时间戳
  const warmupStartedAt = performance.now();
  warmupPdfExport();

  // PDF 导出组件预热耗时
  const warmupMs = Math.round(performance.now() - warmupStartedAt);

  return {
    launchMs,
    warmupMs,
  };
};

// 导出 PDF 并关闭已打开的 Word 文档
const exportPdf = (document: winax.Object, outputPath: string) => {
  try {
    // 导出 PDF 前的时间戳
    const exportStartedAt = performance.now();

    document.ExportAsFixedFormat(outputPath, 17);

    return Math.round(performance.now() - exportStartedAt);
  } finally {
    document.Close(false);
  }
};

// 执行单个 Word 到 PDF 的转换
const convertToPdf = (option: SaveOption) => {
  if (!word) {
    throw new Error('Word 尚未启动');
  }

  const { inputPath, outputPath, taskId } = option;

  // 打开源文档前的时间戳
  const openStartedAt = performance.now();
  const document = word.Documents.Open(inputPath, false, true, false);

  // Word 打开源文档耗时
  const openMs = Math.round(performance.now() - openStartedAt);

  // Word 导出 PDF 耗时
  const exportMs = exportPdf(document, outputPath);

  port.postMessage({
    type: 'success',
    data: {
      taskId,
      openMs,
      exportMs,
    },
  });
};

// 转换失败后重建 Word 并重试一次
const recoverAndConvert = (option: SaveOption) => {
  try {
    convertToPdf(option);
  } catch (firstError) {
    console.error('Word 转换失败，正在重建实例:', firstError);
    closeWord();

    try {
      openWord();
      convertToPdf(option);
    } catch (secondError) {
      port.postMessage({
        type: 'error',
        data: {
          taskId: option.taskId,
          message: getErrorMessage(secondError),
        },
      });
    }
  }
};

// 处理主线程发来的 Word 指令
const handleMessage = (option: MessageOption) => {
  switch (option.action) {
    case 'open':
      try {
        // Word 启动和预热耗时
        const timings = openWord();

        port.postMessage({
          type: 'ready',
          data: timings,
        });
      } catch (error) {
        closeWord();

        port.postMessage({
          type: 'startupError',
          data: {
            message: getErrorMessage(error),
          },
        });
      }
      return;
    case 'exit':
      closeWord();
      return;
    case 'save':
      if (!option.params) {
        return;
      }

      recoverAndConvert(option.params);
      return;
  }
};

port.on('message', handleMessage);
