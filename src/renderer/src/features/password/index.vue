<template>
  <Dialog v-model:open="visible">
    <DialogContent
      class="w-100 place-items-center gap-6!"
      as="form"
      @close-auto-focus.prevent="handleClose"
      @submit.prevent="handleConfirm"
      :show-close-button="false"
    >
      <DialogHeader class="w-[256px] items-center gap-4">
        <LockIcon class="size-8 text-muted-foreground" />

        <DialogTitle class="text-center">{{ title }}</DialogTitle>

        <DialogDescription class="text-center">
          设置 6 位数字密码。<br />
          密码为选填项
        </DialogDescription>
      </DialogHeader>

      <InputOTP
        inputmode="numeric"
        :maxlength="6"
        pattern="^[0-9]*$"
        v-model="password"
      >
        <InputOTPGroup v-for="index in 6" :key="index">
          <InputOTPSlot :index="index - 1" />
        </InputOTPGroup>
      </InputOTP>

      <p v-if="errorMessage" class="text-sm text-destructive">
        {{ errorMessage }}
      </p>

      <DialogFooter class="w-[256px] flex flex-col!">
        <Button type="submit" :disabled="isSubmitting"> 确定 </Button>

        <Button variant="outline" @click="handleClose"> 取消 </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { LockIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// 密码弹窗可见状态
const visible = ref(false);
// 当前输入的六位数字密码
const password = ref('');
// 弹窗提交状态
const isSubmitting = ref(false);
// 当前错误提示文本
const errorMessage = ref('');

// 密码弹窗标题
const title = '工作空间密码';

// 关闭并重置密码弹窗
const handleClose = () => {
  visible.value = false;
  password.value = '';
  errorMessage.value = '';
};

// 校验并提交密码输入
const handleConfirm = () => {
  if (password.value && password.value.length !== 6) {
    errorMessage.value = '密码需要输入 6 位数字';
    return;
  }

  handleClose();
};
</script>

<style scoped lang="scss"></style>
