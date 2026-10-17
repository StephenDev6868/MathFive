<script setup lang="ts">
import { CheckCircle2, RotateCcw, Send, Sparkles } from 'lucide-vue-next'
import type { WorkReview } from '~/types/math5'

type RetryTask = {
  id: string
  label: string
  prompt: string
  hint: string
  inputType: 'math' | 'explanation' | 'solution'
}

type FractionPart = { numerator: string, denominator: string }
type SolutionPart = { calculation: string, explanation: string }

const mathSymbols = [
  { value: '+', label: 'Dấu cộng' },
  { value: '−', label: 'Dấu trừ' },
  { value: '×', label: 'Dấu nhân' },
  { value: '÷', label: 'Dấu chia' },
  { value: '=', label: 'Dấu bằng' },
  { value: '(', label: 'Mở ngoặc' },
  { value: ')', label: 'Đóng ngoặc' },
  { value: '%', label: 'Phần trăm' },
  { value: '²', label: 'Bình phương' },
  { value: '√', label: 'Căn bậc hai' },
]

const props = withDefaults(defineProps<{
  review: WorkReview
  pending?: boolean
  attemptCount?: number
}>(), { pending: false, attemptCount: 0 })

const emit = defineEmits<{
  submit: [answer: string]
}>()
const responses = ref<string[]>([])
const fractions = ref<FractionPart[]>([])
const solutions = ref<SolutionPart[]>([])
const localError = ref('')

const tasks = computed<RetryTask[]>(() => {
  if (props.review.retryTasks?.length) {
    return props.review.retryTasks.map((task, index) => ({
      id: `${index}-${task.title}-${task.instruction}`,
      label: task.title,
      prompt: task.instruction,
      hint: task.hint,
      inputType: task.responseType || 'explanation',
    }))
  }
  if (!props.review.issues.length) {
    return [{
      id: `next-${props.review.nextStep}`,
      label: 'Bước tiếp theo',
      prompt: props.review.nextStep,
      hint: 'Viết ngắn gọn phép tính hoặc kết quả em tự tìm được.',
      inputType: 'math',
    }]
  }

  return props.review.issues.map((issue, index) => ({
    id: `${index}-${issue.location}-${issue.studentWork}`,
    label: issue.location,
    prompt: `Làm lại phần “${issue.location}” theo gợi ý`,
    hint: issue.hint,
    inputType: issue.errorType === 'calculation'
      ? 'math'
      : issue.errorType === 'reasoning'
        ? 'solution'
        : 'explanation',
  }))
})

const taskVersion = computed(() => `${props.attemptCount}:${tasks.value.map(task => task.id).join('|')}`)
watch(taskVersion, () => {
  responses.value = tasks.value.map(() => '')
  fractions.value = tasks.value.map(() => ({ numerator: '', denominator: '' }))
  solutions.value = tasks.value.map(() => ({ calculation: '', explanation: '' }))
  localError.value = ''
}, { immediate: true })

function updateResponse(index: number, event: Event) {
  responses.value[index] = (event.target as HTMLInputElement | HTMLTextAreaElement).value
  localError.value = ''
}

function addSymbol(index: number, symbol: string) {
  if (tasks.value[index]?.inputType === 'solution') {
    const solution = solutions.value[index]!
    solution.calculation = `${solution.calculation}${symbol}`
    syncSolution(index)
    return
  }
  responses.value[index] = `${responses.value[index] || ''}${symbol}`
  localError.value = ''
}

function updateSolution(index: number, field: keyof SolutionPart, event: Event) {
  solutions.value[index]![field] = (event.target as HTMLInputElement | HTMLTextAreaElement).value
  syncSolution(index)
}

function syncSolution(index: number) {
  const solution = solutions.value[index]!
  responses.value[index] = `Phép tính: ${solution.calculation}\nLời giải: ${solution.explanation}`.trim()
  localError.value = ''
}

function addFraction(index: number) {
  const fraction = fractions.value[index]
  if (!fraction?.numerator.trim() || !fraction.denominator.trim()) {
    localError.value = 'Em điền cả tử số và mẫu số rồi chèn phân số nhé.'
    return
  }
  addSymbol(index, `(${fraction.numerator}/${fraction.denominator})`)
  fractions.value[index] = { numerator: '', denominator: '' }
}

function formatMath(value: string) {
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped.replace(/\(?(-?\d+(?:[,.]\d+)?)\s*\/\s*(-?\d+(?:[,.]\d+)?)\)?/g, (_match, numerator, denominator) => (
    `<span class="m5-math-fraction"><sup>${numerator}</sup><i></i><sub>${denominator}</sub></span>`
  )) || '<span class="m5-math-preview__placeholder">Ví dụ: 2/3 sẽ hiện thành phân số</span>'
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
        <p>Làm từng bước theo gợi ý rồi tự kiểm tra lại nhé.</p>
      </div>
    </div>

    <div class="m5-retry__tasks">
      <article v-for="(task, index) in tasks" :key="task.id" class="m5-retry-task">
        <div class="m5-retry-task__meta">
          <span v-if="tasks.length > 1">Ô {{ index + 1 }}</span>
          <strong>{{ task.label }}</strong>
        </div>
        <p class="m5-retry-task__prompt"><Sparkles :size="14" /> {{ task.prompt }}</p>
        <input type="hidden" :value="responses[index]" :name="`retry-answer-${index}`" />
        <div class="m5-notebook-paper" :class="`is-${task.inputType}`">
          <template v-if="task.inputType === 'solution'">
            <div class="m5-notebook-paper__line m5-notebook-paper__line--solution">
              <strong>Lời giải:</strong>
              <textarea
                :value="solutions[index]?.explanation || ''"
                :disabled="pending"
                class="m5-notebook-paper__native-text"
                rows="2"
                placeholder="Em viết lời giải và câu trả lời ở đây..."
                aria-label="Viết lại lời giải"
                @input="updateSolution(index, 'explanation', $event)"
              />
            </div>
            <div class="m5-notebook-paper__line m5-notebook-paper__line--calculation">
              <strong>Phép tính:</strong>
              <div class="m5-math-preview">
                <div v-html="formatMath(solutions[index]?.calculation || '')" aria-hidden="true" />
                <input
                  :value="solutions[index]?.calculation || ''"
                  :disabled="pending"
                  class="m5-math-preview__input"
                  inputmode="text"
                  aria-label="Viết phép tính"
                  @input="updateSolution(index, 'calculation', $event)"
                />
              </div>
            </div>
          </template>
          <template v-else-if="task.inputType === 'math'">
            <div class="m5-math-preview m5-math-preview--full">
              <div v-html="formatMath(responses[index] || '')" aria-hidden="true" />
              <input
                :value="responses[index]"
                :disabled="pending"
                class="m5-math-preview__input"
                inputmode="text"
                :aria-label="`Phép tính cho ${task.label}`"
                @input="updateResponse(index, $event)"
              />
            </div>
          </template>
          <textarea
            v-else
            :value="responses[index]"
            :disabled="pending"
            class="m5-notebook-paper__native-text m5-notebook-paper__native-text--full"
            rows="4"
            placeholder="Em viết câu trả lời của mình ở đây..."
            :aria-label="`Câu trả lời cho ${task.label}`"
            @input="updateResponse(index, $event)"
          />
        </div>
        <div v-if="task.inputType !== 'explanation'" class="m5-math-input">
          <div class="m5-math-input__tools" aria-label="Ký hiệu toán học">
            <button
              v-for="symbol in mathSymbols"
              :key="symbol.value"
              type="button"
              :disabled="pending"
              :aria-label="symbol.label"
              @click="addSymbol(index, symbol.value)"
            >{{ symbol.value }}</button>
          </div>
          <div class="m5-fraction" aria-label="Nhập phân số">
            <span class="m5-fraction__label">Phân số</span>
            <div class="m5-fraction__fields">
              <input v-model="fractions[index].numerator" :disabled="pending" inputmode="numeric" maxlength="20" aria-label="Tử số" placeholder="Tử" />
              <i aria-hidden="true" />
              <input v-model="fractions[index].denominator" :disabled="pending" inputmode="numeric" maxlength="20" aria-label="Mẫu số" placeholder="Mẫu" />
            </div>
            <button type="button" :disabled="pending" @click="addFraction(index)">Chèn phân số</button>
          </div>
        </div>
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
