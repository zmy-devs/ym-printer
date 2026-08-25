<template>
  <section
    ref="containerRef"
    class="h-5.5 relative flex items-center gap-1.5 overflow-hidden"
  >
    <Tooltip
      :label="configuration.label"
      v-for="configuration in visibleConfigurations"
      :key="configuration.id"
    >
      <Badge variant="outline">
        <component :is="configuration.icon" :class="configuration.iconClass" />

        {{ configuration.value }}
      </Badge>
    </Tooltip>

    <HoverMenu v-if="hiddenCount > 0">
      <HoverMenuTrigger as-child>
        <Badge variant="outline" @click.stop> +{{ hiddenCount }} </Badge>
      </HoverMenuTrigger>

      <HoverMenuContent class="min-w-48">
        <HoverMenuItem
          v-for="configuration in hiddenConfigurations"
          :key="configuration.id"
          @select.prevent
        >
          <component
            :is="configuration.icon"
            :class="configuration.iconClass"
          />

          <span>
            {{ configuration.label }}
          </span>

          <DropdownMenuShortcut>
            {{ configuration.value }}
          </DropdownMenuShortcut>
        </HoverMenuItem>
      </HoverMenuContent>
    </HoverMenu>

    <div
      ref="measurementRef"
      class="h-0 absolute top-0 left-0 flex items-center gap-1.5 invisible pointer-events-none"
    >
      <Badge
        data-configuration-measure
        variant="outline"
        v-for="configuration in configurations"
        :key="configuration.id"
      >
        <component :is="configuration.icon" />

        {{ configuration.value }}
      </Badge>

      <Badge data-overflow-measure variant="outline">
        +{{ configurations.length }}
      </Badge>
    </div>
  </section>
</template>

<script setup lang="ts">
import Tooltip from '@/components/common/tooltip.vue';
import {
  HoverMenu,
  HoverMenuContent,
  HoverMenuItem,
  HoverMenuTrigger,
} from '@/components/common/hover-menu';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import { usePaper } from '@/hooks/use-paper';
import { usePrice } from '@/hooks/use-price';
import { cartridgeMap, orientationMap, printRangeModeMap } from '@/map';
import { useSettingsStore } from '@/stores/settings.store';
import { useResizeObserver } from '@vueuse/core';
import type { Doc } from '@type';
import {
  CircleDollarSignIcon,
  FilesIcon,
  FileTextIcon,
  PaletteIcon,
  RotateCwIcon,
  StickyNotesIcon,
} from '@lucide/vue';
import type { LucideIcon } from '@lucide/vue';
import { usePrintConfigStore } from '@/stores/print-config.store';

// 单项打印配置的展示数据
type PrintConfiguration = {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  iconClass?: string;
};

// 文档打印配置参数
const props = defineProps<{
  data: Doc;
}>();

// 应用计价设置
const { settings } = storeToRefs(useSettingsStore());

// 文档打印配置状态
const printConfigStore = usePrintConfigStore();

// 当前文档打印配置
const printConfig = computed(() => {
  return printConfigStore.getPrintConfig(props.data.id);
});

// 当前文档的打印价格
const price = usePrice(printConfig);

// 当前文档需要的纸张数量
const paperCount = usePaper(printConfig);

// 描述区域容器元素
const containerRef = useTemplateRef('containerRef');

// 隐藏配置宽度测量元素
const measurementRef = useTemplateRef('measurementRef');

// 当前能够完整显示的配置数量
const visibleCount = ref(Number.POSITIVE_INFINITY);

// 按展示顺序生成当前文档的打印配置
const configurations = computed<PrintConfiguration[]>(() => {
  // 根据计价设置决定是否展示价格配置
  const priceConfiguration = settings.value.price
    ? [
        {
          id: 'price',
          label: '打印价格',
          value: `${price.value} 元`,
          icon: CircleDollarSignIcon,
        },
      ]
    : [];

  return [
    ...priceConfiguration,
    {
      id: 'paper-count',
      label: '打印所需纸张数量',
      value: `${paperCount.value} 张纸`,
      icon: FilesIcon,
    },
    {
      id: 'document-count',
      label: '打印文档数量',
      value: `${printConfig.value.copies} 份`,
      icon: StickyNotesIcon,
    },
    {
      id: 'range',
      label: '打印范围',
      value: printConfig.value.pageRange
        .map(({ range, mode }) => {
          return `${range || '1-'}(${printRangeModeMap[mode]})`;
        })
        .join('，'),
      icon: FileTextIcon,
    },
    {
      id: 'cartridge',
      label: '墨盒颜色',
      value: cartridgeMap[printConfig.value.color],
      icon: PaletteIcon,
    },
    {
      id: 'orientation',
      label: '打印方向',
      value: orientationMap[printConfig.value.orientation],
      icon: RotateCwIcon,
    },
  ];
});

// 当前宽度下直接展示的打印配置
const visibleConfigurations = computed(() => {
  return configurations.value.slice(0, visibleCount.value);
});

// 当前宽度下收进悬浮菜单的打印配置
const hiddenConfigurations = computed(() => {
  return configurations.value.slice(visibleCount.value);
});

// 当前被隐藏的打印配置数量
const hiddenCount = computed(() => {
  return hiddenConfigurations.value.length;
});

// 计算一组配置徽标占用的总宽度
const getRowWidth = (widths: number[], gap: number) => {
  return widths.reduce((totalWidth, width, index) => {
    return totalWidth + width + (index === 0 ? 0 : gap);
  }, 0);
};

// 计算为折叠徽标预留空间后能够显示的配置数量
const getVisibleConfigurationCount = (
  configurationWidths: number[],
  availableWidth: number,
  gap: number,
  overflowBadgeWidth: number,
) => {
  // 第一个无法与折叠徽标同时放入容器的配置索引
  const firstHiddenIndex = configurationWidths.findIndex((_, index) => {
    // 截止当前索引需要展示的配置宽度
    const currentWidths = configurationWidths.slice(0, index + 1);

    // 当前配置和折叠徽标共同占用的宽度
    const occupiedWidth =
      getRowWidth(currentWidths, gap) + gap + overflowBadgeWidth;

    return occupiedWidth > availableWidth;
  });

  return firstHiddenIndex === -1
    ? configurationWidths.length
    : firstHiddenIndex;
};

// 根据容器和徽标的真实宽度更新配置展示数量
const handleMeasureConfigurations = () => {
  if (!containerRef.value || !measurementRef.value) {
    return;
  }

  // 所有待测量的配置徽标元素
  const configurationElements = Array.from(
    measurementRef.value.querySelectorAll<HTMLElement>(
      '[data-configuration-measure]',
    ),
  );

  // 用于显示隐藏数量的折叠徽标元素
  const overflowBadgeElement = measurementRef.value.querySelector<HTMLElement>(
    '[data-overflow-measure]',
  );

  if (!overflowBadgeElement) {
    return;
  }

  // 当前配置容器的可用宽度
  const availableWidth = containerRef.value.getBoundingClientRect().width;

  // 当前配置徽标之间的横向间距
  const gap =
    Number.parseFloat(getComputedStyle(measurementRef.value).columnGap) || 0;

  // 每个配置徽标的真实渲染宽度
  const configurationWidths = configurationElements.map((element) => {
    return element.getBoundingClientRect().width;
  });

  // 所有配置徽标直接展示时需要的总宽度
  const configurationsWidth = getRowWidth(configurationWidths, gap);

  if (configurationsWidth <= availableWidth) {
    visibleCount.value = configurations.value.length;
    return;
  }

  // 折叠徽标的真实渲染宽度
  const overflowBadgeWidth = overflowBadgeElement.getBoundingClientRect().width;

  visibleCount.value = getVisibleConfigurationCount(
    configurationWidths,
    availableWidth,
    gap,
    overflowBadgeWidth,
  );
};

// 在配置内容变化后重新测量徽标
const handleConfigurationsChange = () => {
  nextTick(handleMeasureConfigurations);
};

// 在描述区域尺寸变化后重新测量徽标
const handleResize = () => {
  handleMeasureConfigurations();
};

watch(configurations, handleConfigurationsChange, { flush: 'post' });
useResizeObserver(containerRef, handleResize);
</script>

<style scoped lang="scss"></style>
