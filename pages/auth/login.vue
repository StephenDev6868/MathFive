<template>
  <div class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
    <div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Đăng nhập Cổng Thông tin</h2>
      <p class="text-sm text-gray-500 mt-1">Truy cập không gian làm việc và dịch vụ của bạn</p>
    </div>

    <!-- Quick Demo Autofill Notice -->
    <div class="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
      <div class="text-xs text-emerald-800 dark:text-emerald-300">
        <span class="font-bold">Tài khoản thử nghiệm:</span> demo@mathfive.com
      </div>
      <UButton
        size="xs"
        color="emerald"
        variant="soft"
        @click="fillDemoAccount"
      >
        Tự động điền
      </UButton>
    </div>

    <!-- Login Form -->
    <form class="space-y-4" @submit.prevent="handleLogin">
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
          placeholder="••••••••"
          icon="i-heroicons-lock-closed"
          size="md"
        />
      </UFormGroup>

      <div class="flex items-center justify-between text-xs">
        <UCheckbox v-model="form.rememberMe" label="Ghi nhớ đăng nhập" />
        <a href="#" class="text-emerald-600 dark:text-emerald-400 hover:underline">Quên mật khẩu?</a>
      </div>

      <UButton
        type="submit"
        color="emerald"
        block
        size="md"
        :loading="loading"
        class="mt-6 font-semibold"
      >
        Đăng nhập ngay
      </UButton>
    </form>

    <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
      Chưa có tài khoản?
      <NuxtLink to="/auth/register" class="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline ml-1">
        Đăng ký tài khoản mới
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
  title: 'Đăng nhập - MathFive Portal',
  description: 'Đăng nhập vào cổng thông tin và dịch vụ MathFive.'
})

const authStore = useAuthStore()
const toast = useToast()
const route = useRoute()

const loading = ref(false)
const form = reactive({
  email: '',
  password: '',
  rememberMe: true
})

function fillDemoAccount() {
  form.email = 'demo@mathfive.com'
  form.password = '123456'
}

async function handleLogin() {
  if (!form.email || !form.password) {
    toast.add({
      title: 'Lỗi thông tin',
      description: 'Vui lòng nhập đầy đủ Email và Mật khẩu.',
      color: 'red'
    })
    return
  }

  loading.value = true
  try {
    await authStore.login({
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe
    })

    toast.add({
      title: 'Đăng nhập thành công!',
      description: `Chào mừng trở lại, ${authStore.user?.name}!`,
      color: 'emerald'
    })

    // Redirect to previous requested page or portal home
    const redirectUrl = (route.query.redirect as string) || '/portal'
    navigateTo(redirectUrl)
  } catch (err: any) {
    toast.add({
      title: 'Đăng nhập thất bại',
      description: err?.data?.statusMessage || 'Vui lòng kiểm tra lại thông tin đăng nhập.',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>
