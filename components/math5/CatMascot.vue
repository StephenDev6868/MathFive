<script setup lang="ts">
type Pose = 'pencil' | 'reading' | 'books' | 'waving' | 'notes' | 'idea'
withDefaults(defineProps<{ pose?: Pose; decorative?: boolean }>(), { pose: 'waving', decorative: true })
const captions: Record<Pose,string> = {
  pencil: 'Mèo học toán với bút chì', reading: 'Mèo đang đọc sách', books: 'Mèo nằm trên sách',
  waving: 'Mèo đang vẫy tay', notes: 'Mèo ghi bài', idea: 'Mèo có ý tưởng mới'
}
</script>
<template>
  <img class="m5-mascot" :src="`/math5/illustrations/mascot-${pose}.png`" :alt="decorative ? '' : captions[pose]" :aria-hidden="decorative ? true : undefined" draggable="false" />
</template>
