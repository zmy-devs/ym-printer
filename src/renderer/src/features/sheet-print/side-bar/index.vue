<template>
  <fieldset :disabled="isPrinting" class="pt-3 pb-1 relative flex flex-col">
    <PrintConfig />

    <footer class="w-full absolute left-0 bottom-0 px-3 pb-2">
      <ButtonGroup class="w-full">
        <Button class="flex-1 border-r" @click="handlePrint">
          {{ isPrinting ? '正在打印' : '开始打印' }}
        </Button>

        <Button class="flex-1 border-r" @click="handlePrePrint">
          预备打印
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button size="icon">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center" class="w-52">
            <DropdownMenuItem @click="handlePrintFinish">
              <CheckIcon />

              <span>标记为打印完成</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              :disabled="!isSimplex"
              @click="handlePrintSimplex"
            >
              <PrinterIcon />

              <span>打印 "单页"</span>
            </DropdownMenuItem>

            <DropdownMenuItem :disabled="isSimplex" @click="handlePrintEven">
              <PrinterIcon />

              <span>打印 "偶数页"</span>
            </DropdownMenuItem>

            <DropdownMenuItem :disabled="isSimplex" @click="handlePrintOdd">
              <PrinterIcon />

              <span>打印 "奇数页"</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </footer>
  </fieldset>
</template>

<script setup lang="ts">
import PrintConfig from './print-config/index.vue';
import { CheckIcon, MoreHorizontalIcon, PrinterIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useDocStore } from '@/stores/doc';
import { printAuto, printEven, printOdd } from '@/utils/print';
import { eventBus } from '@/utils/event-bus';
import { close, Form } from '../index';
import { parserRange } from '@/utils/range';
import { printPromise } from '@/stores/print';

const { selectedDoc, selectedDocID } = storeToRefs(useDocStore());
const { getDoc } = useDocStore();

const form: Form = inject('form')!;

//是否再打印
const isPrinting = ref(false);

//是否是单打
const isSimplex = computed(() => form.values.mode == 'simplex');

//打印
const handlePrint = form.handleSubmit(async (values) => {
  //关闭弹窗
  close();

  const doc = getDoc(selectedDocID.value)!;

  Object.assign(doc, values);

  doc.formatRange = parserRange(selectedDoc.value);

  doc.status = 'printing';

  await printAuto(toRaw(doc), {
    printFinish() {
      doc.status = 'printed';

      eventBus.emit('success:show', `打印完成 "${doc.name}"`);
    },
    printCancel() {
      doc.status = 'init';

      eventBus.emit('error:show', `取消打印 "${doc.name}"`);
    },
    printBefore() {
      doc.status = 'upload';
    },
    printAfter() {
      doc.status = 'printing';
    },
  });
});

//预备打印
const handlePrePrint = form.handleSubmit(async (values) => {
  //关闭弹窗
  close();

  const doc = getDoc(selectedDocID.value)!;

  Object.assign(doc, values);

  doc.formatRange = parserRange(selectedDoc.value);

  doc.status = 'prepare';

  const result = await printPromise(doc);

  if (!result) {
    doc.status = 'init';

    eventBus.emit('error:show', `取消打印 "${doc.name}"`);
    return;
  }

  await printAuto(toRaw(doc), {
    printFinish() {
      doc.status = 'printed';

      eventBus.emit('success:show', `打印完成 "${doc.name}"`);
    },
    printCancel() {
      doc.status = 'init';

      eventBus.emit('error:show', `取消打印 "${doc.name}"`);
    },
    printBefore() {
      doc.status = 'upload';
    },
    printAfter() {
      doc.status = 'printing';
    },
  });
});

//标记为已完成
const handlePrintFinish = form.handleSubmit(async (values) => {
  //关闭弹窗
  close();

  const doc = getDoc(selectedDocID.value)!;

  Object.assign(doc, values);

  doc.formatRange = parserRange(selectedDoc.value);

  doc.status = 'printed';

  eventBus.emit('success:show', `打印完成 "${doc.name}"`);
});

//打印单页
const handlePrintSimplex = form.handleSubmit(async (values) => {
  const doc = { ...toRaw(getDoc(selectedDocID.value)!) };

  Object.assign(doc, values);

  isPrinting.value = true;

  eventBus.emit('loading:show', {
    loadingMsg: '正在打印单页',
    successMsg: `打印单页完成 "${doc.name}"`,
    errorMsg: '打印单页失败',
    async cb() {
      await printOdd(doc);
    },
  });

  isPrinting.value = false;
});

//打印偶数页
const handlePrintEven = form.handleSubmit(async (values) => {
  const doc = { ...toRaw(getDoc(selectedDocID.value)!) };

  Object.assign(doc, values);

  isPrinting.value = true;

  eventBus.emit('loading:show', {
    loadingMsg: '正在打印偶数页',
    successMsg: `打印偶数页完成 "${doc.name}"`,
    errorMsg: '打印偶数页失败',
    async cb() {
      await printEven(doc);
    },
  });

  isPrinting.value = false;
});

//打印奇数页
const handlePrintOdd = form.handleSubmit(async (values) => {
  const doc = { ...toRaw(getDoc(selectedDocID.value)!) };

  Object.assign(doc, values);

  isPrinting.value = true;

  eventBus.emit('loading:show', {
    loadingMsg: '正在打印奇数页',
    successMsg: `打印奇数页完成 "${doc.name}"`,
    errorMsg: '打印奇数页失败',
    async cb() {
      await printOdd(doc);
    },
  });

  isPrinting.value = false;
});
</script>

<style scoped lang="scss">
footer {
  background: linear-gradient(to top, var(--sidebar) 10%, transparent);
}
</style>
