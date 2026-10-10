<template>
  <header class="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
    <div class="flex items-center gap-3">
      <!-- Mobile menu trigger -->
      <UButton
        icon="i-heroicons-bars-3"
        color="gray"
        variant="ghost"
        class="lg:hidden"
        @click="$emit('toggle-mobile-sidebar')"
      />

      <!-- Page / Breadcrumb title -->
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <span class="font-medium text-gray-900 dark:text-white">{{ currentTitle }}</span>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Search Bar -->
      <div class="hidden sm:block w-48 md:w-64">
        <UInput
          icon="i-heroicons-magnifying-glass"
          placeholder="Tìm kiếm nhanh..."
          size="sm"
          color="gray"
        />
      </div>

      <!-- Notifications Dropdown -->
      <UPopover>
        <UButton
          icon="i-heroicons-bell"
          color="gray"
          variant="ghost"
          size="sm"
          class="relative"
        >
          <span class="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </UButton>

        <template #panel>
          <div class="w-80 p-4 space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <span class="font-semibold text-xs uppercase tracking-wide text-gray-700 dark:text-gray-300">Thông báo mới</span>
              <span class="text-[11px] text-emerald-500 hover:underline cursor-pointer">Đánh dấu đã đọc</span>
            </div>
            <div class="space-y-2 text-xs">
              <div class="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <p class="font-medium text-gray-900 dark:text-gray-100">Dịch vụ Portal vừa được cập nhật</p>
                <p class="text-gray-500 text-[11px] mt-0.5">Hệ thống đã nâng cấp phiên bản Nuxt 3.15 mới nhất.</p>
              </div>
              <div class="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <p class="font-medium text-gray-900 dark:text-gray-100">Bảo mật tài khoản</p>
                <p class="text-gray-500 text-[11px] mt-0.5">Phiên đăng nhập hiện tại đã được kích hoạt thành công.</p>
              </div>
            </div>
          </div>
        </template>
      </UPopover>

      <!-- Theme Switcher -->
      <CommonThemeToggle />

      <!-- User Menu -->
      <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-end' }">
        <UAvatar
          :src="authStore.user?.avatar"
          :alt="authStore.user?.name"
          size="sm"
          class="cursor-pointer ring-2 ring-transparent hover:ring-emerald-500 transition"
        />
      </UDropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  'toggle-mobile-sidebar': []
}>()

const route = useRoute()
const authStore = useAuthStore()

const currentTitle = computed(() => {
  if (route.path === '/portal') return 'Bảng điều khiển'
  if (route.path === '/portal/services') return 'Dịch vụ & Gói dùng'
  if (route.path === '/portal/profile') return 'Thông tin cá nhân & Bảo mật'
  return 'Cổng Thành viên'
})

const dropdownItems = computed(() => [
  [
    {
      label: authStore.user?.name || 'Tài khoản',
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'Cài đặt hồ sơ',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/portal/profile'
    },
    {
      label: 'Xem trang chủ',
      icon: 'i-heroicons-home',
      to: '/'
    }
  ],
  [
    {
      label: 'Đăng xuất',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: () => authStore.logout()
    }
  ]
])
</script>
