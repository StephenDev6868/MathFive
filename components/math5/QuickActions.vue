<script setup lang="ts">
import { History, Lightbulb, Heart, Zap } from 'lucide-vue-next'
const emit = defineEmits<{ select: [action: 'history' | 'tips' | 'saved' | 'hint'] }>()
const items = [
  { id: 'history', label: 'Lịch sử chat', icon: History, className: 'm5-quick--blue' },
  { id: 'tips', label: 'Mẹo học hay', icon: Lightbulb, className: 'm5-quick--yellow' },
  { id: 'saved', label: 'Bài đã lưu', icon: Heart, className: 'm5-quick--pink' },
  { id: 'hint', label: 'Gợi ý nhanh', icon: Zap, className: 'm5-quick--orange' },
] as const
</script>
<template>
  <nav class="m5-quick" aria-label="Tiện ích học tập">
    <button v-for="item in items" :key="item.id" type="button" class="m5-quick__item" :class="item.className" @click="emit('select', item.id)">
      <component :is="item.icon" :size="24" aria-hidden="true" />
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>
