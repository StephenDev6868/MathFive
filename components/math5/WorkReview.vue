<script setup lang="ts">
import { AlertTriangle, CheckCircle2, Lightbulb, PencilLine, SearchCheck, Sparkles } from 'lucide-vue-next'
import type { WorkReview } from '~/types/math5'

const props = withDefaults(defineProps<{
  review?: WorkReview | null
  pending?: boolean
}>(), { review: null, pending: false })

const statusLabel = computed(() => ({
  correct: 'Bài làm đúng',
  has_errors: 'Có chỗ cần sửa',
  needs_review: 'Cần xem lại nội dung',
  no_attempt: 'Chưa thấy bài làm',
}[props.review?.status || 'no_attempt']))

const issueLabels = {
  copied_data: 'Chép dữ kiện',
  reasoning: 'Cách suy luận',
  calculation: 'Phép tính',
  unit: 'Đơn vị',
  notation: 'Trình bày',
  other: 'Chỗ cần sửa',
} as const
</script>

<template>
  <div class="m5-review" aria-live="polite">
    <p v-if="pending" class="m5-review__pending"><Sparkles :size="19" /> AI đang đối chiếu từng dòng em làm...</p>
    <div v-else-if="!review" class="m5-review__empty">
      <SearchCheck :size="34" aria-hidden="true" />
      <strong>Gửi ảnh bài làm để bắt đầu</strong>
      <span>AI sẽ tìm chỗ sai và gợi ý để em tự sửa, không đưa sẵn bài giải.</span>
    </div>
    <template v-else>
      <div class="m5-review__summary" :class="`is-${review.status}`">
        <CheckCircle2 v-if="review.status === 'correct'" :size="22" aria-hidden="true" />
        <AlertTriangle v-else :size="22" aria-hidden="true" />
        <div><strong>{{ statusLabel }}</strong><p>{{ review.summary }}</p></div>
      </div>

      <section v-if="review.strengths.length" class="m5-review__strengths">
        <h3><CheckCircle2 :size="17" /> Em đã làm tốt</h3>
        <ul><li v-for="strength in review.strengths" :key="strength">{{ strength }}</li></ul>
      </section>

      <section v-if="review.issues.length" class="m5-review__issues">
        <h3><PencilLine :size="17" /> Chỗ cần sửa</h3>
        <article v-for="(issue, index) in review.issues" :key="`${issue.location}-${index}`" class="m5-review__issue">
          <div class="m5-review__issue-head"><span>{{ index + 1 }}</span><strong>{{ issue.location }}</strong><small>{{ issueLabels[issue.errorType] }}</small></div>
          <p><b>Em đã viết:</b> {{ issue.studentWork }}</p>
          <p><b>Vì sao cần xem lại:</b> {{ issue.explanation }}</p>
          <div class="m5-review__hint"><Lightbulb :size="16" /><span><b>Gợi ý:</b> {{ issue.hint }}</span></div>
        </article>
      </section>

      <div class="m5-review__next"><Lightbulb :size="20" /><div><strong>Em thử tiếp nhé</strong><p>{{ review.nextStep }}</p></div></div>
      <p class="m5-review__note">AI chỉ gợi ý cách sửa. Em hãy tự viết lại bước đó rồi kiểm tra lần nữa.</p>
    </template>
  </div>
</template>
