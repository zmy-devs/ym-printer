import { nanoid } from 'nanoid';
import { useStorage } from '@vueuse/core';
import { storagePre } from '@shared/app-info';

// 创建设置默认值
const createSettings = () => {
  return {
    //计价模式开关
    price: true,

    //单面价格
    blackSimplexPrice: 0.2,

    //双面价格
    blackDuplexPrice: 0.25,

    //单面价格
    colorSimplexPrice: 0.3,

    //双面价格
    colorDuplexPrice: 0.35,

    //自动更新
    autoUpdate: false,

    //团队协作客户端标识
    clientId: nanoid(),

    //团队协作工作空间名称
    workspaceName: '',
  };
};

export const useSettingsStore = defineStore('settings', () => {
  const settings = useStorage(
    `${storagePre}:settings`,
    createSettings(),
    localStorage,
    {
      mergeDefaults: true,
    },
  );

  //重置
  const resetSettings = () => {
    settings.value = createSettings();
  };

  return {
    settings,
    resetSettings,
  };
});
