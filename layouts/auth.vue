<template>
  <div class="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
    <!-- Centered Brand -->
    <div class="mb-8 text-center">
      <NuxtLink to="/" class="inline-flex items-center gap-2 font-bold text-2xl text-gray-900 dark:text-white">
        <img src="/math5/decorations/book-badge.svg" alt="" class="w-12 h-12" />
        <span>Học cùng bạn <span class="text-emerald-500">Miu</span></span>
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
