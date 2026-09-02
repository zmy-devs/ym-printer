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

    //工作空间唯一标识
    workspaceId: nanoid(),

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
    // 保留当前工作空间身份的默认设置
    const defaultSettings = createSettings();
    defaultSettings.workspaceId = settings.value.workspaceId;
    defaultSettings.workspaceName = settings.value.workspaceName;
    settings.value = defaultSettings;
  };

  return {
    settings,
    resetSettings,
  };
});
