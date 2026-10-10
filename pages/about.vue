<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto">
      <UBadge color="emerald" variant="subtle" size="md" class="mb-4">Về chúng tôi</UBadge>
      <h1 class="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        Sứ mệnh xây dựng giải pháp phần mềm hiện đại & tin cậy
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
        MathFive được phát triển với mục tiêu mang đến cho các nhà phát triển một nền tảng kiến trúc vững chắc, tối ưu hóa từ giao diện người dùng đến luồng xử lý dữ liệu backend.
      </p>
    </div>

    <!-- Core Values -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-emerald-500 mb-4" />
        <h3 class="text-xl font-bold mb-2">Trải nghiệm vượt trội</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Giao diện mượt mà, phản hồi ngay lập tức nhờ sức mạnh của Vue 3 và công nghệ Server-side Rendering của Nuxt 3.
        </p>
      </div>

      <div class="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-blue-500 mb-4" />
        <h3 class="text-xl font-bold mb-2">Bảo mật đa tầng</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Tuân thủ các nguyên tắc bảo mật web hiện đại: HTTP-only cookies, mã hóa token JWT và kiểm soát phiên an toàn.
        </p>
      </div>

      <div class="p-8 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <UIcon name="i-heroicons-cpu-chip" class="w-8 h-8 text-purple-500 mb-4" />
        <h3 class="text-xl font-bold mb-2">Khả năng mở rộng cao</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Cấu trúc module rõ ràng giúp dự án dễ dàng mở rộng từ một ứng dụng đơn lẻ lên thành hệ thống doanh nghiệp lớn.
        </p>
      </div>
    </div>

    <!-- Tech Stack Details -->
    <div class="p-8 sm:p-10 rounded-3xl bg-gray-900 text-white shadow-xl">
      <h2 class="text-2xl font-bold mb-6 text-center">Công nghệ cốt lõi trong dự án</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div class="p-4 rounded-xl bg-gray-800/80 border border-gray-700">
          <p class="font-bold text-lg text-emerald-400">Nuxt 3</p>
          <p class="text-xs text-gray-400 mt-1">SSR & Nitro Engine</p>
        </div>
        <div class="p-4 rounded-xl bg-gray-800/80 border border-gray-700">
          <p class="font-bold text-lg text-teal-400">Nuxt UI</p>
          <p class="text-xs text-gray-400 mt-1">Tailwind CSS + Headless UI</p>
        </div>
        <div class="p-4 rounded-xl bg-gray-800/80 border border-gray-700">
          <p class="font-bold text-lg text-amber-400">Pinia</p>
          <p class="text-xs text-gray-400 mt-1">State Management & Cookie</p>
        </div>
        <div class="p-4 rounded-xl bg-gray-800/80 border border-gray-700">
          <p class="font-bold text-lg text-blue-400">TypeScript</p>
          <p class="text-xs text-gray-400 mt-1">Strict Type Checking</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Giới thiệu về MathFive Portal',
  description: 'Tìm hiểu về sứ mệnh và hệ sinh thái công nghệ của MathFive Portal.'
})
</script>
