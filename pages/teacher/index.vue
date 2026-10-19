<script setup lang="ts">
import { CheckCircle2, LogIn, MessageCircleQuestion, RefreshCw, RotateCcw, UsersRound } from 'lucide-vue-next'
import MetricChart from '~/components/dashboard/MetricChart.vue'
import type { TeacherDashboard } from '~/types/dashboard'

definePageMeta({ layout: 'dashboard', middleware: ['auth', 'teacher'] })
useSeoMeta({ title: 'Thống kê lớp học', description: 'Theo dõi hoạt động học tập của học sinh trong lớp chủ nhiệm.' })

const api = useApi()
const dashboard = ref<TeacherDashboard | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const selectedClassId = ref('')
const days = ref<7 | 14 | 30>(7)

async function loadDashboard() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await api.get<{ data: TeacherDashboard }>('/teacher/dashboard', {
      query: { days: days.value, ...(selectedClassId.value ? { classId: selectedClassId.value } : {}) },
    })
    dashboard.value = response.data
    selectedClassId.value ||= response.data.classroom.id
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Chưa thể tải thống kê lớp.'
  } finally {
    loading.value = false
  }
}

watch(days, () => {
  if (dashboard.value) void loadDashboard()
})
watch(selectedClassId, (classId) => {
  if (dashboard.value && classId && classId !== dashboard.value.classroom.id) void loadDashboard()
})
onMounted(loadDashboard)
</script>

<template>
  <div class="m5-page-stack">
    <header class="m5-page-heading m5-page-heading--controls">
      <div><span>Dashboard giáo viên</span><h1>Thống kê {{ dashboard?.classroom.classCode ? `lớp ${dashboard.classroom.classCode}` : 'lớp học' }}</h1><p>Theo dõi hoạt động thực tế; mỗi học sinh chỉ được tính một lần trong chỉ số người dùng.</p></div>
      <div class="m5-filter-row">
        <label><span>Lớp</span><select v-model="selectedClassId" :disabled="loading"><option v-for="item in dashboard?.classes || []" :key="item.id" :value="item.id">Lớp {{ item.classCode }}</option></select></label>
        <label><span>Khoảng thời gian</span><select v-model.number="days" :disabled="loading"><option :value="7">7 ngày qua</option><option :value="14">14 ngày qua</option><option :value="30">30 ngày qua</option></select></label>
      </div>
    </header>

    <section v-if="loading && !dashboard" class="m5-state-card" aria-live="polite"><span class="m5-loader" /> Đang tổng hợp dữ liệu lớp...</section>
    <section v-else-if="errorMessage && !dashboard" class="m5-state-card is-error"><p>{{ errorMessage }}</p><button type="button" @click="loadDashboard"><RefreshCw /> Thử lại</button></section>
    <template v-else-if="dashboard">
      <p v-if="errorMessage" class="m5-inline-error">{{ errorMessage }}</p>
      <section class="m5-kpi-grid" aria-label="Tổng quan lớp học">
        <article class="m5-kpi-card is-green"><span><UsersRound /></span><div><strong>{{ dashboard.totals.students }}</strong><p>Tổng số học sinh</p><small>{{ dashboard.classroom.schoolName }}</small></div></article>
        <article class="m5-kpi-card is-blue"><span><LogIn /></span><div><strong>{{ dashboard.totals.loggedInStudents }}</strong><p>Học sinh đã đăng nhập</p><small>Trong {{ dashboard.range.days }} ngày</small></div></article>
        <article class="m5-kpi-card is-purple"><span><MessageCircleQuestion /></span><div><strong>{{ dashboard.totals.questions }}</strong><p>Lượt hỏi bài</p><small>{{ dashboard.totals.askingStudents }} học sinh đã hỏi</small></div></article>
        <article class="m5-kpi-card is-orange"><span><RotateCcw /></span><div><strong>{{ dashboard.totals.retries }}</strong><p>Lượt làm lại sau gợi ý</p><small>{{ dashboard.totals.correctRetries }} lượt đã sửa đúng</small></div></article>
        <article class="m5-kpi-card is-coral"><span><CheckCircle2 /></span><div><strong>{{ dashboard.totals.retryAccuracy === null ? '—' : `${dashboard.totals.retryAccuracy}%` }}</strong><p>Tỷ lệ làm lại đúng</p><small>Chỉ tính bài làm lại đã lưu</small></div></article>
      </section>

      <section class="m5-chart-grid" :aria-busy="loading">
        <MetricChart title="Học sinh đăng nhập mỗi ngày" description="Số học sinh riêng biệt có phiên đăng nhập thành công" :items="dashboard.daily" field="loggedInStudents" color="#3b82f6" :total-label="`${dashboard.totals.loggedInStudents} học sinh`" />
        <MetricChart title="Hoạt động hỏi đáp" description="Số câu hỏi/bài làm học sinh gửi cho AI" :items="dashboard.daily" field="questions" color="#8b5cf6" :total-label="`${dashboard.totals.questions} lượt hỏi`" />
        <MetricChart title="Làm lại sau gợi ý AI" description="Số lượt học sinh tự nộp lại bài sau nhận xét" :items="dashboard.daily" field="retries" color="#f59e0b" :total-label="`${dashboard.totals.retries} lượt làm lại`" />
      </section>

      <section class="m5-data-note">
        <strong>Cách đọc số liệu</strong>
        <p>Đăng nhập và học sinh hỏi bài được khử trùng theo từng học sinh. “Làm lại” lấy từ bài nộp sau khi AI đã đưa nhận xét; bài chưa chấm hoặc cần xem lại không được tính là đúng.</p>
      </section>
    </template>
  </div>
</template>
