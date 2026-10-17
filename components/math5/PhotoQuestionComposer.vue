<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue'
import { Camera, ImageUp, Send, X, FileImage } from 'lucide-vue-next'
import type { ReviewProvider, StudentQuestion } from '~/types/math5'
const emit = defineEmits<{
  submit: [payload: StudentQuestion]
  draft: [payload: Pick<StudentQuestion, 'question' | 'images'>]
}>()
withDefaults(defineProps<{ pending?: boolean }>(), { pending: false })
const cameraInput = ref<HTMLInputElement | null>(null)
const uploadInput = ref<HTMLInputElement | null>(null)
const question = ref('')
const provider = ref<ReviewProvider>('openai')
const images = ref<Array<{ file: File; previewUrl: string }>>([])
const imageSource = ref<StudentQuestion['source']>(null)
const error = ref('')
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const MAX_TOTAL_IMAGE_BYTES = 15 * 1024 * 1024
const MAX_IMAGES = 5
const ACCEPTED_TYPES = new Set(['image/jpeg','image/png','image/webp'])

function emitDraft() {
  emit('draft', { question: question.value, images: images.value.map(image => image.file) })
}
function clearImages(notify = true) {
  images.value.forEach(image => URL.revokeObjectURL(image.previewUrl))
  images.value = []
  imageSource.value = null
  if (cameraInput.value) cameraInput.value.value = ''
  if (uploadInput.value) uploadInput.value.value = ''
  if (notify) emitDraft()
}
function onChoose(event: Event, source: 'camera' | 'upload') {
  error.value = ''
  const input = event.target as HTMLInputElement
  const selected = Array.from(input.files || [])
  input.value = ''
  if (!selected.length) return
  const remaining = MAX_IMAGES - images.value.length
  if (remaining <= 0) { error.value = `Em chỉ có thể chọn tối đa ${MAX_IMAGES} ảnh.`; return }

  const accepted = selected.slice(0, remaining).filter(file => {
    if (!ACCEPTED_TYPES.has(file.type)) { error.value = 'Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.'; return false }
    if (file.size > MAX_IMAGE_BYTES) { error.value = 'Mỗi ảnh tối đa 5 MB.'; return false }
    return true
  })
  const availableBytes = MAX_TOTAL_IMAGE_BYTES - images.value.reduce((total, image) => total + image.file.size, 0)
  const imagesToAdd: File[] = []
  let addedBytes = 0
  for (const file of accepted) {
    if (addedBytes + file.size > availableBytes) { error.value = 'Tổng dung lượng ảnh tối đa là 15 MB.'; break }
    imagesToAdd.push(file)
    addedBytes += file.size
  }
  if (selected.length > remaining) error.value = `Em chỉ có thể chọn tối đa ${MAX_IMAGES} ảnh.`
  if (!imagesToAdd.length) return

  images.value.push(...imagesToAdd.map(file => ({ file, previewUrl: URL.createObjectURL(file) })))
  imageSource.value = source
  emitDraft()
}
function removeImage(index: number) {
  const [image] = images.value.splice(index, 1)
  if (image) URL.revokeObjectURL(image.previewUrl)
  if (!images.value.length) imageSource.value = null
  emitDraft()
}
function submit() {
  error.value = ''
  if (!question.value.trim() && !images.value.length) {
    error.value = 'Em hãy nhập đề kèm bài làm hoặc chọn ảnh vở bài tập nhé!'
    return
  }
  emit('submit', { question: question.value.trim(), images: images.value.map(image => image.file), source: imageSource.value, provider: provider.value })
}
watch(question, emitDraft)
onBeforeUnmount(() => clearImages(false))
</script>

<template>
  <div class="m5-composer">
    <!-- Row 1: two large image actions -->
    <div class="m5-composer__image-row">
      <button class="m5-image-action m5-image-action--camera" type="button" :disabled="pending" @click="cameraInput?.click()">
        <Camera :size="25" aria-hidden="true" />
        <span>Chụp ảnh bài làm</span>
      </button>
      <button class="m5-image-action m5-image-action--upload" type="button" :disabled="pending" @click="uploadInput?.click()">
        <ImageUp :size="25" aria-hidden="true" />
        <span>Tải ảnh bài làm</span>
      </button>
    </div>
    <input ref="cameraInput" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" class="m5-sr-only" aria-label="Chụp ảnh bài làm" @change="onChoose($event, 'camera')" />
    <input ref="uploadInput" type="file" accept="image/jpeg,image/png,image/webp" multiple class="m5-sr-only" aria-label="Tải ảnh bài làm" @change="onChoose($event, 'upload')" />

    <div v-if="images.length" class="m5-image-preview" :aria-label="`${images.length} ảnh bài tập đã chọn`">
      <div class="m5-image-preview__heading"><FileImage :size="18" aria-hidden="true" /><span>{{ images.length }}/{{ MAX_IMAGES }} ảnh đã chọn</span></div>
      <div class="m5-image-preview__list">
        <figure v-for="(image, index) in images" :key="image.previewUrl" class="m5-image-preview__item">
          <img :src="image.previewUrl" :alt="`Ảnh bài tập ${index + 1}: ${image.file.name}`" />
          <figcaption>Ảnh {{ index + 1 }}</figcaption>
          <button type="button" :aria-label="`Bỏ ảnh ${index + 1}`" @click="removeImage(index)"><X :size="16" /></button>
        </figure>
      </div>
      <button v-if="images.length > 1" type="button" class="m5-image-preview__clear" @click="clearImages()">Bỏ tất cả</button>
    </div>

    <!-- Row 2: independent full-width chat entry -->
    <label class="m5-composer__chat-row">
      <span class="m5-sr-only">Nhập đề và bài làm Toán lớp 5</span>
      <textarea v-model="question" rows="2" maxlength="3000" :disabled="pending" placeholder="Hoặc nhập đề bài và cách em đã làm..." />
    </label>
    <label class="m5-composer__model-row">
      <span>Model chữa bài</span>
      <select v-model="provider" :disabled="pending" aria-label="Chọn model chữa bài">
        <option value="openai">OpenAI</option>
        <option value="gemini">Google Gemini</option>
      </select>
    </label>
    <p v-if="error" class="m5-composer__error" role="alert">{{ error }}</p>
    <button class="m5-composer__send" type="button" :disabled="pending" @click="submit">
      <span v-if="pending" class="m5-spinner" aria-hidden="true" />
      <Send v-else :size="23" aria-hidden="true" /> {{ pending ? 'Đang đọc bài làm...' : 'Kiểm tra bài làm' }}
    </button>
  </div>
</template>
