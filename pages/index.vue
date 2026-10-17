<script setup lang="ts">
import {
  ArrowRight,
  Bell,
  Bookmark,
  Calculator,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  Heart,
  History,
  Home,
  Lightbulb,
  LogOut,
  MessageCircle,
  Search,
  UserRound,
  X,
  Zap,
} from 'lucide-vue-next'
import { onBeforeUnmount, onMounted } from 'vue'
import BookSpread from '~/components/math5/BookSpread.vue'
import MathTipsLibrary from '~/components/math5/MathTipsLibrary.vue'
import PhotoQuestionComposer from '~/components/math5/PhotoQuestionComposer.vue'
import RetryAttemptForm from '~/components/math5/RetryAttemptForm.vue'
import WorkReview from '~/components/math5/WorkReview.vue'
import type { ProblemHistoryItem, ReviewProvider, StudentQuestion, WorkReview as WorkReviewResult } from '~/types/math5'

definePageMeta({ layout: false, middleware: 'auth' })

useSeoMeta({
  title: 'AI kiểm tra bài làm Toán lớp 5',
  description: 'Chụp bài làm Toán lớp 5 để phát hiện lỗi và nhận gợi ý tự sửa.',
})

type Overlay = 'notifications' | 'history' | 'tips' | 'saved' | 'hint' | 'progress' | 'profile' | null

const authStore = useAuthStore()
const overlay = ref<Overlay>(null)
const notice = ref('')
const isSubmitting = ref(false)
const isConfirming = ref(false)
const isRetrying = ref(false)
const problemId = ref<string | null>(null)
const confirmedText = ref('')
const unclearSegments = ref<string[]>([])
const needsReview = ref(false)
const ocrReview = ref<HTMLElement | null>(null)
const workReview = ref<WorkReviewResult | null>(null)
const reviewProvider = ref<ReviewProvider>('openai')
const inputOrigin = ref<'image' | 'text' | null>(null)
const problemImageUrls = ref<string[]>([])
const attemptCount = ref(0)
const historyItems = ref<ProblemHistoryItem[]>([])
const historyLoading = ref(false)
const historyLoaded = ref(false)
const historyError = ref('')
const historySearch = ref('')
const expandedHistoryId = ref<string | null>(null)
const { submit, confirm, review, retry, history } = useProblem()

const displayProblemText = computed(() => confirmedText.value.trim())
const displayProblemLines = computed(() => displayProblemText.value.split(/\r?\n/).filter(Boolean))
const recentHistory = computed(() => historyItems.value.slice(0, 4))
const filteredHistory = computed(() => {
  const keyword = historySearch.value.trim().toLocaleLowerCase('vi')
  if (!keyword) return historyItems.value
  return historyItems.value.filter(item => [item.title, item.confirmedText, item.review?.summary]
    .filter(Boolean)
    .some(value => String(value).toLocaleLowerCase('vi').includes(keyword)))
})

const displayName = computed(() => {
  const rawName = authStore.user?.name || 'Chào An!'
  return rawName === 'DEMO' ? 'Chào An!' : rawName
})
const initials = computed(() => displayName.value.replace('Chào ', '').slice(0, 2).toUpperCase())

const subjects = [
  { label: 'Toán lớp 5', icon: Calculator, active: true },
] as const

const utilityCards = [
  { id: 'history', title: 'Lịch sử chữa bài', text: 'Xem lại các bài đã kiểm tra', icon: History, className: 'is-blue' },
  { id: 'tips', title: 'Mẹo học hay', text: 'Bí quyết học tốt mỗi ngày', icon: Lightbulb, className: 'is-yellow' },
  { id: 'saved', title: 'Bài đã lưu', text: 'Xem lại các bài yêu thích', icon: Heart, className: 'is-pink' },
  { id: 'hint', title: 'Gợi ý nhanh', text: 'Các câu hỏi thường gặp', icon: Zap, className: 'is-orange' },
] as const

function setProblemImages(images: File[]) {
  problemImageUrls.value.forEach(URL.revokeObjectURL)
  problemImageUrls.value = images.map(image => URL.createObjectURL(image))
}

function handleDraft(payload: Pick<StudentQuestion, 'question' | 'images'>) {
  // While preparing a new submission, let the learner see exactly what will be sent.
  // Once OCR has returned, confirmedText becomes the source of truth instead.
  if (problemId.value) return
  inputOrigin.value = payload.images.length ? 'image' : payload.question.trim() ? 'text' : null
  setProblemImages(payload.images)
  confirmedText.value = payload.question
}

onBeforeUnmount(() => {
  problemImageUrls.value.forEach(URL.revokeObjectURL)
})

onMounted(() => {
  void loadHistory()
})

async function loadHistory(force = false) {
  if (historyLoading.value || (historyLoaded.value && !force)) return
  historyLoading.value = true
  historyError.value = ''
  try {
    historyItems.value = await history(30)
    historyLoaded.value = true
  } catch (error: any) {
    historyError.value = error?.data?.statusMessage || error?.message || 'Chưa thể tải lịch sử chữa bài.'
  } finally {
    historyLoading.value = false
  }
}

function openHistory(problemId?: string) {
  expandedHistoryId.value = problemId || null
  overlay.value = 'history'
  void loadHistory()
}

function formatHistoryDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(new Date(value))
}

function historyStatusLabel(status: string) {
  return ({
    correct: 'Đã sửa đúng',
    incorrect: 'Cần sửa tiếp',
    has_errors: 'Có lỗi cần sửa',
    needs_review: 'Cần xem lại',
    no_attempt: 'Chưa làm bài',
    reviewed: 'Đã nhận xét',
    recognized: 'Đã đọc bài',
    draft: 'Bản nháp',
    failed: 'Chưa hoàn tất',
    ungraded: 'Chưa chấm',
  } as Record<string, string>)[status] || 'Đang xử lý'
}

async function handleSubmit(payload: StudentQuestion) {
  isSubmitting.value = true
  notice.value = ''
  workReview.value = null
  attemptCount.value = 0
  try {
    const recognized = await submit(payload)
    problemId.value = recognized.problemId
    reviewProvider.value = payload.provider
    inputOrigin.value = payload.images.length ? 'image' : 'text'
    setProblemImages(payload.images)
    confirmedText.value = recognized.ocrText
    unclearSegments.value = recognized.unclearSegments
    // A readable OCR result can still contain a wrong digit. Always let the learner
    // compare the transcript with the source before sending it for assessment.
    needsReview.value = true
    notice.value = recognized.unclearSegments.length
      ? 'AI cần em kiểm tra vài chỗ chưa đọc rõ trước khi nhận xét.'
      : 'Em xem lại đề và bài làm rồi bấm xác nhận nhé.'
    void loadHistory(true)
    await nextTick()
    ocrReview.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } catch (error: any) {
    notice.value = error?.data?.statusMessage || error?.message || 'Không thể gửi bài làm. Em hãy thử lại nhé.'
  } finally {
    isSubmitting.value = false
  }
}

async function submitRetryAttempt(answer: string) {
  if (!problemId.value || !workReview.value || !answer.trim()) return
  isRetrying.value = true
  notice.value = ''
  try {
    const result = await retry(problemId.value, answer.trim(), reviewProvider.value)
    workReview.value = result
    attemptCount.value += 1
    notice.value = result.status === 'correct'
      ? 'Tuyệt vời! Em đã tự sửa đúng bài làm.'
      : result.summary
    void loadHistory(true)
  } catch (error: any) {
    notice.value = error?.data?.statusMessage || error?.message || 'Chưa thể chấm bài làm lại. Em hãy thử lại nhé.'
  } finally {
    isRetrying.value = false
  }
}

async function confirmAndReview() {
  if (!problemId.value) return
  isConfirming.value = true
  notice.value = ''
  try {
    await confirm(problemId.value, confirmedText.value)
    const result = await review(problemId.value, reviewProvider.value)
    workReview.value = result
    if (result.status === 'correct' || result.status === 'has_errors' || result.status === 'no_attempt') {
      unclearSegments.value = []
      needsReview.value = false
    } else {
      unclearSegments.value = [result.nextStep]
      needsReview.value = true
    }
    notice.value = result.summary
    void loadHistory(true)
  } catch (error: any) {
    notice.value = error?.data?.statusMessage || error?.message || 'Chưa thể kiểm tra bài làm. Em hãy thử lại nhé.'
  } finally {
    isConfirming.value = false
  }
}

function openOverlay(value: Exclude<Overlay, null>) {
  if (value === 'history') {
    openHistory()
    return
  }
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
        <button type="button" aria-label="Tìm lịch sử chữa bài" @click="openHistory()"><Search :size="20" /></button>
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
          <p v-if="historyLoading && !recentHistory.length" class="m5-recent-lessons__state">Đang tải lịch sử...</p>
          <button v-for="item in recentHistory" :key="item.problemId" type="button" @click="openHistory(item.problemId)">
            <Clock3 aria-hidden="true" />
            <span><strong>{{ item.title }}</strong><small>{{ formatHistoryDate(item.createdAt) }}</small></span>
          </button>
          <p v-if="!historyLoading && !recentHistory.length" class="m5-recent-lessons__state">Chưa có bài đã gửi.</p>
          <button class="m5-recent-lessons__all" type="button" @click="openHistory()">Xem tất cả <ArrowRight /></button>
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
            <div class="m5-problem m5-problem--live" :class="{ 'is-ready': Boolean(displayProblemText || problemImageUrls.length) }">
              <div class="m5-problem__topline">
                <span class="m5-problem__label">
                  {{ inputOrigin === 'image' ? 'Bài làm đọc từ ảnh' : inputOrigin === 'text' ? 'Bài làm em đã nhập' : 'Bài làm của em' }}
                </span>
                <span v-if="displayProblemText" class="m5-problem__source">
                  {{ inputOrigin === 'image' ? 'Kết quả OCR' : 'Nội dung gốc' }}
                </span>
              </div>
              <template v-if="displayProblemText || problemImageUrls.length">
                <div v-if="displayProblemText" class="m5-problem__content" aria-label="Nội dung bài làm">
                  <p v-for="(line, index) in displayProblemLines" :key="`${index}-${line}`">{{ line }}</p>
                </div>
                <p v-else class="m5-problem__waiting-copy">Ảnh bài làm đã sẵn sàng. Bấm “Kiểm tra bài làm” để AI đọc nội dung.</p>
                <div v-if="problemImageUrls.length" class="m5-problem__images">
                  <figure v-for="(imageUrl, index) in problemImageUrls" :key="imageUrl" class="m5-problem__image">
                    <img :src="imageUrl" :alt="`Ảnh bài làm ${index + 1}`" />
                    <figcaption>Ảnh {{ index + 1 }}</figcaption>
                  </figure>
                </div>
              </template>
              <div v-else class="m5-problem__placeholder">
                <FileText :size="25" aria-hidden="true" />
                <p>Đề bài và phần em đã làm sẽ hiện ở đây sau khi gửi.</p>
              </div>
            </div>
            <PhotoQuestionComposer :pending="isSubmitting" @draft="handleDraft" @submit="handleSubmit" />
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
            <RetryAttemptForm
              v-if="workReview"
              :review="workReview"
              :pending="isRetrying"
              :attempt-count="attemptCount"
              @submit="submitRetryAttempt"
            />
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
        <section class="m5-dialog" :class="{ 'm5-dialog--history': overlay === 'history', 'm5-dialog--tips': overlay === 'tips' }" role="dialog" aria-modal="true">
          <button class="m5-dialog__close" type="button" aria-label="Đóng" @click="overlay = null"><X :size="22" /></button>
          <template v-if="overlay === 'profile'">
            <span class="m5-avatar m5-avatar--large">{{ initials }}</span>
            <h2>{{ displayName }}</h2>
            <p class="m5-dialog__email">{{ authStore.user?.email }}</p>
            <button class="m5-dialog__logout" type="button" @click="authStore.logout"><LogOut :size="18" /> Đăng xuất</button>
          </template>
          <template v-else-if="overlay === 'history'">
            <span class="m5-dialog__icon"><History /></span><h2>Lịch sử chữa bài</h2>
            <label class="m5-dialog__field m5-history-search">
              <span>Tìm trong bài đã gửi</span>
              <div><Search :size="17" /><input v-model="historySearch" autofocus placeholder="Nhập nội dung bài toán..." /></div>
            </label>
            <p v-if="historyLoading" class="m5-dialog__empty">Đang tải dữ liệu thật...</p>
            <p v-else-if="historyError" class="m5-dialog__empty is-error">{{ historyError }}</p>
            <p v-else-if="!filteredHistory.length" class="m5-dialog__empty">
              {{ historySearch ? 'Không tìm thấy bài phù hợp.' : 'Em chưa gửi bài nào để chữa.' }}
            </p>
            <div v-else class="m5-history-list">
              <article v-for="item in filteredHistory" :key="item.problemId" class="m5-history-item" :class="{ 'is-open': expandedHistoryId === item.problemId }">
                <button class="m5-history-item__summary" type="button" @click="expandedHistoryId = expandedHistoryId === item.problemId ? null : item.problemId">
                  <span class="m5-history-item__topline">
                    <small class="m5-history-status" :class="`is-${item.status}`">{{ historyStatusLabel(item.status) }}</small>
                    <time :datetime="item.createdAt">{{ formatHistoryDate(item.createdAt) }}</time>
                  </span>
                  <strong>{{ item.title }}</strong>
                  <span class="m5-history-item__preview">{{ item.review?.summary || 'Bài đang chờ AI nhận xét.' }}</span>
                  <ChevronUp v-if="expandedHistoryId === item.problemId" :size="17" />
                  <ChevronDown v-else :size="17" />
                </button>
                <div v-if="expandedHistoryId === item.problemId" class="m5-history-thread">
                  <section class="m5-history-message is-student">
                    <b>🧒 Bài em đã gửi</b>
                    <p>{{ item.confirmedText }}</p>
                  </section>
                  <section v-if="item.review" class="m5-history-message is-ai">
                    <b>✨ AI nhận xét · {{ item.review.provider === 'gemini' ? 'Gemini' : 'OpenAI' }}</b>
                    <p>{{ item.review.summary }}</p>
                    <ul v-if="item.review.issues.length"><li v-for="issue in item.review.issues" :key="`${issue.location}-${issue.studentWork}`"><strong>{{ issue.location }}:</strong> {{ issue.explanation }}</li></ul>
                  </section>
                  <template v-for="(attempt, index) in item.attempts" :key="`${attempt.createdAt}-${index}`">
                    <section class="m5-history-message is-student is-retry">
                      <b>🔁 Em làm lại · lần {{ index + 1 }}</b>
                      <p>{{ attempt.submittedAnswer }}</p>
                      <small>{{ historyStatusLabel(attempt.verdict) }} · {{ formatHistoryDate(attempt.createdAt) }}</small>
                    </section>
                    <section v-if="attempt.feedback" class="m5-history-message is-ai">
                      <b>✨ AI chấm lại</b>
                      <p>{{ attempt.feedback }}</p>
                    </section>
                  </template>
                </div>
              </article>
            </div>
          </template>
          <template v-else-if="overlay === 'tips'">
            <MathTipsLibrary />
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
