<script setup lang="ts">
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bookmark,
  Calculator,
  Clock3,
  FlaskConical,
  Gamepad2,
  Heart,
  History,
  Home,
  Lightbulb,
  LogOut,
  MessageCircle,
  Search,
  Sprout,
  UserRound,
  X,
  Zap,
} from 'lucide-vue-next'
import BookSpread from '~/components/math5/BookSpread.vue'
import PhotoQuestionComposer from '~/components/math5/PhotoQuestionComposer.vue'
import WorkReview from '~/components/math5/WorkReview.vue'
import type { StudentQuestion, WorkReview as WorkReviewResult } from '~/types/math5'

definePageMeta({ layout: false, middleware: 'auth' })

useSeoMeta({
  title: 'AI kiểm tra bài làm Toán lớp 5',
  description: 'Chụp bài làm Toán lớp 5 để phát hiện lỗi và nhận gợi ý tự sửa.',
})

type Overlay = 'search' | 'notifications' | 'history' | 'tips' | 'saved' | 'hint' | 'progress' | 'profile' | null

const authStore = useAuthStore()
const overlay = ref<Overlay>(null)
const notice = ref('')
const isSubmitting = ref(false)
const isConfirming = ref(false)
const problemId = ref<string | null>(null)
const confirmedText = ref('')
const unclearSegments = ref<string[]>([])
const needsReview = ref(false)
const ocrReview = ref<HTMLElement | null>(null)
const workReview = ref<WorkReviewResult | null>(null)
const { submit, confirm, review } = useProblem()

const sampleQuestion = 'Đề bài: Một thửa vườn dài 18 m, rộng 12 m. Chia vườn thành các lô 6 m². Hỏi có bao nhiêu lô?\n\nBài làm của em: Diện tích khu vườn là 18 + 12 = 30 m². Số lô là 30 : 6 = 5 (lô).'

const displayName = computed(() => {
  const rawName = authStore.user?.name || 'Chào An!'
  return rawName === 'DEMO' ? 'Chào An!' : rawName
})
const initials = computed(() => displayName.value.replace('Chào ', '').slice(0, 2).toUpperCase())

const subjects = [
  { label: 'Toán lớp 5', icon: Calculator, active: true },
  { label: 'Tiếng Việt', icon: BookOpen, active: false },
  { label: 'Khoa học tự nhiên', icon: Sprout, active: false },
  { label: 'Lịch sử và Địa lí', icon: FlaskConical, active: false },
  { label: 'Tin học', icon: Gamepad2, active: false },
  { label: 'Đạo đức', icon: Heart, active: false },
] as const

const recentLessons = [
  'Bài tập chia hết với 3',
  'Tìm phân số của số',
  'Diện tích hình thang',
  'Số thập phân',
] as const

const utilityCards = [
  { id: 'history', title: 'Lịch sử chữa bài', text: 'Xem lại các bài đã kiểm tra', icon: History, className: 'is-blue' },
  { id: 'tips', title: 'Mẹo học hay', text: 'Bí quyết học tốt mỗi ngày', icon: Lightbulb, className: 'is-yellow' },
  { id: 'saved', title: 'Bài đã lưu', text: 'Xem lại các bài yêu thích', icon: Heart, className: 'is-pink' },
  { id: 'hint', title: 'Gợi ý nhanh', text: 'Các câu hỏi thường gặp', icon: Zap, className: 'is-orange' },
] as const

async function handleSubmit(payload: StudentQuestion) {
  isSubmitting.value = true
  notice.value = ''
  workReview.value = null
  try {
    const recognized = await submit(payload)
    problemId.value = recognized.problemId
    confirmedText.value = recognized.ocrText
    unclearSegments.value = recognized.unclearSegments
    // A readable OCR result can still contain a wrong digit. Always let the learner
    // compare the transcript with the source before sending it for assessment.
    needsReview.value = true
    notice.value = recognized.unclearSegments.length
      ? 'AI cần em kiểm tra vài chỗ chưa đọc rõ trước khi nhận xét.'
      : 'Em xem lại đề và bài làm rồi bấm xác nhận nhé.'
    await nextTick()
    ocrReview.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } catch (error: any) {
    notice.value = error?.data?.statusMessage || error?.message || 'Không thể gửi bài làm. Em hãy thử lại nhé.'
  } finally {
    isSubmitting.value = false
  }
}

async function confirmAndReview() {
  if (!problemId.value) return
  isConfirming.value = true
  notice.value = ''
  try {
    await confirm(problemId.value, confirmedText.value)
    const result = await review(problemId.value)
    workReview.value = result
    if (result.status === 'correct' || result.status === 'has_errors' || result.status === 'no_attempt') {
      unclearSegments.value = []
      needsReview.value = false
    } else {
      unclearSegments.value = [result.nextStep]
      needsReview.value = true
    }
    notice.value = result.summary
  } catch (error: any) {
    notice.value = error?.data?.statusMessage || error?.message || 'Chưa thể kiểm tra bài làm. Em hãy thử lại nhé.'
  } finally {
    isConfirming.value = false
  }
}

function openOverlay(value: Exclude<Overlay, null>) {
  overlay.value = value
}

function handleNavigation(id: string) {
  if (id === 'home' || id === 'questions') {
    document.querySelector('.m5-book-stage')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  openOverlay(id as Exclude<Overlay, null>)
}
</script>

<template>
  <div class="m5-app m5-app--workspace">
    <div class="m5-backdrop" aria-hidden="true" />

    <header class="m5-header m5-header--workspace">
      <button class="m5-brand" type="button" aria-label="Trang chủ" @click="handleNavigation('home')">
        <img src="/math5/decorations/book-badge.svg" alt="" width="47" height="47" />
        <span><strong>Học cùng bạn <em>✨</em></strong><small>Dành cho học sinh Tiểu học</small></span>
      </button>

      <nav class="m5-top-nav" aria-label="Điều hướng chính">
        <button class="is-active" type="button" @click="handleNavigation('home')"><Home /> Trang chủ</button>
        <button type="button" @click="handleNavigation('questions')"><MessageCircle /> AI chữa bài</button>
        <button type="button" @click="openOverlay('history')"><History /> Lịch sử chữa bài</button>
        <button type="button" @click="openOverlay('tips')"><Lightbulb /> Mẹo học hay</button>
      </nav>

      <div class="m5-header__right">
        <button type="button" aria-label="Tìm kiếm" @click="openOverlay('search')"><Search :size="20" /></button>
        <button type="button" aria-label="Thông báo" @click="openOverlay('notifications')"><Bell :size="20" /><i /></button>
        <button class="m5-profile-button" type="button" @click="openOverlay('profile')">
          <span class="m5-avatar">{{ initials }}</span>
          <span><strong>Lớp 5</strong><small>{{ displayName }}</small></span>
        </button>
      </div>
    </header>

    <main class="m5-workspace">
      <aside class="m5-left-rail" aria-label="Môn học">
        <h2>Môn học</h2>
        <nav class="m5-subject-list">
          <button v-for="subject in subjects" :key="subject.label" type="button" :class="{ 'is-active': subject.active }" @click="openOverlay('tips')">
            <component :is="subject.icon" aria-hidden="true" />
            <span>{{ subject.label }}</span>
          </button>
        </nav>
        <div class="m5-recent-lessons">
          <h3>Gần đây</h3>
          <button v-for="lesson in recentLessons" :key="lesson" type="button" @click="openOverlay('history')">
            <Clock3 aria-hidden="true" />
            <span>{{ lesson }}</span>
          </button>
          <button class="m5-recent-lessons__all" type="button" @click="openOverlay('history')">Xem tất cả <ArrowRight /></button>
        </div>
      </aside>

      <div class="m5-learning-area">
        <div class="m5-quick-row" aria-label="Tiện ích học tập">
          <button v-for="card in utilityCards" :key="card.id" type="button" class="m5-utility-card" :class="card.className" @click="openOverlay(card.id)">
            <span class="m5-utility-card__icon"><component :is="card.icon" /></span>
            <strong>{{ card.title }}</strong>
          </button>
        </div>

        <section class="m5-book-stage" aria-label="Bài học hiện tại">
          <!-- <CatMascot class="m5-book-cat" pose="books" /> -->
          <BookSpread>
          <template #question>
            <p class="m5-book-subtitle">Chụp cả đề và phần em đã làm để AI tìm chỗ cần sửa</p>
            <div class="m5-problem">
              <div class="m5-problem__topline">
                <span class="m5-problem__label">Ví dụ bài làm cần kiểm tra</span>
                <img src="/math5/decorations/leaf-sprig.svg" alt="" width="28" height="28" />
              </div>
              <p>{{ sampleQuestion }}</p>
              <img class="m5-problem__art" src="/math5/diagrams/garden-18x12.svg" alt="Sơ đồ khu vườn dài 18 mét, rộng 12 mét" />
            </div>
            <PhotoQuestionComposer :pending="isSubmitting" @submit="handleSubmit" />
            <div v-if="problemId && needsReview" ref="ocrReview" class="m5-ocr-review" tabindex="-1">
              <div class="m5-ocr-review__heading"><span aria-hidden="true">🔎</span><div><strong>Xác nhận đề và bài làm</strong><small>Hãy sửa phần AI đọc sai chữ; đừng sửa lỗi Toán em muốn AI kiểm tra.</small></div></div>
              <div v-if="unclearSegments.length" class="m5-ocr-review__warning" role="alert"><strong>AI chưa chắc ở:</strong><ul><li v-for="segment in unclearSegments" :key="segment">{{ segment }}</li></ul></div>
              <textarea v-model="confirmedText" rows="5" maxlength="5000" :disabled="isConfirming" aria-label="Xác nhận đề và bài làm" />
              <button type="button" :disabled="isConfirming" @click="confirmAndReview">
                {{ isConfirming ? 'Đang kiểm tra bài...' : 'Nội dung đúng rồi, kiểm tra bài' }}
              </button>
            </div>
          </template>

          <template #answer>
            <p class="m5-book-subtitle">AI chỉ ra lỗi và gợi ý để em tự sửa:</p>
            <WorkReview :review="workReview" :pending="isConfirming" />
          </template>
          </BookSpread>
          <p v-if="notice" class="m5-notice" role="status">{{ notice }}</p>
        </section>
      </div>
    </main>

    <nav class="m5-bottom-nav" aria-label="Điều hướng mobile">
      <button class="is-current" type="button" @click="handleNavigation('home')"><Home /><span>Trang chủ</span></button>
      <button type="button" @click="handleNavigation('questions')"><MessageCircle /><span>Chữa bài</span></button>
      <button type="button" @click="openOverlay('history')"><Bookmark /><span>Lịch sử</span></button>
      <button type="button" @click="openOverlay('tips')"><Bell /><span>Mẹo hay</span></button>
      <button type="button" @click="openOverlay('profile')"><UserRound /><span>Hồ sơ</span></button>
    </nav>

    <Teleport to="body">
      <div v-if="overlay" class="m5-overlay" role="presentation" @click.self="overlay = null">
        <section class="m5-dialog" role="dialog" aria-modal="true">
          <button class="m5-dialog__close" type="button" aria-label="Đóng" @click="overlay = null"><X :size="22" /></button>
          <template v-if="overlay === 'profile'">
            <span class="m5-avatar m5-avatar--large">{{ initials }}</span>
            <h2>{{ displayName }}</h2>
            <p class="m5-dialog__email">{{ authStore.user?.email }}</p>
            <button class="m5-dialog__logout" type="button" @click="authStore.logout"><LogOut :size="18" /> Đăng xuất</button>
          </template>
          <template v-else-if="overlay === 'search'">
            <span class="m5-dialog__icon"><Search /></span><h2>Tìm bài đã học</h2>
            <label class="m5-dialog__field"><span>Từ khóa</span><input autofocus placeholder="Nhập tên bài hoặc chủ đề..." /></label>
            <p class="m5-dialog__empty">Chưa có lịch sử để tìm kiếm.</p>
          </template>
          <template v-else>
            <span class="m5-dialog__icon"><Lightbulb /></span>
            <h2>{{ overlay === 'notifications' ? 'Thông báo' : overlay === 'progress' ? 'Theo dõi tiến bộ' : 'Góc học tập' }}</h2>
            <div class="m5-dialog__message">Tính năng này đang chờ kết nối dữ liệu thật. Em tiếp tục học với bài mẫu nhé!</div>
          </template>
        </section>
      </div>
    </Teleport>
  </div>
</template>
