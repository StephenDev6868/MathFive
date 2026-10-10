<template>
  <div class="space-y-8 max-w-4xl">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Cài đặt Hồ sơ & Bảo mật</h1>
      <p class="text-sm text-gray-500 mt-1">Quản lý thông tin cá nhân và thiết lập tài khoản của bạn</p>
    </div>

    <!-- Personal Info Card -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
        Thông tin cá nhân
      </h2>

      <div class="flex items-center gap-6">
        <UAvatar
          :src="authStore.user?.avatar"
          :alt="authStore.user?.name"
          size="xl"
          class="ring-4 ring-emerald-500/20"
        />
        <div>
          <h3 class="font-bold text-gray-900 dark:text-white">{{ authStore.user?.name }}</h3>
          <p class="text-xs text-gray-500">{{ authStore.user?.email }}</p>
          <div class="mt-2 flex gap-2">
            <UButton size="xs" color="gray" variant="outline">Đổi ảnh đại diện</UButton>
          </div>
        </div>
      </div>

      <form class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" @submit.prevent="updateProfile">
        <UFormGroup label="Họ và tên">
          <UInput v-model="profileForm.name" />
        </UFormGroup>

        <UFormGroup label="Địa chỉ Email">
          <UInput v-model="profileForm.email" disabled />
        </UFormGroup>

        <UFormGroup label="Công ty / Tổ chức">
          <UInput v-model="profileForm.company" />
        </UFormGroup>

        <UFormGroup label="Vai trò">
          <UInput :model-value="authStore.user?.role" disabled />
        </UFormGroup>

        <UFormGroup label="Tiểu sử tóm tắt" class="sm:col-span-2">
          <UTextarea v-model="profileForm.bio" :rows="3" />
        </UFormGroup>

        <div class="sm:col-span-2 flex justify-end">
          <UButton color="emerald" type="submit">Lưu thay đổi</UButton>
        </div>
      </form>
    </div>

    <!-- Password / Security Card -->
    <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm space-y-6">
      <h2 class="text-lg font-bold text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
        Bảo mật & Đổi mật khẩu
      </h2>

      <form class="space-y-4 max-w-lg" @submit.prevent="updatePassword">
        <UFormGroup label="Mật khẩu hiện tại">
          <UInput v-model="passwordForm.current" type="password" />
        </UFormGroup>

        <UFormGroup label="Mật khẩu mới">
          <UInput v-model="passwordForm.newPassword" type="password" />
        </UFormGroup>

        <UFormGroup label="Xác nhận mật khẩu mới">
          <UInput v-model="passwordForm.confirmPassword" type="password" />
        </UFormGroup>

        <div>
          <UButton color="gray" type="submit">Cập nhật mật khẩu</UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'portal',
  middleware: 'auth'
})

useSeoMeta({
  title: 'Hồ sơ cá nhân - MathFive Portal'
})

const authStore = useAuthStore()
const toast = useToast()

const profileForm = reactive({
  name: authStore.user?.name || '',
  email: authStore.user?.email || '',
  company: authStore.user?.company || '',
  bio: authStore.user?.bio || ''
})

const passwordForm = reactive({
  current: '',
  newPassword: '',
  confirmPassword: ''
})

function updateProfile() {
  authStore.updateProfile({
    name: profileForm.name,
    company: profileForm.company,
    bio: profileForm.bio
  })

  toast.add({
    title: 'Cập nhật thành công',
    description: 'Thông tin hồ sơ cá nhân đã được lưu.',
    color: 'emerald'
  })
}

function updatePassword() {
  if (!passwordForm.newPassword || passwordForm.newPassword !== passwordForm.confirmPassword) {
    toast.add({
      title: 'Mật khẩu không khớp',
      description: 'Vui lòng kiểm tra lại mật khẩu mới.',
      color: 'red'
    })
    return
  }

  toast.add({
    title: 'Đổi mật khẩu thành công',
    description: 'Mật khẩu của bạn đã được cập nhật an toàn.',
    color: 'emerald'
  })

  passwordForm.current = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}
</script>
