import { useStorage } from '@vueuse/core';
import { nanoid } from 'nanoid';
import { storagePre } from '@shared/app-info';

export interface Preset {
  id: string;
  name: string;
  value: string;
}

export const usePresetStore = defineStore('preset', () => {
  //所有预设
  const presets = useStorage<Preset[]>(`${storagePre}:preset`, [
    {
      id: nanoid(),
      name: '封面单，其他双',
      value: '1,2-',
    },
  ]);

  //获取预设
  const getPreset = (id: string) => {
    return presets.value.find((item) => item.id == id);
  };
  //添加预设
  const addPreset = (option: Omit<Preset, 'id'>) => {
    const id = nanoid();

    presets.value.push({
      id,
      name: option.name,
      value: option.value,
    });
  };

  //删除预设
  const removePreset = (id: string) => {
    // 待删除预设的位置
    const index = presets.value.findIndex((item) => item.id == id);

    if (index !== -1) {
      presets.value.splice(index, 1);
    }
  };

  //编辑预设
  const editPreset = (data: Preset) => {
    const item = getPreset(data.id);

    if (!item) {
      return;
    }

    item.name = data.name;
    item.value = data.value;
  };

  return {
    presets,
    addPreset,
    removePreset,
    editPreset,
  };
});
