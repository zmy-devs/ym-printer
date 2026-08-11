<template>
  <SideBar class="size-full min-h-0!">
    <SideBarItem
      v-for="route in router"
      :key="route.id"
      :is-active="selectedRouteID === route.id"
      @click="selectRouteID(route.id)"
    >
      <component :is="route.icon" />

      <span>{{ route.name }}</span>

      <span class="ml-auto text-muted-foreground">
        {{ route.description }}
      </span>
    </SideBarItem>
  </SideBar>
</template>

<script setup lang="ts">
import { SideBar, SideBarItem } from '@/components/side-bar';
import router, { selectedRouteID, selectRouteID } from '../router';
</script>

<style scoped lang="scss"></style>
