<template>
  <div class="space-y-24 py-12 md:py-20 overflow-hidden">
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
      <!-- Background Glow Effect -->
      <div class="absolute inset-0 -top-20 flex items-center justify-center -z-10 pointer-events-none">
        <div class="w-[600px] h-[350px] bg-emerald-500/15 dark:bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-8 border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
        <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
        <span>Bộ Khung Nuxt 3 Doanh Nghiệp Chuẩn Hóa</span>
      </div>

      <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
        Khởi tạo ứng dụng & Web Portal <br class="hidden sm:inline" />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
          Tối ưu SEO và Hiệu năng
        </span>
      </h1>

      <p class="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
        Bộ source code hoàn chỉnh xây dựng trên nền tảng Nuxt 3, Nuxt UI, Tailwind CSS và Pinia. Sẵn sàng phát triển các sản phẩm phần mềm SaaS, cổng thông tin và dịch vụ thành viên.
      </p>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <UButton
          to="/portal"
          size="lg"
          color="emerald"
          icon="i-heroicons-arrow-right-circle"
          class="shadow-lg shadow-emerald-500/25"
        >
          Khám phá Cổng Portal
        </UButton>
        <UButton
          to="/blog"
          size="lg"
          color="gray"
          variant="outline"
          icon="i-heroicons-book-open"
        >
          Đọc bài viết kỹ thuật
        </UButton>
      </div>

      <!-- Hero Dashboard Preview Preview Card -->
      <div class="mt-16 max-w-5xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-gray-200 dark:from-gray-800 to-transparent shadow-2xl">
        <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 text-left">
          <div class="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-red-400" />
              <div class="w-3 h-3 rounded-full bg-yellow-400" />
              <div class="w-3 h-3 rounded-full bg-green-400" />
              <span class="text-xs text-gray-400 font-mono ml-2">mathfive.vn/portal/dashboard</span>
            </div>
            <UBadge color="emerald" variant="subtle" size="sm">Trạng thái: Sẵn sàng vận hành</UBadge>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
              <span class="text-xs text-gray-500 uppercase font-semibold">Tốc độ tải SSR</span>
              <p class="text-2xl font-bold text-emerald-500 mt-1">&lt; 150ms</p>
              <p class="text-xs text-gray-400 mt-1">Được render từ Nitro Engine</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
              <span class="text-xs text-gray-500 uppercase font-semibold">Bảo mật xác thực</span>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">JWT + Cookie Guard</p>
              <p class="text-xs text-gray-400 mt-1">Nuxt Route Middleware an toàn</p>
            </div>
            <div class="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
              <span class="text-xs text-gray-500 uppercase font-semibold">Quản lý State</span>
              <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">Pinia Reactive</p>
              <p class="text-xs text-gray-400 mt-1">Đồng bộ hoàn hảo giữa SSR & Client</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Features Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
          Tính năng được tối ưu cho Lập trình viên
        </h2>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          Mọi cấu phần đều được cấu hình tỉ mỉ theo khuyến nghị chính thức của Nuxt và Vue.js.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
            <UIcon name="i-heroicons-bolt" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Nuxt UI & Tailwind CSS</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Hơn 40+ components dựng sẵn, hỗ trợ Dark Mode tức thì, tùy chỉnh bảng màu linh hoạt qua app.config.ts.
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
            <UIcon name="i-heroicons-shield-check" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Hệ thống Phân quyền & Route Guard</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Middleware thông minh ngăn chặn truy cập trái phép, tự động lưu URL chuyển hướng và cấp quyền theo vai trò.
          </p>
        </div>

        <div class="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition">
          <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
            <UIcon name="i-heroicons-magnifying-glass-circle" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Chuẩn hóa SEO & Social Share</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Sẵn sàng thẻ OpenGraph, Twitter Card, Sitemap và thẻ Canonical động thông qua useSeoMeta() của Nuxt.
          </p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Câu hỏi thường gặp</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Giải đáp các thắc mắc phổ biến về dự án.</p>
      </div>

      <UAccordion :items="faqItems" />
    </section>

    <!-- Call to action -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
        <h2 class="text-3xl sm:text-4xl font-extrabold mb-4">
          Bắt đầu xây dựng sản phẩm của bạn ngay hôm nay
        </h2>
        <p class="max-w-xl mx-auto text-emerald-100 text-base sm:text-lg mb-8">
          Truy cập Cổng Thành viên để khám phá các dịch vụ số và cấu hình tài khoản cá nhân.
        </p>
        <UButton
          to="/portal"
          size="xl"
          color="white"
          class="text-emerald-700 hover:bg-emerald-50 font-bold px-8 shadow-md"
        >
          Truy cập Cổng Thành viên
        </UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Trang chủ - Cổng dịch vụ & Phát triển Web Nuxt 3',
  description: 'Nền tảng portal hiện đại xây dựng trên Nuxt 3, Nuxt UI, Tailwind CSS và Pinia.',
  ogTitle: 'MathFive Portal - Nền tảng Đa năng',
  ogDescription: 'Nền tảng portal hiện đại, tối ưu SEO, tích hợp quản lý thành viên, blog và dịch vụ số.'
})

const faqItems = [
  {
    label: 'Bộ source code này bao gồm những module gì?',
    content: 'Dự án bao gồm Nuxt 3, Nuxt UI (Tailwind CSS + Headless UI + Iconify), Pinia (@pinia/nuxt) để quản lý state, VueUse (@vueuse/nuxt) cho tiện ích phản ứng, và Zod để xác thực schema.'
  },
  {
    label: 'Làm thế nào để chạy thử tài khoản thành viên?',
    content: 'Bạn chỉ cần nhấn vào Cổng Thành viên hoặc Đăng nhập, hệ thống đã cung cấp nút tự động điền tài khoản mẫu demo@mathfive.com để trải nghiệm ngay lập tức.'
  },
  {
    label: 'Làm cách nào kết nối với REST API hoặc cơ sở dữ liệu thật?',
    content: 'Bạn có thể chỉnh sửa các file trong thư mục server/api/ để kết nối với cơ sở dữ liệu (Prisma, Drizzle, MongoDB) hoặc cập nhật NUXT_PUBLIC_API_BASE trong file .env để kết nối với Backend bên ngoài thông qua composable useApi().'
  }
]
</script>
