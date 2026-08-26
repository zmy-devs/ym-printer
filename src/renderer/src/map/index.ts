import { appName } from '@shared/app-info';
import type { DocStatus, PrintRangeMode, PrintStatus } from '@type';

// 打印范围内页码的打印方式
export const printRangeModeMap: Record<PrintRangeMode, string> = {
  simplex: '单面',
  duplex: '双面',
};

export const cartridgeMap = {
  black: '黑白',
  color: '彩色',
};

export const orientationMap = {
  portrait: '纵向',
  landscape: '横向',
};

// 文档状态对应的展示文案
export const docStatusMap: Record<DocStatus, string> = {
  loading: '正在加载文档',
  error: '文档加载失败，请检查文档',
  ready: '等待打印配置',
};

// 文档状态对应的状态点样式
export const docStatusVariantMap: Record<
  DocStatus,
  'success' | 'warn' | 'error'
> = {
  loading: 'warn',
  error: 'error',
  ready: 'warn',
};

// 打印流程状态对应的展示文案
export const printStatusMap: Record<PrintStatus, string> = {
  idle: '等待打印配置',
  preparing: '准备就绪',
  queued: '等待上传打印',
  uploading: '正在上传打印',
  waiting: '等待继续打印',
  completed: '打印完成',
  failed: '打印失败',
};

// 打印流程状态对应的状态点样式
export const printStatusVariantMap: Record<
  PrintStatus,
  'success' | 'warn' | 'error'
> = {
  idle: 'warn',
  preparing: 'success',
  queued: 'warn',
  uploading: 'success',
  waiting: 'warn',
  completed: 'success',
  failed: 'error',
};

export const printerTaskStatusMap = {
  Printing: '打印中',
  Paused: '已暂停',
  Spooling: '正在发送',
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
  auto: '跟随系统',
};

export const previewThemeMap = {
  dark: '深色',
  light: '浅色',
  auto: '跟随基础主题',
};

// 主题色标识对应的展示信息
export const themeColorMap = {
  default: { label: '默认', color: 'var(--theme-color-default)' },
  blue: { label: '蓝色', color: 'var(--color-blue-600)' },
  green: { label: '绿色', color: 'var(--color-green-600)' },
  yellow: { label: '黄色', color: 'var(--color-yellow-500)' },
  orange: { label: '橙色', color: 'var(--color-orange-600)' },
  pink: { label: '粉色', color: 'var(--color-pink-600)' },
  purple: { label: '紫色', color: 'var(--color-purple-600)' },
};

// 主题色标识类型
export type ThemeColor = keyof typeof themeColorMap;

// 分组表单标题
export const groupTitleMap = {
  add: '新建组',
  edit: '编辑组',
};

export const presetTitleMap = {
  add: '新建预设',
  edit: '编辑预设',
};

// 工作空间表单标题
export const workspaceTitleMap = {
  edit: '编辑工作空间',
};
