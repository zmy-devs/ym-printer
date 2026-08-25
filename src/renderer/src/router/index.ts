import { createRouter, createWebHashHistory } from 'vue-router';
import Doc from '@/views/doc/index.vue';
import Layout from '@/layout/index.vue';
import InitialSetup from '@/features/initial-setup/index.vue';
import { hasPendingInitialSetup } from '@/features/initial-setup/steps';

// 应用路由控制器
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/setup',
      name: 'initial-setup',
      component: InitialSetup,
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '',
          redirect: { name: 'documents' },
        },
        {
          path: 'doc',
          name: 'documents',
          component: Doc,
        },
      ],
    },
  ],
});

// 根据必需配置状态约束页面访问
router.beforeEach((to) => {
  // 当前是否仍需完成首次配置
  const needsInitialSetup = hasPendingInitialSetup();

  if (needsInitialSetup && to.name !== 'initial-setup') {
    return { name: 'initial-setup' };
  }

  if (!needsInitialSetup && to.name === 'initial-setup') {
    return { name: 'documents' };
  }

  return true;
});

export default router;
