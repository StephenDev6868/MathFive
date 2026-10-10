<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Dịch vụ & Gói sử dụng</h1>
        <p class="text-sm text-gray-500 mt-1">Theo dõi tài nguyên hạ tầng, thời hạn và chi phí dịch vụ</p>
      </div>

      <UButton
        color="emerald"
        icon="i-heroicons-plus"
        @click="isModalOpen = true"
      >
        Đăng ký dịch vụ mới
      </UButton>
    </div>

    <!-- Filter & Search -->
    <div class="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <div class="w-full sm:w-72">
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass"
          placeholder="Tìm theo tên dịch vụ..."
          size="sm"
        />
      </div>

      <div class="text-xs text-gray-500">
        Hiển thị: <span class="font-bold text-gray-900 dark:text-white">{{ filteredServices.length }}</span> gói dịch vụ
      </div>
    </div>

    <!-- Services Table -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-gray-50 dark:bg-gray-800/50 text-xs uppercase text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="px-6 py-4">Tên dịch vụ</th>
              <th class="px-6 py-4">Gói dịch vụ</th>
              <th class="px-6 py-4">Trạng thái</th>
              <th class="px-6 py-4">Ngày gia hạn</th>
              <th class="px-6 py-4">Chi phí</th>
              <th class="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr
              v-for="item in filteredServices"
              :key="item.id"
              class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition"
            >
              <td class="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <UIcon name="i-heroicons-server" class="w-4 h-4" />
                  </div>
                  <span>{{ item.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <UBadge color="gray" variant="solid" size="xs">{{ item.plan }}</UBadge>
              </td>
              <td class="px-6 py-4">
                <UBadge color="emerald" variant="subtle" size="xs">Đang hoạt động</UBadge>
              </td>
              <td class="px-6 py-4 text-gray-500">{{ item.renewalDate }}</td>
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ item.cost }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <UButton
                    size="xs"
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-arrow-path"
                    title="Gia hạn"
                    @click="handleRenew(item.name)"
                  />
                  <UButton
                    size="xs"
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-cog-6-tooth"
                    title="Cấu hình"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Register New Service -->
    <UModal v-model="isModalOpen">
      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Đăng ký Dịch vụ Mới</h3>
          <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" @click="isModalOpen = false" />
        </div>

        <form class="space-y-4" @submit.prevent="createService">
          <UFormGroup label="Tên dịch vụ / Dự án" required>
            <UInput v-model="newService.name" placeholder="Ví dụ: App MathFive Production" />
          </UFormGroup>

          <UFormGroup label="Gói cấu hình" required>
            <USelect
              v-model="newService.plan"
              :options="['Cơ bản', 'Chuyên nghiệp', 'Doanh nghiệp']"
            />
          </UFormGroup>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <UButton color="gray" variant="ghost" @click="isModalOpen = false">Hủy</UButton>
            <UButton color="emerald" type="submit">Kích hoạt ngay</UButton>
          </div>
        </form>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ServiceItem } from '~/types'

definePageMeta({
  layout: 'portal',
  middleware: 'auth'
})

useSeoMeta({
  title: 'Quản lý Dịch vụ - Cổng Thành viên'
})

const toast = useToast()
const search = ref('')
const isModalOpen = ref(false)

const services = ref<ServiceItem[]>([
  {
    id: 'srv-1',
    name: 'Hạ tầng Cloud Hosting MathFive',
    plan: 'Chuyên nghiệp',
    status: 'active',
    renewalDate: '2025-12-31',
    cost: '450.000 ₫ / tháng'
  },
  {
    id: 'srv-2',
    name: 'Dịch vụ Email Tên miền Doanh nghiệp',
    plan: 'Cơ bản',
    status: 'active',
    renewalDate: '2025-06-15',
    cost: '120.000 ₫ / tháng'
  },
  {
    id: 'srv-3',
    name: 'Gói Giám sát APM & Báo cáo Hiệu năng',
    plan: 'Doanh nghiệp',
    status: 'active',
    renewalDate: '2025-11-20',
    cost: '890.000 ₫ / tháng'
  }
])

const newService = reactive<{
  name: string
  plan: 'Cơ bản' | 'Chuyên nghiệp' | 'Doanh nghiệp'
}>({
  name: '',
  plan: 'Chuyên nghiệp'
})

const filteredServices = computed(() => {
  if (!search.value) return services.value
  return services.value.filter(s => s.name.toLowerCase().includes(search.value.toLowerCase()))
})

function handleRenew(name: string) {
  toast.add({
    title: 'Yêu cầu gia hạn',
    description: `Đã gửi yêu cầu gia hạn cho gói "${name}".`,
    color: 'emerald'
  })
}

function createService() {
  if (!newService.name) return

  services.value.push({
    id: `srv-${Date.now()}`,
    name: newService.name,
    plan: newService.plan,
    status: 'active',
    renewalDate: '2026-01-01',
    cost: newService.plan === 'Doanh nghiệp' ? '890.000 ₫ / tháng' : '450.000 ₫ / tháng'
  })

  toast.add({
    title: 'Kích hoạt thành công',
    description: `Dịch vụ "${newService.name}" đã được thêm vào hệ thống.`,
    color: 'emerald'
  })

  newService.name = ''
  isModalOpen.value = false
}
</script>
