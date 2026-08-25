<template>
  <section
    class="dark w-70 max-w-[calc(100%-1.5rem)] p-4 absolute bottom-3 left-3 z-20 flex gap-3 rounded-lg border bg-background text-foreground shadow-lg"
    v-if="visible"
  >
    <PartyPopperIcon class="mt-1 size-5 shrink-0 text-zinc-100" />

    <div class="min-w-0 flex flex-col flex-1">
      <span class="text-sm font-semibold">Ym Printer 新版本现已上线！</span>

      <span class="mt-1 text-xs text-muted-foreground">
        {{ latestVersion }} 已下载，安装后将重新启动应用。
      </span>

      <footer class="mt-4 flex items-center justify-end gap-2">
        <Button variant="ghost" size="xs" @click="handleRemindLater">
          稍后提醒我
        </Button>

        <Button variant="outline" size="xs" @click="installUpdate">
          现在安装
        </Button>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PartyPopperIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
  installUpdate,
  latestVersion,
  status,
} from '@/services/update.service';

// 更新提示的显示状态
const visible = ref(false);

// 处理稍后提醒操作
const handleRemindLater = () => {
  visible.value = false;
};

// 下载完成后恢复更新提示
watch(status, (currentStatus) => {
  if (currentStatus !== 'downloaded') {
    return;
  }

  visible.value = true;
});
</script>

<style scoped lang="scss"></style>
