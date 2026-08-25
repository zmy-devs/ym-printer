<template>
  <Tooltip label="返回">
    <Button
      variant="ghost"
      size="icon-xs"
      :disabled="!canGoBack"
      @click="goBack"
    >
      <ArrowLeftIcon />
    </Button>
  </Tooltip>

  <Tooltip label="前进">
    <Button
      variant="ghost"
      size="icon-xs"
      :disabled="!canGoForward"
      @click="goForward"
    >
      <ArrowRightIcon />
    </Button>
  </Tooltip>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, ArrowRightIcon } from '@lucide/vue';
import Tooltip from '@/components/common/tooltip.vue';
import { Button } from '@/components/ui/button';

const router = useRouter();
const route = useRoute();

const canGoBack = ref(false);
const canGoForward = ref(false);

// 后退逻辑
const goBack = () => {
  router.back();
};

// 前进逻辑
const goForward = () => {
  router.forward();
};

watch(
  () => route.path,
  () => {
    const currentState = window.history.state;

    const currentPosition = currentState.position;
    const totalLength = window.history.length;

    canGoBack.value = currentPosition > 0;

    canGoForward.value = totalLength > currentPosition + 1;
  },
  { immediate: true },
);
</script>

<style scoped lang="scss"></style>
