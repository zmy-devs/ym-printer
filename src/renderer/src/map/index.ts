import { appName } from '@shared/app-info';

export const modeMap = {
  simplex: '单打',
  duplex: '双打',
  mix: '混合',
  mixConnect: '混合(范围连接)',
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
  raw: '原始',
  preview: '预览',
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

export const presetTypeMap = {
  add: '新建预设',
  edit: '编辑预设',
};

export const workspaceTypeMap = {
  add: '新建工作空间',
  edit: '编辑工作空间',
};
