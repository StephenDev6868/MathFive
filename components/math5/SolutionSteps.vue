<script setup lang="ts">
import { Trophy, BookOpen, Sparkles } from 'lucide-vue-next'
import type { MathStep } from '~/types/math5'
withDefaults(defineProps<{
  steps: MathStep[]
  answer?: string
  answerPrefix?: string
  pending?: boolean
}>(), { answer: '', answerPrefix: 'Đáp số:', pending: false })
</script>
<template>
  <div class="m5-solution" aria-live="polite">
    <p v-if="pending" class="m5-solution__pending"><Sparkles :size="19" /> AI đang phân tích bài toán...</p>
    <template v-else>
      <p v-if="!steps.length && !answer" class="m5-solution__empty">Gửi đề bài để AI hướng dẫn từng bước nhé!</p>
      <template v-else>
      <p class="m5-solution__intro">Cùng xem từng bước để hiểu bài nhé!</p>
      <ol class="m5-solution__steps">
        <li v-for="(step,index) in steps" :key="index" class="m5-solution__step">
          <span class="m5-solution__number">{{ index + 1 }}</span>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.explanation }}</p>
            <strong v-if="step.calculation" class="m5-solution__calculation">{{ step.calculation }}</strong>
          </div>
        </li>
      </ol>
      <div v-if="answer" class="m5-solution__result">
        <h3><Trophy :size="25" /> Kết quả</h3>
        <p>{{ answerPrefix }}</p>
        <strong>{{ answer }}</strong>
      </div>
      <p v-if="answer" class="m5-solution__foot"><BookOpen :size="17" /> Đọc lại các bước để nhớ cách làm nhé!</p>
      </template>
    </template>
  </div>
</template>
