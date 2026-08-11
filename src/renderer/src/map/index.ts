import { appName } from '@shared/app-info';

export const modeMap = {
  simplex: '单面打印',
  duplex: '双面打印',
  mix: '混合打印',
  mixConnect: '混合打印(范围连接)',
};

// 打印模式的简短说明
export const modeDescriptionMap: Record<keyof typeof modeMap, string> = {
  simplex: '全部单面打印',
  duplex: '全部双面打印',
  mix: '单页单面，范围双面',
  mixConnect: '单页单面，范围双面，相邻的范围自动连接',
};

export const cartridgeMap = {
  black: '黑白',
  color: '彩色',
};

export const orientationMap = {
  portrait: '纵向',
  landscape: '横向',
};

export const printStatusMap = {
  Printing: '打印中',
  Paused: '已暂停',
  Spooling: '正在发送到打印机',
  Deleting: '正在删除',
  Error: '错误',
  Offline: '脱机',
  PaperOut: '缺纸',
  Printed: '已打印',
  Retained: '已保留',
  Restarted: '已重新启动',
  UserIntervention: '需要用户干预',
  Blocked: '被阻止',
  Completed: '已完成',
};

export const issueUrl = `https://github.com/zmy-devs/${appName}/issues`;

export const updateContentUrl = `https://github.com/zmy-devs/${appName}/blob/main/docs/release-note.md`;

export const updateMap = {
  checking: '正在检查更新...',
  'update-not-available': '已是最新版',
  downloading: (value: number | string) => `下载中: ${value}%`,
};

export const viewMap = {
  raw: '原始文档',
  preview: '预览结果',
};

export const baseThemeMap = {
  dark: '深色',
  light: '浅色',
};

export const previewThemeMap = {
  dark: '深色',
  light: '浅色',
  auto: '跟随基础主题',
};

export const presetTitleMap = {
  add: '新建预设',
  edit: '编辑预设',
};

// 预设表单操作说明
export const presetDescriptionMap = {
  add: '创建一个新的打印范围预设',
  edit: '修改当前打印范围预设',
};

// 工作空间表单标题
export const workspaceTitleMap = {
  add: '新建工作空间',
  edit: '编辑工作空间',
};

// 工作空间表单操作说明
export const workspaceDescriptionMap = {
  add: '创建一个新的工作空间',
  edit: '修改当前工作空间',
};
