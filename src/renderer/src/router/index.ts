import { createRouter, createWebHashHistory } from 'vue-router';
import Workspace from '@/views/workspace/index.vue';
import InitialSetup from '@/views/initial-setup/index.vue';
import Tip from '@/views/tip/index.vue';
import WordNotInstalled from '@/views/tip/word-not-installed.vue';
import { hasPendingInitialSetup } from '@/views/initial-setup/steps';

// 应用路由控制器
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/setup',
      component: InitialSetup,
    },
    {
      path: '/tip',
      component: Tip,
      children: [
        {
          path: 'word-not-installed',
          component: WordNotInstalled,
        },
      ],
    },
    {
      path: '/',
      component: Workspace,
    },
  ],
});

// 根据 Word 安装与必需配置状态约束页面访问
router.beforeEach(async (to) => {
  // 当前系统是否已安装可用的 Word
  const isWordInstalled = await ipc.checkWordInstalled();

  if (!isWordInstalled) {
    return to.path === '/tip/word-not-installed'
      ? true
      : '/tip/word-not-installed';
  }

  // 当前是否仍需完成首次配置
  const needsInitialSetup = hasPendingInitialSetup();

  if (to.path === '/tip/word-not-installed') {
    return needsInitialSetup ? '/setup' : '/';
  }

  if (needsInitialSetup && to.path !== '/setup') {
    return '/setup';
  }

  if (!needsInitialSetup && to.path === '/setup') {
    return '/';
  }

  return true;
});

export default router;
