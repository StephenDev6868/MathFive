<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { Camera, ImageUp, Send, X, FileImage } from 'lucide-vue-next'
import type { StudentQuestion } from '~/types/math5'
const emit = defineEmits<{ submit: [payload: StudentQuestion] }>()
withDefaults(defineProps<{ pending?: boolean }>(), { pending: false })
const cameraInput = ref<HTMLInputElement | null>(null)
const uploadInput = ref<HTMLInputElement | null>(null)
const question = ref('')
const image = ref<File | null>(null)
const imageSource = ref<StudentQuestion['source']>(null)
const previewUrl = ref<string | null>(null)
const error = ref('')
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ACCEPTED_TYPES = new Set(['image/jpeg','image/png','image/webp'])

function clearPreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
  image.value = null
  imageSource.value = null
  if (cameraInput.value) cameraInput.value.value = ''
  if (uploadInput.value) uploadInput.value.value = ''
}
function onChoose(event: Event, source: 'camera' | 'upload') {
  error.value = ''
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!ACCEPTED_TYPES.has(file.type)) { error.value = 'Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.'; return }
  if (file.size > MAX_IMAGE_BYTES) { error.value = 'Ảnh tối đa 5 MB, hãy thử ảnh khác nhé.'; return }
  clearPreview()
  image.value = file
  imageSource.value = source
  previewUrl.value = URL.createObjectURL(file)
}
function submit() {
  error.value = ''
  if (!question.value.trim() && !image.value) {
    error.value = 'Em hãy nhập câu hỏi hoặc chọn ảnh bài toán nhé!'
    return
  }
  emit('submit', { question: question.value.trim(), image: image.value, source: imageSource.value })
}
onBeforeUnmount(clearPreview)
</script>

<template>
  <div class="m5-composer">
    <!-- Row 1: two large image actions -->
    <div class="m5-composer__image-row">
      <button class="m5-image-action m5-image-action--camera" type="button" :disabled="pending" @click="cameraInput?.click()">
        <Camera :size="25" aria-hidden="true" />
        <span>Chụp ảnh bài tập</span>
      </button>
      <button class="m5-image-action m5-image-action--upload" type="button" :disabled="pending" @click="uploadInput?.click()">
        <ImageUp :size="25" aria-hidden="true" />
        <span>Tải ảnh lên</span>
      </button>
    </div>
    <input ref="cameraInput" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" class="m5-sr-only" aria-label="Chụp ảnh bài tập" @change="onChoose($event, 'camera')" />
    <input ref="uploadInput" type="file" accept="image/jpeg,image/png,image/webp" class="m5-sr-only" aria-label="Tải ảnh bài tập" @change="onChoose($event, 'upload')" />

    <div v-if="image && previewUrl" class="m5-image-preview">
      <FileImage :size="18" aria-hidden="true" />
      <img :src="previewUrl" :alt="'Ảnh bài tập: ' + image.name" />
      <span>{{ image.name }}</span>
      <button type="button" aria-label="Bỏ ảnh" @click="clearPreview"><X :size="18" /></button>
    </div>

    <!-- Row 2: independent full-width chat entry -->
    <label class="m5-composer__chat-row">
      <span class="m5-sr-only">Nhập câu hỏi Toán lớp 5</span>
      <textarea v-model="question" rows="2" maxlength="3000" :disabled="pending" placeholder="Hoặc nhập câu hỏi của em..." />
    </label>
    <p v-if="error" class="m5-composer__error" role="alert">{{ error }}</p>
    <button class="m5-composer__send" type="button" :disabled="pending" @click="submit">
      <span v-if="pending" class="m5-spinner" aria-hidden="true" />
      <Send v-else :size="23" aria-hidden="true" /> {{ pending ? 'Đang chuẩn bị đề...' : 'Gửi đề bài' }}
    </button>
  </div>
</template>
