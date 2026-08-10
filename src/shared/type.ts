//主题
export type Theme = 'light' | 'dark';

//文档信息
export type Doc = {
  //状态
  status:
    | 'loading'
    | 'error'
    | 'init'
    | 'prepare'
    | 'upload'
    | 'printing'
    | 'printed';

  //组合id
  groupId: string;

  //工作空间id
  workspaceId: string;

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

  //备注
  remark: string;

  //打印机id
  printer: string;

  //打印数量
  count: number;

  //模式
  mode: 'simplex' | 'duplex' | 'mix' | 'mixConnect' | '';

  //范围
  range: string;

  //墨盒类型
  cartridge: 'black' | 'color' | '';

  //方向
  orientation: 'portrait' | 'landscape' | '';

  //格式化范围
  formatRange?: number[];
};

//打印任务
export interface PrinterTask {
  id: number;
  name: string;
  status: string[];
}
