<template>
  <SidebarProvider class="size-full min-h-0!">
    <Sidebar class="w-full" collapsible="none">
      <SidebarContent>
        <SidebarGroup class="pt-0.5 px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem v-for="route in router" :key="route.id">
                <SidebarMenuButton
                  :is-active="selectedRouteID === route.id"
                  @click="handleSelectRoute(route.id)"
                >
                  <component :is="route.icon" />

                  <span>{{ route.name }}</span>

                  <span class="ml-auto text-muted-foreground">
                    {{ route.description }}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
</template>

<script setup lang="ts">
import router, { selectedRouteID, selectRouteID } from '../router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';

// 切换当前设置页面
const handleSelectRoute = (id: string) => {
  selectRouteID(id);
};
</script>

<style scoped lang="scss"></style>
