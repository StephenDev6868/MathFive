<template>
  <div class="m5-login-card">
    <div class="m5-login-card__tape" aria-hidden="true" />
    <div class="m5-login-heading">
      <span class="m5-login-heading__icon" aria-hidden="true"><BookOpen :size="25" /></span>
      <h2>Đăng nhập</h2>
    </div>

    <button type="button" class="m5-demo" @click="fillDemoAccount">
      <span class="m5-demo__icon"><WandSparkles :size="19" aria-hidden="true" /></span>
      <strong>Dùng tài khoản học thử</strong>
      <ChevronRight class="m5-demo__action" :size="18" aria-hidden="true" />
    </button>
    <div class="m5-login-divider"><span>hoặc</span></div>

    <form class="m5-login-form" @submit.prevent="handleLogin">
      <div class="m5-login-field">
        <label class="m5-login-field__label" for="login-email">Email</label>
        <div class="m5-login-field__control">
          <Mail :size="20" aria-hidden="true" />
          <input id="login-email" v-model.trim="form.email" type="email" inputmode="email" autocomplete="username" placeholder="Ví dụ: an@mathfive.com" required />
        </div>
      </div>

      <div class="m5-login-field">
        <label class="m5-login-field__label" for="login-password">Mật khẩu</label>
        <div class="m5-login-field__control">
          <LockKeyhole :size="20" aria-hidden="true" />
          <input id="login-password" v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Nhập mật khẩu của em" required />
          <button type="button" class="m5-password-toggle" :aria-label="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'" :title="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'" @click="showPassword = !showPassword">
            <EyeOff v-if="showPassword" :size="20" aria-hidden="true" />
            <Eye v-else :size="20" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div class="m5-login-options">
        <label class="m5-login-remember">
          <input v-model="form.rememberMe" type="checkbox" />
          <span aria-hidden="true"><Check :size="15" /></span>
          Ghi nhớ đăng nhập
        </label>
        <span class="m5-login-help">Quên mật khẩu? Liên hệ giáo viên</span>
      </div>

      <button class="m5-login-submit" type="submit" :disabled="loading">
        <span v-if="loading" class="m5-login-spinner" aria-hidden="true" />
        <Rocket v-else :size="21" aria-hidden="true" />
        {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
        <ArrowRight v-if="!loading" :size="20" aria-hidden="true" />
      </button>
    </form>

  </div>
</template>

<script setup lang="ts">
import { ArrowRight, BookOpen, Check, ChevronRight, Eye, EyeOff, LockKeyhole, Mail, Rocket, WandSparkles } from 'lucide-vue-next'

definePageMeta({ layout: 'auth', middleware: 'guest' })
useSeoMeta({ title: 'Đăng nhập', description: 'Đăng nhập để học Toán lớp 5 cùng MathFive.' })

const authStore = useAuthStore()
const toast = useToast()
const route = useRoute()
const loading = ref(false)
const showPassword = ref(false)
const form = reactive({ email: '', password: '', rememberMe: true })

function fillDemoAccount() {
  form.email = 'demo@mathfive.com'
  form.password = '123456'
  toast.add({ title: 'Đã điền thông tin', description: 'Bấm đăng nhập để tiếp tục.', color: 'emerald' })
}

async function handleLogin() {
  if (!form.email || !form.password) {
    toast.add({ title: 'Mình còn thiếu thông tin', description: 'Em nhập đủ email và mật khẩu nhé.', color: 'red' })
    return
  }
  loading.value = true
  try {
    await authStore.login({ email: form.email, password: form.password, rememberMe: form.rememberMe })
    toast.add({ title: 'Đăng nhập thành công!', description: `Chào mừng trở lại, ${authStore.user?.name}!`, color: 'emerald' })
    const redirectUrl = (route.query.redirect as string) || '/'
    await navigateTo(redirectUrl)
  } catch (err: any) {
    toast.add({ title: 'Đăng nhập chưa thành công', description: err?.data?.statusMessage || err?.message || 'Kiểm tra lại email và mật khẩu nhé.', color: 'red' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.m5-login-card{position:relative;padding:clamp(26px,3vw,38px);border:1px solid rgba(231,198,172,.9);border-radius:30px;background:rgba(255,253,248,.96);box-shadow:0 22px 60px rgba(91,57,37,.17),0 4px 0 rgba(184,112,67,.08);backdrop-filter:blur(12px)}
.m5-login-card__tape{position:absolute;top:-12px;left:50%;width:92px;height:25px;transform:translateX(-50%) rotate(-1deg);border-radius:3px;background:rgba(255,220,128,.72);box-shadow:inset 0 0 0 1px rgba(218,172,69,.12)}
.m5-login-heading{display:flex;align-items:center;gap:13px}.m5-login-heading__icon{width:50px;height:50px;display:grid;place-items:center;flex:none;border-radius:16px;background:#ffe7df;color:#df5542;transform:rotate(-3deg)}.m5-login-heading h2{margin:0;color:#26375d;font:800 clamp(26px,2.2vw,31px)/1.08 var(--m5-heading);letter-spacing:-.35px}
.m5-demo{width:100%;min-height:56px;margin-top:23px;display:flex;align-items:center;gap:10px;padding:8px 10px;border:1.5px dashed #8bcdbb;border-radius:16px;background:#edf9f5;color:#276f60;text-align:left;transition:transform .18s ease,background .18s ease,border-color .18s ease}.m5-demo:hover{transform:translateY(-1px);border-color:#48a98f;background:#e4f7f0}.m5-demo__icon{width:38px;height:38px;display:grid;place-items:center;flex:none;border-radius:12px;background:#d6f1e8}.m5-demo strong{font-size:12px;font-weight:900}.m5-demo__action{margin-left:auto;flex:none;color:#27836d}
.m5-login-divider{display:flex;align-items:center;gap:10px;margin:18px 0;color:#99929a;font-size:10px;font-weight:800;white-space:nowrap}.m5-login-divider::before,.m5-login-divider::after{content:'';height:1px;flex:1;background:#eee1d7}
.m5-login-form{display:grid;gap:15px}.m5-login-field{display:grid;gap:6px}.m5-login-field__label{color:#35415e;font-size:12px;font-weight:900}.m5-login-field__control{min-height:52px;display:flex;align-items:center;gap:10px;padding:0 13px;border:1.5px solid #d9dfe7;border-radius:14px;background:#fff;color:#8b96a9;transition:border-color .18s ease,box-shadow .18s ease}.m5-login-field__control:focus-within{border-color:#5b9bea;box-shadow:0 0 0 4px rgba(91,155,234,.14);color:#397fc7}.m5-login-field__control input{min-width:0;height:48px;flex:1;border:0;outline:0;background:transparent;color:#26375d;font-size:13px;font-weight:800}.m5-login-field__control input::placeholder{color:#a1a8b5;font-weight:700}.m5-password-toggle{width:42px;height:42px;display:grid;place-items:center;flex:none;margin-right:-9px;border:0;border-radius:11px;background:transparent;color:#77849a}.m5-password-toggle:hover{background:#eef5fc;color:#397fc7}
.m5-login-options{display:flex;align-items:center;justify-content:space-between;gap:12px}.m5-login-remember{min-height:38px;display:flex;align-items:center;gap:7px;color:#4d5870;font-size:11px;font-weight:900;cursor:pointer}.m5-login-remember input{position:absolute;opacity:0;pointer-events:none}.m5-login-remember span{width:21px;height:21px;display:grid;place-items:center;border:1.5px solid #bbc5d2;border-radius:7px;background:#fff;color:transparent}.m5-login-remember input:checked+span{border-color:#3aa188;background:#3aa188;color:#fff}.m5-login-remember input:focus-visible+span{outline:3px solid rgba(76,147,226,.35);outline-offset:2px}.m5-login-help{max-width:150px;color:#c75a48;font-size:10px;font-weight:800;line-height:1.4;text-align:right}
.m5-login-submit{min-height:54px;display:flex;align-items:center;justify-content:center;gap:9px;margin-top:2px;border:0;border-radius:16px;background:linear-gradient(180deg,#ff7866,#f05240);color:#fff;box-shadow:0 5px 0 #d94233,0 10px 20px rgba(229,77,57,.22);font-size:14px;font-weight:900;transition:transform .15s ease,box-shadow .15s ease}.m5-login-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 0 #d94233,0 12px 22px rgba(229,77,57,.25)}.m5-login-submit:active:not(:disabled){transform:translateY(3px);box-shadow:0 2px 0 #d94233}.m5-login-submit:disabled{cursor:wait;opacity:.72}.m5-login-spinner{width:19px;height:19px;border:3px solid rgba(255,255,255,.45);border-top-color:#fff;border-radius:50%;animation:login-spin .8s linear infinite}
@keyframes login-spin{to{transform:rotate(360deg)}}
@media(max-width:560px){.m5-login-card{padding:25px 18px 21px;border-radius:23px}.m5-login-heading__icon{width:44px;height:44px;border-radius:14px}.m5-login-heading h2{font-size:23px}.m5-demo{margin-top:18px}.m5-login-divider{margin:15px 0}.m5-login-help{max-width:130px}}
@media(max-width:370px){.m5-login-card{padding-inline:15px}.m5-login-heading h2{font-size:21px}.m5-login-divider span{font-size:9px}.m5-login-help{display:none}}
@media(prefers-reduced-motion:reduce){.m5-demo,.m5-login-submit{transition:none}.m5-login-spinner{animation-duration:1.5s}}
</style>
