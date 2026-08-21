import { useStorage } from '@vueuse/core';
import { storagePre } from '@shared/app-info';
import MessageBox from '@/components/message-box';
import { useSettingsStore } from '@/stores/settings.store';
import { isOverOneDay } from '@/utils/date';
import { showErrorToast } from '@/utils/toast';

// 更新任务状态类型
type Status =
  | 'init'
  | 'checking'
  | 'update-not-available'
  | 'downloading'
  | 'downloaded'
  | 'error';

// 当前更新任务状态
export const status = ref<Status>('init');

// 上次自动检查更新的时间
const lastUpdateTime = useStorage(`${storagePre}:lastUpdateTime`, 0);

// 检测到的最新版本号
export const latestVersion = ref('');

// 更新包下载进度
export const downloadProgress = ref(0);

// 是否已初始化更新服务
const isInitialized = ref(false);

// 安装已下载的更新
export const installUpdate = async () => {
  status.value = 'downloaded';

  // 安装确认结果
  const shouldInstall = await MessageBox.confirm({
    title: '安装新版本',
    description: '新版本下载完成,是否安装?',
  });

  if (!shouldInstall) {
    return;
  }

  await ipc.installUpdate();
};

// 检查并下载可用更新
export const checkUpdate = async () => {
  try {
    status.value = 'checking';

    // 更新检查结果
    const latestVersionResult = await ipc.checkUpdate();

    if (!latestVersionResult) {
      status.value = 'update-not-available';
      return;
    }

    latestVersion.value = latestVersionResult;
    status.value = 'downloading';
  } catch (error) {
    showErrorToast('更新失败,请检查网络');
    status.value = 'init';
    console.error(error);
  }
};

// 初始化更新任务及 IPC 监听
export const initializeUpdateService = () => {
  if (isInitialized.value) {
    return;
  }

  // 设置状态仓库
  const settingsStore = useSettingsStore();

  isInitialized.value = true;

  ipc.on('download-progress', (_, percent: number) => {
    downloadProgress.value = Math.floor(percent);
  });

  ipc.on('update-downloaded', installUpdate);

  if (!settingsStore.settings.autoUpdate) {
    return;
  }

  // 当前检查更新的时间
  const now = Date.now();

  if (!isOverOneDay(lastUpdateTime.value, now)) {
    return;
  }

  checkUpdate();
  lastUpdateTime.value = now;
};
