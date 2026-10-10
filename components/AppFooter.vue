<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 py-12 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Col 1: Brand Info -->
        <div class="space-y-4 md:col-span-1">
          <div class="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white">
            <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow">
              <UIcon name="i-heroicons-cube-transparent" class="w-5 h-5" />
            </div>
            <span>Math<span class="text-emerald-500">Five</span></span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Nền tảng công nghệ toàn diện cho phát triển ứng dụng Web, Portal dịch vụ và giải pháp số hiện đại.
          </p>
          <div class="flex items-center gap-3 text-gray-400">
            <UButton icon="i-simple-icons-github" color="gray" variant="ghost" size="xs" aria-label="Github" />
            <UButton icon="i-simple-icons-x" color="gray" variant="ghost" size="xs" aria-label="X" />
            <UButton icon="i-simple-icons-facebook" color="gray" variant="ghost" size="xs" aria-label="Facebook" />
            <UButton icon="i-simple-icons-linkedin" color="gray" variant="ghost" size="xs" aria-label="LinkedIn" />
          </div>
        </div>

        <!-- Col 2: Navigation -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Điều hướng
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink to="/" class="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition">
                Trang chủ
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition">
                Về chúng tôi
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/blog" class="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition">
                Bài viết & Chia sẻ
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/portal" class="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition">
                Cổng thành viên
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Col 3: Giải pháp -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Giải pháp số
          </h3>
          <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li class="hover:text-emerald-500 cursor-pointer">Cổng Portal Doanh nghiệp</li>
            <li class="hover:text-emerald-500 cursor-pointer">Kiến trúc Micro-frontend & SSR</li>
            <li class="hover:text-emerald-500 cursor-pointer">Bảo mật xác thực OAuth2 / JWT</li>
            <li class="hover:text-emerald-500 cursor-pointer">Tối ưu tốc độ Web Vitals</li>
          </ul>
        </div>

        <!-- Col 4: Newsletter -->
        <div>
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
            Đăng ký nhận tin
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Nhận thông báo cập nhật tính năng mới và các bài viết kỹ thuật hàng tuần.
          </p>
          <div class="flex gap-2">
            <UInput v-model="newsletterEmail" placeholder="email@cuaban.com" size="sm" class="flex-1" />
            <UButton color="emerald" size="sm" @click="handleSubscribe">Đăng ký</UButton>
          </div>
        </div>
      </div>

      <div class="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-4">
        <p>© 2025 MathFive Ecosystem. Bản quyền thuộc về MathFive.</p>
        <div class="flex gap-4">
          <span class="hover:underline cursor-pointer">Điều khoản sử dụng</span>
          <span class="hover:underline cursor-pointer">Chính sách bảo mật</span>
          <span class="hover:underline cursor-pointer">Bảo mật dữ liệu</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const toast = useToast()
const newsletterEmail = ref('')

function handleSubscribe() {
  if (!newsletterEmail.value || !newsletterEmail.value.includes('@')) {
    toast.add({
      title: 'Email không hợp lệ',
      description: 'Vui lòng nhập địa chỉ email hợp lệ để nhận tin.',
      color: 'red'
    })
    return
  }

  toast.add({
    title: 'Đăng ký thành công!',
    description: 'Cảm ơn bạn đã đăng ký nhận bản tin từ MathFive.',
    color: 'emerald'
  })
  newsletterEmail.value = ''
}
</script>
