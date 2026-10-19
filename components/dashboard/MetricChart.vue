<template>
  <section class="m5-chart-card">
    <div class="m5-chart-card__heading">
      <div><h2>{{ title }}</h2><p>{{ description }}</p></div>
      <span :style="{ '--metric-color': color }">{{ totalLabel }}</span>
    </div>
    <div class="m5-chart" :style="{ '--metric-color': color }" role="img" :aria-label="ariaLabel">
      <div v-for="item in items" :key="item.date" class="m5-chart__column">
        <div class="m5-chart__plot">
          <strong v-if="value(item)">{{ value(item) }}</strong>
          <i :style="{ height: `${barHeight(item)}%` }" />
        </div>
        <small>{{ item.label }}</small>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TeacherDailyMetric } from '~/types/dashboard'

const props = defineProps<{
  title: string
  description: string
  items: TeacherDailyMetric[]
  field: 'loggedInStudents' | 'questions' | 'retries'
  color: string
  totalLabel: string
}>()

const value = (item: TeacherDailyMetric) => item[props.field]
const maxValue = computed(() => Math.max(1, ...props.items.map(item => value(item))))
const barHeight = (item: TeacherDailyMetric) => value(item) ? Math.max(8, Math.round((value(item) / maxValue.value) * 100)) : 2
const ariaLabel = computed(() => `${props.title}: ${props.items.map(item => `${item.label} có ${value(item)}`).join(', ')}`)
</script>
