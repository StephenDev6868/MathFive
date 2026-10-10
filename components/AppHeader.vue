<template>
  <header class="sticky top-0 z-40 w-full backdrop-blur border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white hover:opacity-90 transition">
          <div class="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <UIcon name="i-heroicons-cube-transparent" class="w-6 h-6" />
          </div>
          <span>Math<span class="text-emerald-500">Five</span></span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink
            to="/"
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
            active-class="text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            Trang chủ
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
            active-class="text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            Giới thiệu
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
            active-class="text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            Bài viết & Tin tức
          </NuxtLink>
          <NuxtLink
            to="/portal"
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition"
            active-class="text-emerald-600 dark:text-emerald-400 font-semibold"
          >
            Cổng Thành viên
          </NuxtLink>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-3">
          <CommonThemeToggle />

          <!-- Authenticated -->
          <template v-if="authStore.isAuthenticated">
            <UButton
              to="/portal"
              color="emerald"
              variant="soft"
              icon="i-heroicons-squares-2x2"
              class="hidden sm:inline-flex"
            >
              Vào Portal
            </UButton>
            <UDropdown :items="userDropdownItems" :popper="{ placement: 'bottom-end' }">
              <UAvatar
                :src="authStore.user?.avatar"
                :alt="authStore.user?.name"
                size="sm"
                class="ring-2 ring-emerald-500 cursor-pointer"
              />
            </UDropdown>
          </template>

          <!-- Guest -->
          <template v-else>
            <UButton
              to="/auth/login"
              color="gray"
              variant="ghost"
              class="hidden sm:inline-flex"
            >
              Đăng nhập
            </UButton>
            <UButton
              to="/auth/register"
              color="emerald"
              class="hidden sm:inline-flex"
            >
              Bắt đầu ngay
            </UButton>
          </template>

          <!-- Mobile Hamburger -->
          <UButton
            icon="i-heroicons-bars-3"
            color="gray"
            variant="ghost"
            class="md:hidden"
            @click="mobileMenuOpen = true"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Menu Slideover -->
    <USlideover v-model="mobileMenuOpen">
      <div class="p-6 flex flex-col h-full bg-white dark:bg-gray-900">
        <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-2 font-bold text-lg">
            <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <UIcon name="i-heroicons-cube-transparent" class="w-5 h-5" />
            </div>
            <span>Math<span class="text-emerald-500">Five</span></span>
          </div>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="mobileMenuOpen = false"
          />
        </div>

        <nav class="flex flex-col gap-4 py-6">
          <NuxtLink
            to="/"
            class="text-base font-medium py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="mobileMenuOpen = false"
          >
            Trang chủ
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-base font-medium py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="mobileMenuOpen = false"
          >
            Giới thiệu
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="text-base font-medium py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="mobileMenuOpen = false"
          >
            Bài viết & Tin tức
          </NuxtLink>
          <NuxtLink
            to="/portal"
            class="text-base font-medium py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="mobileMenuOpen = false"
          >
            Cổng Thành viên
          </NuxtLink>
        </nav>

        <div class="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3">
          <template v-if="authStore.isAuthenticated">
            <UButton to="/portal" color="emerald" block @click="mobileMenuOpen = false">
              Truy cập Portal
            </UButton>
            <UButton color="red" variant="soft" block @click="handleLogout">
              Đăng xuất
            </UButton>
          </template>
          <template v-else>
            <UButton to="/auth/login" color="gray" variant="outline" block @click="mobileMenuOpen = false">
              Đăng nhập
            </UButton>
            <UButton to="/auth/register" color="emerald" block @click="mobileMenuOpen = false">
              Đăng ký tài khoản
            </UButton>
          </template>
        </div>
      </div>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const mobileMenuOpen = ref(false)

const userDropdownItems = computed(() => [
  [
    {
      label: authStore.user?.name || 'Tài khoản',
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'Khu vực cá nhân',
      icon: 'i-heroicons-squares-2x2',
      to: '/portal'
    },
    {
      label: 'Cài đặt hồ sơ',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/portal/profile'
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

async function handleLogout() {
  mobileMenuOpen.value = false
  await authStore.logout()
}
</script>
