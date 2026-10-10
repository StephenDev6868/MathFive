<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
    <!-- Desktop Sidebar -->
    <div class="hidden lg:block shrink-0">
      <PortalSidebar />
    </div>

    <!-- Mobile Slideover Sidebar -->
    <USlideover v-model="mobileSidebarOpen" side="left">
      <div class="h-full bg-white dark:bg-gray-900 flex flex-col">
        <PortalSidebar class="h-full w-full border-r-0" />
      </div>
    </USlideover>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <PortalHeader @toggle-mobile-sidebar="mobileSidebarOpen = true" />
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const mobileSidebarOpen = ref(false)
const route = useRoute()

// Close mobile sidebar on route change
watch(() => route.path, () => {
  mobileSidebarOpen.value = false
})
</script>
