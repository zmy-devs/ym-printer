import { createRouter, createWebHashHistory } from 'vue-router';
import Workspace from '@/views/workspace/index.vue';
import InitialSetup from '@/views/initial-setup/index.vue';
import WordNotInstalled from '@/views/word-not-installed.vue';
import { hasPendingInitialSetup } from '@/views/initial-setup/steps';

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
      path: '/word-not-installed',
      name: 'word-not-installed',
      component: WordNotInstalled,
    },
    {
      path: '/',
      name: 'documents',
      component: Workspace,
    },
  ],
});

// 根据 Word 安装与必需配置状态约束页面访问
router.beforeEach(async (to) => {
  // 当前系统是否已安装可用的 Word
  const isWordInstalled = await ipc.checkWordInstalled();

  if (!isWordInstalled) {
    return to.name === 'word-not-installed'
      ? true
      : { name: 'word-not-installed' };
  }

  // 当前是否仍需完成首次配置
  const needsInitialSetup = hasPendingInitialSetup();

  if (to.name === 'word-not-installed') {
    return { name: needsInitialSetup ? 'initial-setup' : 'documents' };
  }

  if (needsInitialSetup && to.name !== 'initial-setup') {
    return { name: 'initial-setup' };
  }

  if (!needsInitialSetup && to.name === 'initial-setup') {
    return { name: 'documents' };
  }

  return true;
});

export default router;
