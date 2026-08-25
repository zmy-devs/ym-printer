//主题
export type Theme = 'light' | 'dark';

// 分组信息
export interface Group {
  id: string;
  name: string;
  printer: string;
}

// 单项打印范围的打印方式
export type PrintRangeMode = 'simplex' | 'duplex';

// 双面打印的执行方式
export type DuplexMode = 'auto' | 'manual';

// 当前打印任务需要输出的纸张面
export type PrintPhase = 'all' | 'front' | 'back';

// 系统打印机及其驱动能力
export type Printer = {
  // 系统打印机名称
  name: string;

  // 是否支持由驱动自动完成双面打印
  canDuplex: boolean;
};

// 单项打印范围配置
export interface PrintRange {
  // 页码范围表达式
  range: string;

  // 当前范围的打印方式
  mode: PrintRangeMode;
}

//打印配置
export type PrintConfig = {
  //备注
  remark: string;

  //打印机id
  printer: string;

  //打印数量
  copies: number;

  //打印范围
  pageRange: PrintRange[];

  //墨盒类型
  color: 'black' | 'color';

  //方向
  orientation: 'portrait' | 'landscape';

  // 双面范围使用的执行方式
  duplexMode: DuplexMode;

  // 解析后的完整打印页码序列
  pageNumbers: number[];
};

// 文档源文件处理状态
export type DocStatus = 'loading' | 'ready' | 'error';

// 打印流程状态
export type PrintStatus =
  | 'idle'
  | 'preparing'
  | 'queued'
  | 'uploading'
  | 'waiting'
  | 'completed'
  | 'failed';

// 文档对应的打印运行状态
export type PrintState = {
  // 当前打印流程状态
  status: PrintStatus;

  // 尚未开始的队列任务标识
  queueId?: string;
};

// 队列中的一次不可变上传任务
export type PrintQueue = {
  // 队列任务唯一标识
  id: string;

  // 所属文档标识
  docId: string;

  // 入队时冻结的打印配置
  config: PrintConfig;

  // 当前任务需要输出的纸张面
  phase: PrintPhase;

  // 任务开始上传时调用
  start?: () => void;

  // 上传成功时调用
  end?: () => void;

  // 上传失败时调用
  error?: (error: unknown) => void;
};

//文档信息
export type Doc = {
  //状态
  status: DocStatus;

  //所属分组标识
  groupId: string;
  //唯一标识
  id: string;

  //文件名
  name: string;

  //文件路径
  path: string;

  //md5
  md5: string;

  //拓展名
  ext: string;

  //页数
  pageCount: number;
};

//打印任务
export interface PrinterTask {
  // 系统打印任务标识
  id: number;

  // 文件名
  name: string;

  // 文件后缀
  ext: string;

  // 打印状态
  status: string[];
}
