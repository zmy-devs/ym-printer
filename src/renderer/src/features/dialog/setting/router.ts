import {
  CircleAlertIcon,
  CircleArrowUpIcon,
  CircleDollarSignIcon,
  ClipboardListIcon,
  PaletteIcon,
} from '@lucide/vue';
import { Component } from 'vue';
import Appearance from './view/appearance/index.vue';
import Price from './view/price/index.vue';
import Update from './view/update/index.vue';
import About from './view/about/index.vue';
import Preset from './view/preset/index.vue';
import { appVersion } from '@shared/app-info';

export interface Route {
  id: string;
  name: string;
  description?: string;
  icon: Component;
  component: Component;
}

const router: Route[] = [
  {
    id: 'preset',
    name: '打印范围预设',
    icon: ClipboardListIcon,
    component: Preset,
  },
  {
    id: 'appearance',
    name: '外观',
    icon: PaletteIcon,
    component: Appearance,
  },
  {
    id: 'price',
    name: '价格',
    icon: CircleDollarSignIcon,
    component: Price,
  },
  {
    id: 'update',
    name: '更新',
    icon: CircleArrowUpIcon,
    component: Update,
  },
  {
    id: 'about',
    name: '关于',
    description: `v${appVersion}`,
    icon: CircleAlertIcon,
    component: About,
  },
];

//当前选中的路由的id
export const selectedRouteID = ref(router[0].id);

//选中的路由
export const selectedRoute = computed(() => {
  return router.find((r) => r.id == selectedRouteID.value);
});

//选择路由id
export const selectRouteID = (id: string) => {
  selectedRouteID.value = id;
};

export default router;
