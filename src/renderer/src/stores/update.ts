import { useSettingsStore } from '@/stores/settings';
import { eventBus } from '@/utils/event-bus';
import MessageBox from '@/components/message-box';
import { useStorage } from '@vueuse/core';
import { isOverOneDay } from '@/utils/date';

type Status =
  | 'init'
  | 'checking'
  | 'update-not-available'
  | 'downloading'
  | 'downloaded'
  | 'error';

export const useUpdateStore = defineStore('update', () => {
  const { settings } = storeToRefs(useSettingsStore());

  //状态
  const status = ref<Status>('init');

  //上次更新时间
  const lastUpdateTime = useStorage('lastUpdateTime', 0);

  //最新版本
  const latestVersion = ref('');

  //下载进度
  const downloadProgress = ref(0);

  //安装更新
  const installUpdate = async () => {
    status.value = 'downloaded';

    //安装
    const res = await MessageBox.confirm({
      title: '安装新版本',
      description: '新版本下载完成,是否安装?',
    });

    //不安装
    if (!res) {
      return;
    }

    await ipc.installUpdate();
  };

  //检查更新
  const checkUpdate = async () => {
    try {
      status.value = 'checking';

      //更新地址
      const checkRes = await ipc.checkUpdate();

      //没有更新
      if (checkRes == false) {
        status.value = 'update-not-available';
        return;
      }

      latestVersion.value = checkRes;

      status.value = 'downloading';
    } catch (e) {
      eventBus.emit('error:show', '更新失败,请检查网络');

      status.value = 'init';

      console.error(e);
    }
  };

  //初始化
  const init = () => {
    if (settings.value.autoUpdate) {
      const now = Date.now();

      if (isOverOneDay(lastUpdateTime.value, now)) {
        checkUpdate();
        lastUpdateTime.value = now;
      }
    }
  };

  //监听下载进度
  ipc.on('download-progress', (_, percent: number) => {
    downloadProgress.value = Math.floor(percent);
  });

  ipc.on('update-downloaded', installUpdate);

  init();

  return {
    status,
    downloadProgress,
    latestVersion,
    checkUpdate,
    installUpdate,
  };
});
