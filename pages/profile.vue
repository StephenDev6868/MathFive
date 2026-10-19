<script setup lang="ts">
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  KeyRound,
  MessageCircleQuestion,
  Pencil,
  Plus,
  RefreshCw,
  School,
  Trash2,
  UsersRound,
  X,
} from 'lucide-vue-next'
import type { AccountProfile, TeacherRoster, TeacherStudent } from '~/types/dashboard'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })
useSeoMeta({ title: 'Hồ sơ của tôi', description: 'Thông tin tài khoản, lớp học và hoạt động học tập trên MathFive.' })

const api = useApi()
const profile = ref<AccountProfile | null>(null)
const loading = ref(true)
const errorMessage = ref('')
const roster = ref<TeacherRoster | null>(null)
const rosterLoading = ref(false)
const rosterError = ref('')
const selectedClassId = ref('all')
const createFormOpen = ref(false)
const editingStudent = ref<TeacherStudent | null>(null)
const studentForm = reactive({ classroomId: '', displayName: '', username: '' })
const savingStudent = ref(false)
const busyStudentId = ref('')
const credentialNotice = ref<{ displayName: string; username: string; password: string } | null>(null)

const page = ref(1)
const pageSize = ref(10)

const isTeacher = computed(() => profile.value?.role === 'teacher')
const initials = computed(() => (profile.value?.displayName || 'MF').split(/\s+/).slice(-2).map(part => part[0]).join('').toUpperCase())
const retryAccuracy = computed(() => {
  const summary = profile.value?.summary
  return summary?.retries ? Math.round((summary.correctRetries / summary.retries) * 100) : 0
})
const joinedAt = computed(() => profile.value
  ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'long', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(profile.value.createdAt))
  : '')
const visibleStudents = computed(() => roster.value?.students.filter(student => selectedClassId.value === 'all' || student.classroomId === selectedClassId.value) || [])

const totalStudents = computed(() => visibleStudents.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalStudents.value / pageSize.value)))

const paginatedStudents = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return visibleStudents.value.slice(start, start + pageSize.value)
})

const paginationRange = computed(() => {
  if (!totalStudents.value) return { from: 0, to: 0, total: 0 }
  const from = (page.value - 1) * pageSize.value + 1
  const to = Math.min(page.value * pageSize.value, totalStudents.value)
  return { from, to, total: totalStudents.value }
})

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = page.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | string)[] = [1]
  if (current > 3) {
    pages.push('...')
  }
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  if (current < total - 2) {
    pages.push('...')
  }
  pages.push(total)
  return pages
})

watch(selectedClassId, () => {
  page.value = 1
  if (editingStudent.value && selectedClassId.value !== 'all' && editingStudent.value.classroomId !== selectedClassId.value) {
    closeStudentForm()
  }
})

watch(pageSize, () => {
  page.value = 1
})

watch(visibleStudents, (list) => {
  const maxPage = Math.max(1, Math.ceil(list.length / pageSize.value))
  if (page.value > maxPage) {
    page.value = maxPage
  }
})

function goToPage(p: number | string) {
  if (typeof p !== 'number') return
  if (p < 1 || p > totalPages.value) return
  page.value = p
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

async function loadProfile() {
  loading.value = true
  errorMessage.value = ''
  try {
    profile.value = (await api.get<{ data: AccountProfile }>('/profile')).data
    if (profile.value.role === 'teacher') await loadRoster()
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || error?.message || 'Chưa thể tải hồ sơ.'
  } finally {
    loading.value = false
  }
}

async function loadRoster() {
  rosterLoading.value = true
  rosterError.value = ''
  try {
    roster.value = (await api.get<{ data: TeacherRoster }>('/teacher/students')).data
    if (!studentForm.classroomId) studentForm.classroomId = roster.value.classes[0]?.id || ''
  } catch (error: any) {
    rosterError.value = error?.data?.statusMessage || error?.message || 'Chưa thể tải danh sách học sinh.'
  } finally {
    rosterLoading.value = false
  }
}

function openCreateStudent() {
  editingStudent.value = null
  createFormOpen.value = true
  credentialNotice.value = null
  studentForm.classroomId = selectedClassId.value !== 'all' ? selectedClassId.value : roster.value?.classes[0]?.id || ''
  studentForm.displayName = ''
  studentForm.username = ''
}

function toggleEditStudent(student: TeacherStudent) {
  if (editingStudent.value?.id === student.id) {
    closeStudentForm()
    return
  }
  createFormOpen.value = false
  editingStudent.value = student
  credentialNotice.value = null
  studentForm.classroomId = student.classroomId
  studentForm.displayName = student.displayName
  studentForm.username = student.username
}

function closeStudentForm() {
  editingStudent.value = null
  createFormOpen.value = false
  studentForm.displayName = ''
  studentForm.username = ''
}

async function saveStudent() {
  if (!studentForm.classroomId || !studentForm.displayName.trim() || !studentForm.username.trim()) return
  savingStudent.value = true
  rosterError.value = ''
  credentialNotice.value = null
  try {
    if (editingStudent.value) {
      await api.patch(`/teacher/students/${editingStudent.value.id}`, { ...studentForm, displayName: studentForm.displayName.trim(), username: studentForm.username.trim().toLowerCase() })
      closeStudentForm()
    } else {
      const result = await api.post<{ data: { id: string; password: string } }>('/teacher/students', { ...studentForm, displayName: studentForm.displayName.trim(), username: studentForm.username.trim().toLowerCase() })
      credentialNotice.value = { displayName: studentForm.displayName.trim(), username: studentForm.username.trim().toLowerCase(), password: result.data.password }
      closeStudentForm()
    }
    await Promise.all([loadRoster(), loadProfileSummary()])
  } catch (error: any) {
    rosterError.value = error?.data?.statusMessage || error?.message || 'Chưa thể lưu học sinh.'
  } finally {
    savingStudent.value = false
  }
}

async function resetPassword(student: TeacherStudent) {
  if (!window.confirm(`Đặt lại mật khẩu cho ${student.displayName}? Mật khẩu cũ sẽ không dùng được.`)) return
  busyStudentId.value = student.id
  rosterError.value = ''
  try {
    const result = await api.post<{ data: { password: string } }>(`/teacher/students/${student.id}/reset-password`)
    credentialNotice.value = { displayName: student.displayName, username: student.username, password: result.data.password }
  } catch (error: any) {
    rosterError.value = error?.data?.statusMessage || error?.message || 'Chưa thể đặt lại mật khẩu.'
  } finally {
    busyStudentId.value = ''
  }
}

async function deleteStudent(student: TeacherStudent) {
  if (!window.confirm(`Xóa vĩnh viễn tài khoản ${student.displayName}? Toàn bộ dữ liệu học tập của em sẽ bị xóa và không thể khôi phục.`)) return
  busyStudentId.value = student.id
  rosterError.value = ''
  try {
    await api.delete(`/teacher/students/${student.id}`)
    if (editingStudent.value?.id === student.id) closeStudentForm()
    await Promise.all([loadRoster(), loadProfileSummary()])
  } catch (error: any) {
    rosterError.value = error?.data?.statusMessage || error?.message || 'Chưa thể xóa học sinh.'
  } finally {
    busyStudentId.value = ''
  }
}

async function loadProfileSummary() {
  const result = await api.get<{ data: AccountProfile }>('/profile')
  profile.value = result.data
}

onMounted(loadProfile)
</script>

<template>
  <div class="m5-page-stack">
    <section v-if="loading" class="m5-state-card" aria-live="polite"><span class="m5-loader" /> Đang tải hồ sơ...</section>
    <section v-else-if="errorMessage" class="m5-state-card is-error">
      <p>{{ errorMessage }}</p><button type="button" @click="loadProfile"><RefreshCw /> Thử lại</button>
    </section>
    <template v-else-if="profile">
      <header class="m5-page-heading">
        <div><span>Hồ sơ</span><h1>{{ isTeacher ? 'Hồ sơ giáo viên' : 'Hồ sơ của em' }}</h1><p>Thông tin tài khoản và hoạt động được lấy trực tiếp từ hệ thống.</p></div>
      </header>

      <section class="m5-profile-hero">
        <div class="m5-profile-avatar" :class="{ 'is-teacher': isTeacher }">
          <img v-if="!isTeacher" src="/math5/illustrations/mascot-waving.png" alt="Mèo MathFive đang chào" />
          <span v-else>{{ initials }}</span>
        </div>
        <div class="m5-profile-identity">
          <span class="m5-role-pill">{{ isTeacher ? 'Giáo viên' : 'Học sinh lớp 5' }}</span>
          <h2>{{ profile.displayName }}</h2>
          <dl>
            <div><dt><KeyRound /> Tên đăng nhập</dt><dd>{{ profile.username }}</dd></div>
            <div><dt><School /> Trường</dt><dd>{{ profile.classes[0]?.schoolName || 'Chưa cập nhật' }}</dd></div>
            <div><dt><GraduationCap /> {{ isTeacher ? 'Lớp chủ nhiệm' : 'Lớp' }}</dt><dd>{{ profile.classes.map(item => item.classCode).join(', ') || 'Chưa phân lớp' }}</dd></div>
            <div><dt><CalendarDays /> Tham gia từ</dt><dd>{{ joinedAt }}</dd></div>
          </dl>
        </div>
        <div class="m5-profile-note">
          <strong>{{ isTeacher ? 'Đồng hành cùng học sinh' : 'Mỗi lần tự sửa là một lần tiến bộ' }}</strong>
          <p>{{ isTeacher ? `Đang phụ trách ${profile.summary.students} học sinh trong ${profile.classes.length} lớp.` : 'Hãy xem gợi ý, tự làm lại và kiểm tra mình đã hiểu bài nhé!' }}</p>
        </div>
      </section>

      <section class="m5-profile-grid" aria-label="Thống kê hồ sơ">
        <article v-if="isTeacher" class="m5-summary-card is-blue"><span><UsersRound /></span><div><strong>{{ profile.summary.students }}</strong><p>Học sinh đang quản lý</p></div></article>
        <article v-if="isTeacher" class="m5-summary-card is-orange"><span><School /></span><div><strong>{{ profile.classes.length }}</strong><p>Lớp đang chủ nhiệm</p></div></article>
        <article v-if="!isTeacher" class="m5-summary-card is-purple"><span><MessageCircleQuestion /></span><div><strong>{{ profile.summary.questions }}</strong><p>Câu hỏi đã gửi</p></div></article>
        <article v-if="!isTeacher" class="m5-summary-card is-orange"><span><BookOpenCheck /></span><div><strong>{{ profile.summary.retries }}</strong><p>Lần làm lại sau gợi ý</p></div></article>
        <article v-if="!isTeacher" class="m5-summary-card is-green"><span><CheckCircle2 /></span><div><strong>{{ retryAccuracy }}%</strong><p>Tỷ lệ làm lại đúng</p></div></article>
        <article v-if="!isTeacher" class="m5-summary-card is-blue"><span><CalendarDays /></span><div><strong>{{ profile.summary.activeDays }}</strong><p>Ngày đăng nhập trong 30 ngày</p></div></article>
      </section>

      <section class="m5-detail-card">
        <div class="m5-detail-card__heading"><div><h2>{{ isTeacher ? 'Lớp đang phụ trách' : 'Thông tin lớp học' }}</h2><p>Dữ liệu phân lớp được quản trị từ danh sách nhà trường.</p></div></div>
        <div v-if="profile.classes.length" class="m5-class-list">
          <article v-for="item in profile.classes" :key="item.id">
            <span><School /></span><div><strong>Lớp {{ item.classCode }}</strong><p>{{ item.schoolName }}</p></div><small v-if="item.studentCount !== undefined">{{ item.studentCount }} học sinh</small>
          </article>
        </div>
        <p v-else class="m5-empty-copy">Tài khoản chưa được xếp lớp. Vui lòng liên hệ quản trị viên.</p>
      </section>

      <section v-if="isTeacher" class="m5-detail-card m5-roster-card">
        <div class="m5-detail-card__heading m5-roster-heading">
          <div><h2>Học sinh lớp chủ nhiệm</h2><p>Danh sách đầy đủ học sinh thuộc các lớp cô/thầy đang phụ trách.</p></div>
          <button type="button" class="m5-primary-button" @click="openCreateStudent"><Plus /> Thêm học sinh</button>
        </div>

        <div v-if="credentialNotice" class="m5-credential-notice" role="status">
          <div><strong>Mật khẩu mới — chỉ hiển thị lần này</strong><p>{{ credentialNotice.displayName }} · <b>{{ credentialNotice.username }}</b> · <code>{{ credentialNotice.password }}</code></p></div>
          <button type="button" aria-label="Đóng" @click="credentialNotice = null"><X /></button>
        </div>

        <!-- Form tạo học sinh mới (chỉ xuất hiện khi bấm 'Thêm học sinh') -->
        <form v-if="createFormOpen" class="m5-student-form" @submit.prevent="saveStudent">
          <strong>Thêm học sinh mới</strong>
          <label><span>Họ và tên</span><input v-model="studentForm.displayName" maxlength="80" required autocomplete="off" placeholder="Họ và tên học sinh" /></label>
          <label><span>Tên đăng nhập</span><input v-model="studentForm.username" pattern="[a-z][a-z0-9]{2,39}" maxlength="40" required autocomplete="off" placeholder="vd: ancd" /></label>
          <label><span>Lớp</span><select v-model="studentForm.classroomId" required><option v-for="item in roster?.classes" :key="item.id" :value="item.id">Lớp {{ item.classCode }}</option></select></label>
          <div class="m5-form-actions">
            <button class="m5-primary-button" type="submit" :disabled="savingStudent">{{ savingStudent ? 'Đang lưu...' : 'Lưu học sinh' }}</button>
            <button type="button" class="m5-secondary-button" :disabled="savingStudent" @click="closeStudentForm">Hủy</button>
          </div>
        </form>

        <div class="m5-roster-toolbar">
          <label><span>Lọc theo lớp</span><select v-model="selectedClassId"><option value="all">Tất cả lớp ({{ roster?.students.length || 0 }})</option><option v-for="item in roster?.classes" :key="item.id" :value="item.id">Lớp {{ item.classCode }} ({{ item.studentCount }})</option></select></label>
          <button v-if="!createFormOpen" type="button" class="m5-secondary-button" @click="loadRoster"><RefreshCw /> Làm mới</button>
        </div>
        <p v-if="rosterError" class="m5-inline-error">{{ rosterError }}</p>
        <div v-else-if="rosterLoading" class="m5-roster-loading"><span class="m5-loader" /> Đang tải danh sách học sinh...</div>
        <div v-else class="m5-roster-table-wrap">
          <table class="m5-roster-table">
            <thead><tr><th>Học sinh</th><th>Lớp</th><th>Tên đăng nhập</th><th aria-label="Thao tác" /></tr></thead>
            <tbody>
              <template v-for="student in paginatedStudents" :key="student.id">
                <tr :class="{ 'is-editing': editingStudent?.id === student.id }">
                  <td><span class="m5-student-initial">{{ student.displayName.slice(0, 1).toUpperCase() }}</span><strong>{{ student.displayName }}</strong></td>
                  <td>Lớp {{ student.classroomCode }}</td><td><code>{{ student.username }}</code></td>
                  <td class="m5-roster-actions">
                    <button type="button" :title="editingStudent?.id === student.id ? 'Đóng chỉnh sửa' : 'Sửa'" :class="{ 'is-active': editingStudent?.id === student.id }" :disabled="Boolean(busyStudentId)" @click="toggleEditStudent(student)"><Pencil /></button>
                    <button type="button" title="Đặt lại mật khẩu" :disabled="Boolean(busyStudentId)" @click="resetPassword(student)"><KeyRound /></button>
                    <button type="button" title="Xóa học sinh" class="is-danger" :disabled="Boolean(busyStudentId)" @click="deleteStudent(student)"><Trash2 /></button>
                  </td>
                </tr>
                <!-- Inline edit row hiển thị trực tiếp ngay dưới học sinh đang sửa -->
                <tr v-if="editingStudent?.id === student.id" class="m5-roster-inline-edit-row">
                  <td colspan="4" class="m5-roster-inline-edit-cell">
                    <form class="m5-roster-inline-edit-form" @submit.prevent="saveStudent">
                      <div class="m5-inline-edit-header">
                        <div class="m5-inline-edit-title">
                          <Pencil />
                          <span>Chỉnh sửa học sinh: <strong>{{ student.displayName }}</strong> (<code>{{ student.username }}</code>)</span>
                        </div>
                        <button type="button" class="m5-inline-edit-close" title="Đóng chỉnh sửa" @click="closeStudentForm"><X /></button>
                      </div>
                      <div class="m5-inline-edit-grid">
                        <label><span>Họ và tên</span><input v-model="studentForm.displayName" maxlength="80" required autocomplete="off" placeholder="Họ và tên học sinh" /></label>
                        <label><span>Tên đăng nhập</span><input v-model="studentForm.username" pattern="[a-z][a-z0-9]{2,39}" maxlength="40" required autocomplete="off" placeholder="vd: nghiemdt" /></label>
                        <label><span>Lớp</span><select v-model="studentForm.classroomId" required><option v-for="item in roster?.classes" :key="item.id" :value="item.id">Lớp {{ item.classCode }}</option></select></label>
                        <div class="m5-form-actions">
                          <button class="m5-primary-button" type="submit" :disabled="savingStudent">{{ savingStudent ? 'Đang lưu...' : 'Lưu thay đổi' }}</button>
                          <button type="button" class="m5-secondary-button" :disabled="savingStudent" @click="closeStudentForm">Hủy</button>
                        </div>
                      </div>
                    </form>
                  </td>
                </tr>
              </template>
              <tr v-if="!visibleStudents.length"><td colspan="4" class="m5-roster-empty">Chưa có học sinh trong lớp này.</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Phân trang danh sách học sinh -->
        <div v-if="visibleStudents.length > 0" class="m5-roster-pagination">
          <div class="m5-pagination-info">
            <span>Hiển thị <strong>{{ paginationRange.from }} - {{ paginationRange.to }}</strong> trong <strong>{{ paginationRange.total }}</strong> học sinh</span>
            <div class="m5-pagination-size">
              <span>Mỗi trang:</span>
              <select v-model.number="pageSize">
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>
          <nav v-if="totalPages > 1" class="m5-pagination-nav" aria-label="Phân trang danh sách học sinh">
            <button
              type="button"
              class="m5-page-button is-nav"
              :disabled="page <= 1"
              title="Trang trước"
              @click="prevPage"
            >
              <ChevronLeft />
            </button>
            <template v-for="(p, idx) in displayedPages" :key="idx">
              <span v-if="p === '...'" class="m5-page-ellipsis">...</span>
              <button
                v-else
                type="button"
                class="m5-page-button"
                :class="{ 'is-active': p === page }"
                @click="goToPage(p)"
              >
                {{ p }}
              </button>
            </template>
            <button
              type="button"
              class="m5-page-button is-nav"
              :disabled="page >= totalPages"
              title="Trang sau"
              @click="nextPage"
            >
              <ChevronRight />
            </button>
          </nav>
        </div>
      </section>
    </template>
  </div>
</template>
