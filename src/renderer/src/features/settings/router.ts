import {
  CircleAlertIcon,
  CircleArrowUpIcon,
  CircleDollarSignIcon,
  UsersRoundIcon,
  PaletteIcon,
} from '@lucide/vue';
import type { Component } from 'vue';
import Appearance from './view/appearance.vue';
import Price from './view/price.vue';
import Update from './view/update.vue';
import About from './view/about.vue';
import Team from './view/team.vue';
import { appVersion } from '@shared/app-info';

export interface Route {
  id: string;
  name: string;
  description?: string;
  icon: Component;
  component: Component;
}

// 设置页导航配置
const router: Route[] = [
  {
    id: 'team',
    name: '团队协作',
    icon: UsersRoundIcon,
    component: Team,
  },
  {
    id: 'price',
    name: '价格',
    icon: CircleDollarSignIcon,
    component: Price,
  },
  {
    id: 'appearance',
    name: '外观',
    icon: PaletteIcon,
    component: Appearance,
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

// 当前选中的设置路由标识
export const selectedRouteID = ref(router[0].id);

// 当前选中的设置路由
export const selectedRoute = computed(() => {
  return router.find((route) => route.id === selectedRouteID.value);
});

// 切换设置路由
export const selectRouteID = (id: string) => {
  selectedRouteID.value = id;
};

export default router;
