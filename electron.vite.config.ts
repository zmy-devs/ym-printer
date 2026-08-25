import { resolve } from 'path';
import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import { version, name, productName } from './package.json';
import AutoImport from 'unplugin-auto-import/vite';
import tailwindcss from '@tailwindcss/vite';
import { createIpcChannelsPlugin } from 'plugin-electron-ipc/vite';

const ipcOptions = {
  input: [
    'src/main/ipc/index.ts',
    'src/main/ipc/print.ipc.ts',
    'src/main/ipc/update.ipc.ts',
    'src/main/ipc/doc.ipc.ts',
  ],
  dts: 'src/renderer/plugin-electron-ipc.d.ts',
};

export default defineConfig({
  main: {
    define: {
      __APP_VERSION__: JSON.stringify(version),
      __APP_NAME__: JSON.stringify(name),
      __APP_PRODUCT_NAME__: JSON.stringify(productName),
    },
    resolve: {
      alias: {
        '@': resolve('src/main'),
        '@resources': resolve('resources'),
        '@type': resolve('src/shared/type.ts'),
        '@shared': resolve('src/shared'),
      },
    },
    plugins: [createIpcChannelsPlugin(ipcOptions)],
  },
  preload: {
    plugins: [createIpcChannelsPlugin(ipcOptions)],
  },
  renderer: {
    define: {
      __APP_VERSION__: JSON.stringify(version),
      __APP_NAME__: JSON.stringify(name),
      __APP_PRODUCT_NAME__: JSON.stringify(productName),
    },
    resolve: {
      alias: {
        '@': resolve('src/renderer/src'),
        '@type': resolve('src/shared/type.ts'),
        '@shared': resolve('src/shared'),
      },
    },

    plugins: [
      vue(),
      tailwindcss(),
      AutoImport({
        imports: ['vue', 'pinia', 'vue-router'],
        dts: 'auto-imports.d.ts',
      }),
    ],
  },
});
