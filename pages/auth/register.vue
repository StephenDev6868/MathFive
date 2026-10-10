<template>
  <div class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Tạo tài khoản mới</h2>
      <p class="text-sm text-gray-500 mt-1">Gia nhập hệ sinh thái dịch vụ phần mềm MathFive</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleRegister">
      <UFormGroup label="Họ và tên" name="name" required>
        <UInput
          v-model="form.name"
          placeholder="Nguyễn Văn A"
          icon="i-heroicons-user"
          size="md"
        />
      </UFormGroup>

      <UFormGroup label="Địa chỉ Email" name="email" required>
        <UInput
          v-model="form.email"
          type="email"
          placeholder="name@company.com"
          icon="i-heroicons-envelope"
          size="md"
        />
      </UFormGroup>

      <UFormGroup label="Mật khẩu" name="password" required>
        <UInput
          v-model="form.password"
          type="password"
          placeholder="Tối thiểu 6 ký tự"
          icon="i-heroicons-lock-closed"
          size="md"
        />
      </UFormGroup>

      <div class="text-xs">
        <UCheckbox
          v-model="form.agree"
          label="Tôi đồng ý với các điều khoản dịch vụ và chính sách bảo mật"
        />
      </div>

      <UButton
        type="submit"
        color="emerald"
        block
        size="md"
        :loading="loading"
        class="mt-6 font-semibold"
      >
        Đăng ký tài khoản
      </UButton>
    </form>

    <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
      Đã có tài khoản?
      <NuxtLink to="/auth/login" class="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline ml-1">
        Đăng nhập tại đây
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest'
})

useSeoMeta({
  title: 'Đăng ký tài khoản - MathFive Portal',
  description: 'Tạo tài khoản thành viên MathFive Portal.'
})

const authStore = useAuthStore()
const toast = useToast()

const loading = ref(false)
const form = reactive({
  name: '',
  email: '',
  password: '',
  agree: false
})

async function handleRegister() {
  if (!form.name || !form.email || !form.password) {
    toast.add({
      title: 'Thiếu thông tin',
      description: 'Vui lòng điền đầy đủ các trường bắt buộc.',
      color: 'red'
    })
    return
  }

  if (!form.agree) {
    toast.add({
      title: 'Điều khoản dịch vụ',
      description: 'Vui lòng xác nhận đồng ý với điều khoản sử dụng.',
      color: 'amber'
    })
    return
  }

  loading.value = true
  try {
    // Perform registration and log in
    await authStore.login({
      email: form.email,
      password: form.password
    })

    if (authStore.user) {
      authStore.updateProfile({ name: form.name })
    }

    toast.add({
      title: 'Đăng ký thành công!',
      description: 'Chào mừng bạn đến với MathFive Portal!',
      color: 'emerald'
    })

    navigateTo('/portal')
  } catch (err: any) {
    toast.add({
      title: 'Đăng ký không thành công',
      description: err?.data?.statusMessage || 'Có lỗi xảy ra trong quá trình đăng ký.',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>
