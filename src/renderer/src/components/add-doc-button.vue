<template>
  <Button @click="addDocs()">
    <PlusIcon />

    <span>新增文档</span>
  </Button>
</template>

<script setup lang="ts">
import { PlusIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { useDocumentService } from '@/services/document.service';

const { addDocs } = useDocumentService();
</script>

<style scoped lang="scss"></style>
