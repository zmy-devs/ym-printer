import { useStorage } from '@vueuse/core';
import { nanoid } from 'nanoid';

export interface Preset {
  id: string;
  name: string;
  value: string;
}

export const usePresetStore = defineStore('preset', () => {
  //所有预设
  const presets = useStorage<Preset[]>('preset', [
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

    presets.value.push({ ...option, id });
  };

  //删除预设
  const removePreset = (id: string) => {
    presets.value = presets.value.filter((item) => item.id != id);
  };

  //编辑预设
  const editPreset = (data: Preset) => {
    const item = getPreset(data.id);

    if (!item) {
      return;
    }

    Object.assign(item, data);
  };

  return {
    presets,
    addPreset,
    removePreset,
    editPreset,
  };
});
