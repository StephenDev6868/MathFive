<template>
  <aside class="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col shrink-0 h-screen sticky top-0">
    <!-- Brand / Header -->
    <div class="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800 gap-3">
      <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-sm">
        <UIcon name="i-heroicons-cube-transparent" class="w-5 h-5" />
      </div>
      <div>
        <span class="font-bold text-gray-900 dark:text-white">Math<span class="text-emerald-500">Five</span></span>
        <span class="ml-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
          Portal
        </span>
      </div>
    </div>

    <!-- Navigation links -->
    <div class="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
      <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 uppercase tracking-wider mb-2">
        Không gian làm việc
      </div>

      <NuxtLink
        to="/portal"
        exact
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition group"
        :class="isActiveRoute('/portal') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        <UIcon name="i-heroicons-chart-pie" class="w-5 h-5 shrink-0" />
        <span>Tổng quan</span>
      </NuxtLink>

      <NuxtLink
        to="/portal/services"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition group"
        :class="isActiveRoute('/portal/services') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        <UIcon name="i-heroicons-server-stack" class="w-5 h-5 shrink-0" />
        <span>Dịch vụ & Gói dùng</span>
        <UBadge color="emerald" variant="subtle" size="xs" class="ml-auto">3</UBadge>
      </NuxtLink>

      <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 uppercase tracking-wider mt-6 mb-2">
        Tài khoản & Thiết lập
      </div>

      <NuxtLink
        to="/portal/profile"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition group"
        :class="isActiveRoute('/portal/profile') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'"
      >
        <UIcon name="i-heroicons-user-circle" class="w-5 h-5 shrink-0" />
        <span>Hồ sơ & Bảo mật</span>
      </NuxtLink>

      <NuxtLink
        to="/blog"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <UIcon name="i-heroicons-newspaper" class="w-5 h-5 shrink-0" />
        <span>Tin tức & Blog</span>
      </NuxtLink>
    </div>

    <!-- Bottom User Bar -->
    <div class="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-xs text-gray-500 hover:text-emerald-500 transition px-2 py-1"
      >
        <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4" />
        <span>Về trang chủ công khai</span>
      </NuxtLink>

      <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/80">
        <div class="flex items-center gap-2.5 min-w-0">
          <UAvatar
            :src="authStore.user?.avatar"
            :alt="authStore.user?.name"
            size="sm"
            class="shrink-0"
          />
          <div class="min-w-0">
            <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {{ authStore.user?.name || 'Thành viên' }}
            </p>
            <p class="text-[11px] text-gray-400 truncate">
              {{ authStore.user?.email || 'user@mathfive.com' }}
            </p>
          </div>
        </div>

        <UButton
          icon="i-heroicons-arrow-left-on-rectangle"
          color="gray"
          variant="ghost"
          size="xs"
          title="Đăng xuất"
          @click="authStore.logout"
        />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
const authStore = useAuthStore()

function isActiveRoute(path: string) {
  if (path === '/portal') {
    return route.path === '/portal'
  }
  return route.path.startsWith(path)
}
</script>
