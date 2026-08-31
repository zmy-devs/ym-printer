<template>
  <section class="size-5 flex-center rounded-full" :class="info.class">
    <span class="font-bold text-white">{{ info.label }}</span>
  </section>
</template>

<script setup lang="ts">
// 文件图标显示参数
const props = withDefaults(
  defineProps<{
    ext?: string;
  }>(),
  {
    ext: 'pdf',
  },
);

// 文档扩展名对应的圆形标识
const map = {
  pdf: {
    label: 'P',
    class: 'bg-red-600 text-xs',
  },
  wps: {
    label: 'W',
    class: 'bg-red-600 text-[10px]',
  },
  doc: {
    label: 'W',
    class: 'bg-blue-600 text-[10px]',
  },
  docx: {
    label: 'W',
    class: 'bg-blue-600 text-[10px]',
  },
};

// 当前文档类型的图标信息
const info = computed(() => {
  return map[props.ext as keyof typeof map] ?? map.pdf;
});
</script>

<style scoped lang="scss"></style>
