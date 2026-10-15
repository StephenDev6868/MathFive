<script setup lang="ts">
import { CheckCircle2, RotateCcw, Send, Sparkles } from 'lucide-vue-next'
import type { ReviewIssue, WorkReview } from '~/types/math5'

type RetryTask = {
  id: string
  label: string
  kind: 'cloze' | 'short-answer'
  prefix?: string
  suffix?: string
  prompt: string
  hint: string
}

const props = withDefaults(defineProps<{
  review: WorkReview
  pending?: boolean
  attemptCount?: number
}>(), { pending: false, attemptCount: 0 })

const emit = defineEmits<{
  submit: [answer: string]
}>()
const responses = ref<string[]>([])
const localError = ref('')

function equationTask(issue: ReviewIssue, index: number): RetryTask | null {
  const work = issue.studentWork.replace(/\s+/g, ' ').trim()
  const equalsAt = work.lastIndexOf('=')
  if (equalsAt < 1 || equalsAt === work.length - 1) return null

  const rightSide = work.slice(equalsAt + 1).trim()
  const result = rightSide.match(/^([+-]?(?:\d+\s*\/\s*\d+|(?:\d{1,3}(?:[ .]\d{3})+|\d+)(?:[,.]\d+)?))\s*(.*)$/u)
  if (!result) return null
  const suffix = result[2]?.trim() || ''
  if (/[\d+×x:*÷/=]/u.test(suffix)) return null

  return {
    id: `${index}-${issue.location}-${issue.studentWork}`,
    label: issue.location,
    kind: 'cloze',
    prefix: `${work.slice(0, equalsAt).trim()} =`,
    suffix,
    prompt: 'Điền kết quả đúng vào ô trống',
    hint: issue.hint,
  }
}

const tasks = computed<RetryTask[]>(() => {
  if (!props.review.issues.length) {
    return [{
      id: `next-${props.review.nextStep}`,
      label: 'Bước tiếp theo',
      kind: 'short-answer',
      prompt: props.review.nextStep,
      hint: 'Viết ngắn gọn phép tính hoặc kết quả em tự tìm được.',
    }]
  }

  return props.review.issues.map((issue, index) => equationTask(issue, index) || ({
    id: `${index}-${issue.location}-${issue.studentWork}`,
    label: issue.location,
    kind: 'short-answer' as const,
    prompt: `Viết lại phần “${issue.location}”`,
    hint: issue.hint,
  }))
})

const taskVersion = computed(() => `${props.attemptCount}:${tasks.value.map(task => task.id).join('|')}`)
watch(taskVersion, () => {
  responses.value = tasks.value.map(() => '')
  localError.value = ''
}, { immediate: true })

function updateResponse(index: number, event: Event) {
  responses.value[index] = (event.target as HTMLInputElement).value
  localError.value = ''
}

function submitAttempt() {
  const emptyTask = tasks.value.findIndex((_, index) => !responses.value[index]?.trim())
  if (emptyTask >= 0) {
    localError.value = tasks.value.length > 1
      ? `Em hãy hoàn thành ô số ${emptyTask + 1} trước khi nộp nhé.`
      : 'Em hãy điền câu trả lời trước khi nộp nhé.'
    return
  }

  const answer = tasks.value.map((task, index) => {
    const value = responses.value[index]!.trim()
    if (task.kind === 'cloze') {
      return `${task.prefix} ${value}${task.suffix ? ` ${task.suffix}` : ''}`
    }
    return `${task.label}: ${value}`
  }).join('\n')
  emit('submit', answer)
}
</script>

<template>
  <section v-if="review.status !== 'correct'" class="m5-retry" aria-labelledby="m5-retry-title">
    <div class="m5-retry__heading">
      <span><RotateCcw :size="18" aria-hidden="true" /></span>
      <div>
        <h3 id="m5-retry-title">Đến lượt em sửa lại</h3>
        <p>AI đã tạo bài điền khuyết từ chính chỗ em làm chưa đúng.</p>
      </div>
    </div>

    <div class="m5-retry__tasks">
      <article v-for="(task, index) in tasks" :key="task.id" class="m5-retry-task">
        <div class="m5-retry-task__meta">
          <span v-if="tasks.length > 1">Ô {{ index + 1 }}</span>
          <strong>{{ task.label }}</strong>
        </div>
        <p class="m5-retry-task__prompt"><Sparkles :size="14" /> {{ task.prompt }}</p>
        <label v-if="task.kind === 'cloze'" class="m5-retry-task__equation">
          <span>{{ task.prefix }}</span>
          <input
            :value="responses[index]"
            inputmode="decimal"
            autocomplete="off"
            maxlength="80"
            :disabled="pending"
            :aria-label="`Điền kết quả cho ${task.label}`"
            placeholder="?"
            @input="updateResponse(index, $event)"
          />
          <span v-if="task.suffix">{{ task.suffix }}</span>
        </label>
        <label v-else class="m5-retry-task__short">
          <span class="m5-sr-only">Câu trả lời cho {{ task.label }}</span>
          <input
            :value="responses[index]"
            autocomplete="off"
            maxlength="500"
            :disabled="pending"
            placeholder="Viết phép tính hoặc câu trả lời của em..."
            @input="updateResponse(index, $event)"
          />
        </label>
        <small><b>Gợi ý:</b> {{ task.hint }}</small>
      </article>
    </div>

    <p v-if="localError" class="m5-retry__error" role="alert">{{ localError }}</p>
    <button class="m5-retry__submit" type="button" :disabled="pending" @click="submitAttempt">
      <span v-if="pending" class="m5-spinner" aria-hidden="true" />
      <Send v-else :size="17" aria-hidden="true" />
      {{ pending ? 'AI đang chấm lại...' : 'Nộp đáp án để AI chấm' }}
    </button>
    <small v-if="attemptCount" class="m5-retry__count">Đã chấm lại {{ attemptCount }} lần. Em có thể tiếp tục sửa nếu chưa đúng.</small>
  </section>

  <div v-else-if="attemptCount" class="m5-retry-success" role="status">
    <CheckCircle2 :size="21" aria-hidden="true" />
    <div><strong>Em đã tự sửa đúng rồi!</strong><span>AI đã chấm phần em vừa điền.</span></div>
  </div>
</template>
