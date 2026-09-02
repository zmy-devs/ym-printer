<template>
  <section class="p-2 flex items-center gap-2">
    <Button
      class="flex-1"
      size="sm"
      :disabled="disabledControls.includes('start-print')"
      @click="disabledControls.includes('start-print') || handleStartPrint()"
    >
      开始打印
    </Button>

    <Button
      class="flex-1"
      size="sm"
      variant="outline"
      :disabled="disabledControls.includes('prepare-print')"
      @click="
        disabledControls.includes('prepare-print') || handlePreparePrint()
      "
    >
      预备打印
    </Button>

    <DropdownMenu>
      <DropdownMenuTrigger
        as-child
        :disabled="disabledControls.includes('more-print')"
      >
        <Button size="icon-sm" variant="outline">
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="min-w-52">
        <DropdownMenuItem @click="handleCompletePrint">
          <CheckIcon />

          <span>标记为打印完成</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <Tooltip
          label="打印范围必须全是单面"
          side="right"
          :disabled="isSimplex"
        >
          <DropdownMenuItem :disabled="!isSimplex" @click="handleRecoveryAll">
            <PrinterIcon />

            <span>打印全部</span>
          </DropdownMenuItem>
        </Tooltip>

        <Tooltip
          label="打印范围不能全是单面"
          side="right"
          :disabled="!isSimplex"
        >
          <DropdownMenuItem :disabled="isSimplex" @click="handleRecoveryBack">
            <PrinterIcon />

            <span>打印背面</span>
          </DropdownMenuItem>
        </Tooltip>

        <Tooltip
          label="打印范围不能全是单面"
          side="right"
          :disabled="!isSimplex"
        >
          <DropdownMenuItem :disabled="isSimplex" @click="handleRecoveryFront">
            <PrinterIcon />

            <span>打印正面</span>
          </DropdownMenuItem>
        </Tooltip>
      </DropdownMenuContent>
    </DropdownMenu>
  </section>
</template>

<script setup lang="ts">
import { CheckIcon, MoreHorizontalIcon, PrinterIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSelectionStore } from '@/stores/selection.store';
import { usePrintService } from '@/services/print.service';
import { showLoadingToast } from '@/utils/toast';
import { type PrintConfigValues, useSheetPrintContext } from '../context';
import { Doc, PrintConfig } from '@type';
import Tooltip from '@/components/common/tooltip.vue';

// 当前选中的待打印文档
const { selectedDoc } = storeToRefs(useSelectionStore());

// 打印流程编排能力
const printService = usePrintService();

// 打印 Sheet 共享上下文
const { form, pageNumbers, closeSheetPrint, disabledControls } =
  useSheetPrintContext();

// 根据当前表单配置创建可入队的完整打印配置
const createPrintConfig = (config: PrintConfigValues) => {
  return { ...config, pageNumbers: [...pageNumbers.value] };
};

// 当前范围是否完全使用单面打印
const isSimplex = computed(() => {
  if (!form.meta.value.valid) {
    return false;
  }

  return form.values.pageRange.every(({ mode }) => {
    return mode === 'simplex';
  });
});

const toPrint = (
  cb: (doc: Doc, config: PrintConfig) => void,
  isClose: boolean = true,
) => {
  return form.handleSubmit((values) => {
    // 当前需要开始打印的文档
    const doc = selectedDoc.value;

    if (!doc) {
      return;
    }

    // 当前表单对应的完整打印配置
    const config = createPrintConfig(values);

    cb(doc, config);

    isClose && closeSheetPrint();
  });
};

// 保存配置并直接加入普通打印队列
const handleStartPrint = toPrint(printService.startPrint);

// 保存配置并进入预备打印状态
const handlePreparePrint = toPrint(printService.preparePrint);

// 保存配置并直接标记当前文档完成
const handleCompletePrint = toPrint(printService.completePrint);

// 按当前表单配置加入全部打印补救任务
const handleRecoveryAll = toPrint((doc, config) => {
  showLoadingToast({
    loadingMsg: '正在打印单页',
    successMsg: `打印单页完成 “${doc.name}”`,
    errorMsg: '打印单页失败',
    cb: () => {
      return printService.addRecoveryPrint(doc, config, 'all');
    },
  });
}, false);

// 按当前表单配置加入背面补救任务
const handleRecoveryBack = toPrint((doc, config) => {
  showLoadingToast({
    loadingMsg: '正在打印偶数页',
    successMsg: `打印偶数页完成 “${doc.name}”`,
    errorMsg: '打印偶数页失败',
    cb: () => {
      return printService.addRecoveryPrint(doc, config, 'back');
    },
  });
}, false);

// 按当前表单配置加入正面补救任务
const handleRecoveryFront = toPrint((doc, config) => {
  showLoadingToast({
    loadingMsg: '正在打印奇数页',
    successMsg: `打印奇数页完成 “${doc.name}”`,
    errorMsg: '打印奇数页失败',
    cb: () => {
      return printService.addRecoveryPrint(doc, config, 'front');
    },
  });
}, false);
</script>

<style scoped lang="scss"></style>
