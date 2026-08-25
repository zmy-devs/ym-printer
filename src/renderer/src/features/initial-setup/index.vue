<template>
  <section
    class="wh-screen grid grid-rows-[40px_minmax(0,1fr)] bg-sidebar dark:bg-background"
  >
    <header class="app-drag"></header>

    <main class="min-h-0 grid place-items-center">
      <form
        class="w-[80vw] h-[70vh] flex overflow-hidden rounded-2xl border bg-background shadow-xl dark:border-none dark:bg-sidebar"
        @submit.prevent="handleContinue"
        v-if="currentStep"
      >
        <section class="w-1/2 flex items-center justify-center">
          <component
            :is="currentStep.icon"
            class="size-1/2 text-muted-foreground"
          />
        </section>

        <section class="w-1/2 flex flex-col pt-20 pr-10 pb-10">
          <header>
            <h1 class="mb-4 text-2xl font-semibold">
              {{ currentStep.title }}
            </h1>

            <p class="mb-[10%] text-muted-foreground">
              {{ currentStep.description }}
            </p>
          </header>

          <component :is="currentStep.component" />

          <footer class="mt-auto flex justify-end gap-4">
            <Button
              class="w-25"
              type="button"
              variant="ghost"
              @click="goToPreviousStep"
              v-if="!isFirstStep"
            >
              上一步
            </Button>

            <Button class="w-25" type="submit">
              {{ isLastStep ? '完成' : '下一步' }}
            </Button>
          </footer>
        </section>
      </form>
    </main>
  </section>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useGroupService } from '@/services/group.service';
import { useSettingsStore } from '@/stores/settings.store';
import { getInitialSetupSteps } from './steps';
import type { InitialSetupValues } from './steps';

// 页面路由控制器
const router = useRouter();
// 应用设置状态
const settingsStore = useSettingsStore();
// 首个分组创建能力
const { createGroup } = useGroupService();
// 本次首次配置步骤
const steps = getInitialSetupSteps();
// 当前步骤索引
const currentStepIndex = ref(0);

// 首次配置表单数据和字段校验能力
const { values, validateField } = useForm<InitialSetupValues>({
  validationSchema: toTypedSchema(
    z.object({
      workspaceName: z
        .string({ message: '请输入工作空间名称' })
        .trim()
        .min(1, '请输入工作空间名称')
        .max(65, '工作空间名称最多 65 个字符'),
      groupName: z
        .string({ message: '请输入名称' })
        .trim()
        .min(1, '请输入名称'),
      groupPrinter: z
        .string({ message: '请选择打印机' })
        .min(1, '请选择打印机'),
    }),
  ),
  initialValues: {
    workspaceName: '',
    groupName: '默认组',
    groupPrinter: '',
  },
  keepValuesOnUnmount: true,
});

// 当前展示的首次配置步骤
const currentStep = computed(() => {
  return steps[currentStepIndex.value];
});

// 当前是否为第一步
const isFirstStep = computed(() => {
  return currentStepIndex.value === 0;
});

// 当前是否为最后一步
const isLastStep = computed(() => {
  return currentStepIndex.value === steps.length - 1;
});

// 校验当前步骤声明的全部字段
const validateCurrentStep = async () => {
  if (!currentStep.value) {
    return false;
  }

  // 当前步骤各字段的校验结果
  const results = await Promise.all(
    currentStep.value.fields.map((field) => {
      return validateField(field);
    }),
  );

  return results.every((result) => {
    return result.valid;
  });
};

// 返回上一个首次配置步骤
const goToPreviousStep = () => {
  if (isFirstStep.value) {
    return;
  }

  currentStepIndex.value -= 1;
};

// 保存全部首次配置数据
const handleComplete = async () => {
  // 本次是否需要保存工作空间名称
  const shouldSaveWorkspaceName = steps.some((step) => {
    return step.id === 'workspace-name';
  });
  // 本次是否需要创建首个分组
  const shouldCreateFirstGroup = steps.some((step) => {
    return step.id === 'first-group';
  });

  if (shouldSaveWorkspaceName) {
    settingsStore.settings.workspaceName = values.workspaceName.trim();
  }

  if (shouldCreateFirstGroup) {
    createGroup({
      name: values.groupName.trim(),
      printer: values.groupPrinter,
    });
  }

  await router.replace({ name: 'documents' });
};

// 校验当前步骤并继续或完成首次配置
const handleContinue = async () => {
  // 当前步骤是否校验通过
  const isCurrentStepValid = await validateCurrentStep();

  if (!isCurrentStepValid) {
    return;
  }

  if (isLastStep.value) {
    await handleComplete();
    return;
  }

  currentStepIndex.value += 1;
};
</script>

<style scoped lang="scss"></style>
