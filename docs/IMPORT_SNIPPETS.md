# Code mẫu tích hợp từng item vào Nuxt 4

## Chèn background
```vue
<div class="classroom-wallpaper">
  <slot />
</div>
<style scoped>
.classroom-wallpaper {
  min-height: 100svh;
  background:
    linear-gradient(180deg, rgba(255,255,255,.05), #fff9ef),
    url('/math5/backgrounds/pastel-classroom.svg') center top / cover no-repeat;
}
</style>
```

## Chèn mascot
```vue
<script setup lang="ts">
import CatMascot from '~/components/math5/CatMascot.vue'
</script>
<template>
  <CatMascot pose="reading" />
</template>
```

## Icon (đừng cắt icon từ screenshot)
```vue
<script setup lang="ts">
import { Camera, ImageUp, History, Lightbulb, Heart, Send } from 'lucide-vue-next'
</script>
<template>
  <button type="button"><Camera :size="24" /> Chụp ảnh bài tập</button>
</template>
```

## Book + Composer + AI
```vue
<script setup lang="ts">
import BookSpread from '~/components/math5/BookSpread.vue'
import PhotoQuestionComposer from '~/components/math5/PhotoQuestionComposer.vue'
import WorkReview from '~/components/math5/WorkReview.vue'
import type { StudentQuestion, WorkReview as WorkReviewResult } from '~/types/math5'

const review = ref<WorkReviewResult | null>(null) // Điền từ API thật
async function submit(payload: StudentQuestion) {
  // TODO: gọi Nitro endpoint với FormData + auth; không gọi OpenAI trực tiếp ở client.
  console.log('Demo question length:', payload.question.length)
}
</script>
<template>
  <BookSpread>
    <template #question><PhotoQuestionComposer @submit="submit" /></template>
    <template #answer><WorkReview :review="review" /></template>
  </BookSpread>
</template>
```

Xem thêm `app/pages/math5-ui-preview.vue` để có demo đầy đủ.
