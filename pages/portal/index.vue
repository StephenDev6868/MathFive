<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <div class="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h1 class="text-2xl sm:text-3xl font-bold">
            Xin chào, {{ authStore.user?.name || 'Thành viên' }}! 👋
          </h1>
          <UBadge color="white" variant="solid" size="xs" class="text-emerald-800 font-bold uppercase">
            {{ authStore.user?.role || 'member' }}
          </UBadge>
        </div>
        <p class="text-emerald-100 text-sm">
          Chào mừng bạn quay lại hệ thống quản lý dịch vụ MathFive. Tất cả hệ thống đang hoạt động ổn định.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <UButton
          to="/portal/services"
          color="white"
          class="text-emerald-800 font-semibold shadow-sm"
          icon="i-heroicons-plus"
        >
          Quản lý dịch vụ
        </UButton>
      </div>
    </div>

    <!-- Metric Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dự án hoạt động</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats?.activeProjects || 0 }}</p>
          <p class="text-xs text-emerald-500 font-medium mt-1 flex items-center gap-1">
            <UIcon name="i-heroicons-arrow-trending-up" class="w-3.5 h-3.5" />
            +2 dự án tháng này
          </p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <UIcon name="i-heroicons-folder-open" class="w-6 h-6" />
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dung lượng lưu trữ</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats?.storageUsed || '0 GB' }}</p>
          <p class="text-xs text-gray-400 mt-1">Đã dùng 21% tổng dung lượng</p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <UIcon name="i-heroicons-circle-stack" class="w-6 h-6" />
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Yêu cầu hỗ trợ</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats?.supportTickets || 0 }}</p>
          <p class="text-xs text-amber-500 font-medium mt-1">Đang được xử lý</p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <UIcon name="i-heroicons-ticket" class="w-6 h-6" />
        </div>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Số dư tài khoản</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats?.accountBalance || '0 ₫' }}</p>
          <p class="text-xs text-emerald-500 font-medium mt-1">Sẵn sàng sử dụng</p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
          <UIcon name="i-heroicons-banknotes" class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Activities & Quick Services -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Activities -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
          <h2 class="font-bold text-gray-900 dark:text-white text-base">Nhật ký hoạt động gần đây</h2>
          <span class="text-xs text-gray-500">Thời gian thực</span>
        </div>

        <div class="space-y-4">
          <div
            v-for="act in activities"
            :key="act.id"
            class="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 transition"
          >
            <div class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
              <UIcon :name="act.icon" class="w-5 h-5" :class="act.color" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ act.action }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ act.timestamp }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Card -->
      <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-5">
        <h2 class="font-bold text-gray-900 dark:text-white text-base pb-3 border-b border-gray-100 dark:border-gray-800">
          Thao tác nhanh
        </h2>

        <div class="space-y-3">
          <UButton
            to="/portal/services"
            color="gray"
            variant="solid"
            block
            icon="i-heroicons-server-stack"
            class="justify-start py-2.5"
          >
            Xem danh sách Dịch vụ đang chạy
          </UButton>

          <UButton
            to="/portal/profile"
            color="gray"
            variant="solid"
            block
            icon="i-heroicons-key"
            class="justify-start py-2.5"
          >
            Đổi mật khẩu & Khóa bảo mật
          </UButton>

          <UButton
            to="/blog"
            color="gray"
            variant="solid"
            block
            icon="i-heroicons-book-open"
            class="justify-start py-2.5"
          >
            Xem tài liệu hướng dẫn kỹ thuật
          </UButton>

          <div class="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 mt-4">
            <h4 class="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Cần sự hỗ trợ kỹ thuật?</h4>
            <p class="text-xs text-emerald-700/80 dark:text-emerald-400 mt-1">Đội ngũ kỹ thuật MathFive luôn sẵn sàng hỗ trợ bạn 24/7 qua cổng ticket.</p>
            <UButton size="xs" color="emerald" class="mt-3">Gửi yêu cầu hỗ trợ</UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PortalStats, ActivityItem, ServiceItem } from '~/types'

definePageMeta({
  layout: 'portal',
  middleware: 'auth'
})

useSeoMeta({
  title: 'Bảng điều khiển - Cổng Thành viên',
  description: 'Trung tâm quản lý dịch vụ và ứng dụng của thành viên MathFive.'
})

const authStore = useAuthStore()

const { data } = await useFetch<{
  stats: PortalStats
  activities: ActivityItem[]
  services: ServiceItem[]
}>('/api/portal/stats')

const stats = computed(() => data.value?.stats)
const activities = computed(() => data.value?.activities || [])
</script>
