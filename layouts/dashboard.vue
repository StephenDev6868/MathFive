<template>
  <div class="m5-dash-shell">
    <div class="m5-dash-backdrop" aria-hidden="true" />
    <header class="m5-dash-header">
      <NuxtLink to="/" class="m5-dash-brand" aria-label="MathFive - trang hỏi đáp AI">
        <img src="/math5/decorations/book-badge.svg" alt="" />
        <span><strong>Học cùng bạn <em>✨</em></strong><small>Dành cho học sinh Tiểu học</small></span>
      </NuxtLink>
      <nav class="m5-dash-topnav" aria-label="Điều hướng chính">
        <NuxtLink to="/"><Home /> AI hỏi đáp</NuxtLink>
        <NuxtLink v-if="isTeacher" to="/teacher"><ChartNoAxesCombined /> Thống kê lớp</NuxtLink>
        <NuxtLink to="/profile"><UserRound /> Hồ sơ</NuxtLink>
      </nav>
      <div class="m5-dash-account">
        <NuxtLink to="/profile" class="m5-dash-account__link">
          <span class="m5-dash-avatar">{{ initials }}</span>
          <span><strong>{{ authStore.user?.name || 'Tài khoản' }}</strong><small>{{ isTeacher ? 'Giáo viên' : 'Học sinh' }}</small></span>
        </NuxtLink>
        <button type="button" aria-label="Đăng xuất" title="Đăng xuất" @click="authStore.logout"><LogOut /></button>
      </div>
    </header>

    <div class="m5-dash-body">
      <aside class="m5-dash-sidebar">
        <p>{{ isTeacher ? 'Không gian giáo viên' : 'Không gian học sinh' }}</p>
        <NuxtLink to="/profile" :class="{ 'is-active': route.path === '/profile' }"><UserRound /> {{ isTeacher ? 'Hồ sơ giáo viên' : 'Hồ sơ của em' }}</NuxtLink>
        <NuxtLink v-if="isTeacher" to="/teacher" :class="{ 'is-active': route.path === '/teacher' }"><ChartNoAxesCombined /> Thống kê lớp học</NuxtLink>
        <NuxtLink to="/"><Home /> AI hỏi đáp</NuxtLink>
        <button type="button" @click="authStore.logout"><LogOut /> Đăng xuất</button>
      </aside>
      <main class="m5-dash-main"><slot /></main>
    </div>

    <nav class="m5-dash-mobile-nav" aria-label="Điều hướng mobile">
      <NuxtLink to="/"><Home /><span>Hỏi đáp</span></NuxtLink>
      <NuxtLink v-if="isTeacher" to="/teacher"><ChartNoAxesCombined /><span>Thống kê</span></NuxtLink>
      <NuxtLink to="/profile"><UserRound /><span>Hồ sơ</span></NuxtLink>
      <button type="button" @click="authStore.logout"><LogOut /><span>Đăng xuất</span></button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ChartNoAxesCombined, Home, LogOut, UserRound } from 'lucide-vue-next'

const authStore = useAuthStore()
const route = useRoute()
const isTeacher = computed(() => authStore.user?.role === 'teacher')
const initials = computed(() => (authStore.user?.name || 'MF').split(/\s+/).slice(-2).map(part => part[0]).join('').toUpperCase())
</script>
