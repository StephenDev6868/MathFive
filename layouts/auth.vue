<template>
  <div class="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
    <div class="absolute top-6 right-6">
      <CommonThemeToggle />
    </div>

    <!-- Centered Brand -->
    <div class="mb-8 text-center">
      <NuxtLink to="/" class="inline-flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white">
        <div class="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
          <UIcon name="i-heroicons-cube-transparent" class="w-6 h-6" />
        </div>
        <span>Math<span class="text-emerald-500">Five</span></span>
      </NuxtLink>
    </div>

    <!-- Card Container -->
    <div class="w-full max-w-md">
      <slot />
    </div>

    <!-- Back to home -->
    <div class="mt-8 text-center text-xs text-gray-500">
      <NuxtLink to="/" class="hover:text-emerald-500 transition inline-flex items-center gap-1">
        <UIcon name="i-heroicons-arrow-left" class="w-3.5 h-3.5" />
        Quay lại trang chủ
      </NuxtLink>
    </div>
  </div>
</template>
