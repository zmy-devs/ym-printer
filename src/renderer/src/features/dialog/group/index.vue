<template>
  <Dialog v-model:open="visible">
    <DialogContent
      as="form"
      :aria-describedby="undefined"
      @submit.prevent="handleSubmit"
      @close-auto-focus.prevent="handleClose"
    >
      <DialogHeader>
        <DialogTitle>{{ groupTitleMap[dialogType] }}</DialogTitle>
      </DialogHeader>

      <Field name="name" label="组名称" v-slot="{ componentField }">
        <Input placeholder="请输入组名称" v-bind="componentField" />
      </Field>

      <Field name="printer" label="默认打印机" v-slot="{ componentField }">
        <SelectPrinter
          class="w-full"
          variant="outline"
          :iconVisible="false"
          v-bind="componentField"
        />
      </Field>

      <DialogFooter>
        <Button type="submit">确定</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import Field from '@/components/common/field.vue';
import { Input } from '@/components/ui/input';
import SelectPrinter from '@/components/features/select-printer.vue';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from '@/components/ui/dialog';
import { eventBus } from '@/utils/event-bus';
import { useGroupService } from '@/services/group.service';
import { useForm } from 'vee-validate';
import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { groupTitleMap } from '@/map';

// 分组数据操作方法
const { createGroup, editGroup } = useGroupService();

// 分组表单弹窗开关状态
const visible = ref(false);

// 当前分组表单操作类型
const dialogType = ref<'add' | 'edit'>('add');

// 分组表单校验和提交控制器
const {
  handleSubmit: validateSubmit,
  resetForm,
  setValues,
} = useForm({
  validationSchema: toTypedSchema(
    z.object({
      id: z.string(),
      name: z.string().min(1, '请输入名称'),
      printer: z.string().min(1, '请选择打印机'),
    }),
  ),
  initialValues: {
    id: '',
    name: '',
    printer: '',
  },
});

// 关闭分组表单
const handleClose = () => {
  visible.value = false;
};

// 校验并保存分组数据
const handleSubmit = validateSubmit((values) => {
  switch (dialogType.value) {
    case 'add':
      createGroup({
        name: values.name,
        printer: values.printer,
      });
      break;
    case 'edit':
      editGroup(values);
      break;
  }

  handleClose();
});

// 响应新增分组事件
eventBus.on('dialog-group:add:show', () => {
  dialogType.value = 'add';

  resetForm();

  visible.value = true;
});

// 响应编辑分组事件
eventBus.on('dialog-group:edit:show', (value) => {
  dialogType.value = 'edit';

  setValues(value);

  visible.value = true;
});
</script>

<style scoped lang="scss"></style>
