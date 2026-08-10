<template>
  <FormField v-slot="{ componentField }" name="range">
    <FormItem>
      <FormLabel>打印范围</FormLabel>

      <FormControl>
        <InputGroup class="bg-transparent!">
          <InputGroupInput
            placeholder="格式 1,1-,-10,-"
            v-bind="componentField"
          />

          <InputGroupAddon align="inline-end">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <InputGroupButton variant="ghost" size="icon-xs">
                  <ClipboardListIcon class="text-foreground" />
                </InputGroupButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent class="min-w-60" side="right">
                <DropdownMenuLabel v-if="presets.length == 0">
                  暂无预设
                </DropdownMenuLabel>

                <DropdownMenuItem
                  v-for="item of presets"
                  :key="item.id"
                  @click="componentField['onUpdate:modelValue']!(item.value)"
                >
                  <span>
                    {{ item.name }}
                  </span>

                  <span class="text-muted-foreground">{{ item.value }}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </InputGroupAddon>
        </InputGroup>
      </FormControl>

      <FormMessage />
    </FormItem>
  </FormField>
</template>

<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ClipboardListIcon } from '@lucide/vue';
import { usePresetStore } from '@/stores/preset';

const { presets } = storeToRefs(usePresetStore());
</script>

<style scoped lang="scss"></style>
