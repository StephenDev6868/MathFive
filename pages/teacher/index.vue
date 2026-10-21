<script setup lang="ts">
import { Activity, AlertTriangle, CheckCircle2, ChevronDown, CircleHelp, Lightbulb, LogIn, MessageCircleQuestion, RefreshCw, RotateCcw, Search, UserCheck, UsersRound, UserX } from 'lucide-vue-next'
import MetricChart from '~/components/dashboard/MetricChart.vue'
import type { TeacherDashboard, TeacherQuestionInsight } from '~/types/dashboard'

definePageMeta({ layout: 'dashboard', middleware: ['auth', 'teacher'] })
useSeoMeta({ title: 'Thống kê lớp học', description: 'Theo dõi hoạt động học tập của học sinh trong lớp chủ nhiệm.' })

const api = useApi()
const dashboard = ref<TeacherDashboard | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const selectedClassId = ref('')
const days = ref<7 | 14 | 30>(7)
const insightFilter = ref<'all' | 'needs_help' | 'waiting' | 'resolved'>('all')
const insightSearch = ref('')
const usageFilter = ref<'all' | 'active' | 'inactive'>('all')
const usageSearch = ref('')

const filteredStudentUsage = computed(() => {
  const query = usageSearch.value.trim().toLocaleLowerCase('vi')
  return (dashboard.value?.studentUsage || []).filter((item) => {
    if (usageFilter.value === 'active' && !item.isActive) return false
    if (usageFilter.value === 'inactive' && item.isActive) return false
    return !query || `${item.studentName} ${item.username}`.toLocaleLowerCase('vi').includes(query)
  })
})

const activeUsageRate = computed(() => {
  const total = dashboard.value?.totals.students || 0
  return total ? Math.round(((dashboard.value?.totals.activeStudents || 0) / total) * 100) : 0
})

const filteredInsights = computed(() => {
  const query = insightSearch.value.trim().toLocaleLowerCase('vi')
  return (dashboard.value?.questionInsights || []).filter((item) => {
    const matchesSearch = !query || `${item.studentName} ${item.username} ${item.questionText}`.toLocaleLowerCase('vi').includes(query)
    if (!matchesSearch) return false
    if (insightFilter.value === 'waiting') return !item.review
    if (insightFilter.value === 'resolved') return item.latestRetry?.verdict === 'correct' || (!item.latestRetry && item.review?.status === 'correct')
    if (insightFilter.value === 'needs_help') return item.review?.status === 'has_errors' || item.review?.status === 'needs_review' || item.review?.status === 'no_attempt'
    return true
  })
})

const issueLabel = {
  copied_data: 'Chép dữ kiện', reasoning: 'Cách suy luận', calculation: 'Phép tính',
  unit: 'Đơn vị', notation: 'Trình bày', other: 'Chỗ cần sửa',
} as const

function insightStatus(item: TeacherQuestionInsight) {
  if (!item.review) return { label: 'Chờ AI nhận xét', className: 'is-waiting' }
  if (item.latestRetry?.verdict === 'correct' || (!item.latestRetry && item.review.status === 'correct')) return { label: 'Đã làm đúng', className: 'is-resolved' }
  if (item.latestRetry) return { label: 'Đã làm lại, còn vướng', className: 'is-retry' }
  if (item.review.status === 'no_attempt') return { label: 'Chưa có bài làm', className: 'is-warning' }
  return { label: 'Cần giáo viên quan tâm', className: 'is-danger' }
}

function formatAskedAt(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(value))
}

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

      <section class="m5-detail-card m5-usage-section" :aria-busy="loading">
        <div class="m5-detail-card__heading m5-usage-heading">
          <div><h2>Chi tiết học sinh sử dụng hệ thống</h2><p>Hoạt động của từng học sinh trong {{ dashboard.range.days }} ngày đang chọn.</p></div>
          <span><Activity /> {{ dashboard.totals.activeStudents }}/{{ dashboard.totals.students }} học sinh hoạt động</span>
        </div>
        <div class="m5-usage-overview">
          <div class="m5-usage-progress"><div><strong>{{ activeUsageRate }}%</strong><span>học sinh có hoạt động</span></div><progress :value="dashboard.totals.activeStudents" :max="dashboard.totals.students || 1">{{ activeUsageRate }}%</progress></div>
          <article><UserCheck /><div><strong>{{ dashboard.totals.activeStudents }}</strong><span>Đã sử dụng</span></div></article>
          <article><UserX /><div><strong>{{ dashboard.totals.students - dashboard.totals.activeStudents }}</strong><span>Chưa có hoạt động</span></div></article>
        </div>
        <div class="m5-usage-toolbar">
          <label class="m5-usage-search"><Search /><input v-model="usageSearch" type="search" placeholder="Tìm theo tên hoặc username..." /></label>
          <label><span>Trạng thái sử dụng</span><select v-model="usageFilter"><option value="all">Tất cả học sinh</option><option value="active">Đã sử dụng</option><option value="inactive">Chưa có hoạt động</option></select></label>
        </div>
        <div class="m5-usage-table-wrap">
          <table class="m5-usage-table">
            <thead><tr><th>Học sinh</th><th>Trạng thái</th><th>Ngày đăng nhập</th><th>Hỏi bài</th><th>Làm lại</th><th>Hoạt động gần nhất</th></tr></thead>
            <tbody>
              <tr v-for="item in filteredStudentUsage" :key="item.studentId">
                <td><span class="m5-usage-avatar">{{ item.studentName.slice(0, 1).toUpperCase() }}</span><span><strong>{{ item.studentName }}</strong><small>{{ item.username }}</small></span></td>
                <td><span class="m5-usage-state" :class="item.isActive ? 'is-active' : 'is-inactive'">{{ item.isActive ? 'Đã sử dụng' : 'Chưa hoạt động' }}</span></td>
                <td><strong>{{ item.loginDays }}</strong><small>{{ item.loginCount }} lượt đăng nhập</small></td>
                <td><strong>{{ item.questions }}</strong><small>câu hỏi</small></td>
                <td><strong>{{ item.retries }}</strong><small>{{ item.correctRetries }} lượt đúng</small></td>
                <td>{{ item.lastActiveAt ? formatAskedAt(item.lastActiveAt) : '—' }}</td>
              </tr>
              <tr v-if="!filteredStudentUsage.length"><td colspan="6" class="m5-usage-empty">Không có học sinh phù hợp với bộ lọc.</td></tr>
            </tbody>
          </table>
        </div>
        <p class="m5-usage-note">“Đã sử dụng” được tính khi học sinh có ít nhất một hoạt động đăng nhập, hỏi bài hoặc làm lại trong khoảng thời gian đã chọn.</p>
      </section>

      <section class="m5-detail-card m5-insight-section" :aria-busy="loading">
        <div class="m5-detail-card__heading m5-insight-heading">
          <div><h2>Học sinh đang hỏi gì và gặp khó ở đâu?</h2><p>Đối chiếu trực tiếp câu hỏi, nhận xét AI và kết quả làm lại của từng học sinh.</p></div>
          <span>{{ dashboard.questionInsights.length }} câu hỏi gần nhất</span>
        </div>

        <div v-if="dashboard.difficultySummary.length" class="m5-difficulty-grid" aria-label="Nhóm khó khăn phổ biến">
          <article v-for="item in dashboard.difficultySummary" :key="item.type">
            <span><AlertTriangle /></span><div><strong>{{ item.label }}</strong><p>{{ item.issueCount }} chỗ cần sửa · {{ item.studentCount }} học sinh</p></div>
          </article>
        </div>
        <div v-else class="m5-insight-empty is-compact"><CheckCircle2 /><span>Chưa ghi nhận nhóm lỗi cụ thể trong khoảng thời gian này.</span></div>

        <div class="m5-insight-toolbar">
          <label class="m5-insight-search"><Search /><input v-model="insightSearch" type="search" placeholder="Tìm học sinh hoặc nội dung câu hỏi..." /></label>
          <label><span>Trạng thái</span><select v-model="insightFilter"><option value="all">Tất cả</option><option value="needs_help">Đang cần hỗ trợ</option><option value="waiting">Chờ AI nhận xét</option><option value="resolved">Đã làm đúng</option></select></label>
        </div>

        <div v-if="filteredInsights.length" class="m5-insight-list">
          <details v-for="item in filteredInsights" :key="item.problemId" class="m5-insight-item">
            <summary>
              <span class="m5-insight-avatar">{{ item.studentName.slice(0, 1).toUpperCase() }}</span>
              <span class="m5-insight-student"><strong>{{ item.studentName }}</strong><small>{{ item.username }} · {{ formatAskedAt(item.askedAt) }}</small></span>
              <span class="m5-insight-preview">{{ item.questionText }}</span>
              <span class="m5-insight-status" :class="insightStatus(item).className">{{ insightStatus(item).label }}</span>
              <ChevronDown class="m5-insight-chevron" />
            </summary>
            <div class="m5-insight-body">
              <section class="m5-insight-question"><h3><CircleHelp /> Nội dung học sinh gửi</h3><p>{{ item.questionText }}</p></section>
              <section v-if="item.review" class="m5-insight-review">
                <h3><MessageCircleQuestion /> Nhận xét của AI</h3><p>{{ item.review.summary }}</p>
                <div v-if="item.review.issues.length" class="m5-insight-issues">
                  <article v-for="(issue, index) in item.review.issues" :key="`${item.problemId}-${index}`">
                    <header><span>{{ index + 1 }}</span><strong>{{ issue.location }}</strong><small>{{ issueLabel[issue.errorType] }}</small></header>
                    <p v-if="issue.studentWork"><b>Học sinh đã làm:</b> {{ issue.studentWork }}</p>
                    <p><b>Khó khăn:</b> {{ issue.explanation }}</p>
                    <p v-if="issue.hint" class="m5-insight-hint"><Lightbulb /><span><b>Gợi ý:</b> {{ issue.hint }}</span></p>
                  </article>
                </div>
                <div class="m5-insight-next"><Lightbulb /><div><strong>Bước tiếp theo</strong><p>{{ item.review.nextStep }}</p></div></div>
              </section>
              <section v-else class="m5-insight-empty"><RefreshCw /><span>Học sinh đã gửi bài nhưng chưa có nhận xét AI để phân tích khó khăn.</span></section>
              <footer class="m5-insight-retry">
                <strong>{{ item.retryCount }} lượt làm lại</strong>
                <span v-if="item.latestRetry">Lần gần nhất: {{ item.latestRetry.verdict === 'correct' ? 'đúng' : item.latestRetry.verdict === 'incorrect' ? 'chưa đúng' : 'cần xem lại' }} · {{ formatAskedAt(item.latestRetry.createdAt) }}</span>
                <span v-else>Học sinh chưa nộp bài làm lại.</span>
              </footer>
            </div>
          </details>
        </div>
        <div v-else class="m5-insight-empty"><Search /><span>Không có câu hỏi phù hợp với bộ lọc.</span></div>
        <p v-if="dashboard.totals.questions > dashboard.insightLimit" class="m5-insight-limit">Đang hiển thị {{ dashboard.insightLimit }} câu hỏi mới nhất; các KPI và biểu đồ vẫn tính toàn bộ dữ liệu trong khoảng đã chọn.</p>
      </section>

      <section class="m5-data-note">
        <strong>Cách đọc số liệu</strong>
        <p>Đăng nhập và học sinh hỏi bài được khử trùng theo từng học sinh. “Làm lại” lấy từ bài nộp sau khi AI đã đưa nhận xét; bài chưa chấm hoặc cần xem lại không được tính là đúng.</p>
      </section>
    </template>
  </div>
</template>
