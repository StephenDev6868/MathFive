<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
    <!-- Page Header -->
    <div class="max-w-3xl">
      <UBadge color="emerald" variant="subtle" size="md" class="mb-3">Kiến thức & Công nghệ</UBadge>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
        Bài viết & Cập nhật mới nhất
      </h1>
      <p class="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-400">
        Khám phá các hướng dẫn kỹ thuật chuyên sâu về Nuxt 3, Vue.js, tối ưu SEO và kiến trúc phần mềm.
      </p>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
      <!-- Category Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
        <UButton
          v-for="cat in data?.categories || []"
          :key="cat"
          :color="selectedCategory === cat ? 'emerald' : 'gray'"
          :variant="selectedCategory === cat ? 'solid' : 'ghost'"
          size="sm"
          class="rounded-full"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </UButton>
      </div>

      <!-- Search Input -->
      <div class="w-full sm:w-72">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass"
          placeholder="Tìm bài viết, từ khóa..."
          size="sm"
          color="gray"
        />
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="i in 3" :key="i" class="space-y-4">
        <USkeleton class="h-48 w-full rounded-2xl" />
        <USkeleton class="h-4 w-3/4" />
        <USkeleton class="h-4 w-1/2" />
      </div>
    </div>

    <!-- Posts Grid -->
    <div v-else-if="posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article
        v-for="post in posts"
        :key="post.id"
        class="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition group"
      >
        <!-- Cover Image -->
        <NuxtLink :to="`/blog/${post.slug}`" class="block overflow-hidden h-48 relative">
          <img
            :src="post.coverImage"
            :alt="post.title"
            class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
          <UBadge
            color="emerald"
            variant="solid"
            size="xs"
            class="absolute top-3 right-3 shadow"
          >
            {{ post.category }}
          </UBadge>
        </NuxtLink>

        <!-- Content -->
        <div class="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>{{ post.publishedAt }}</span>
              <span>•</span>
              <span>{{ post.readTime }}</span>
            </div>

            <NuxtLink :to="`/blog/${post.slug}`">
              <h2 class="text-lg font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition line-clamp-2">
                {{ post.title }}
              </h2>
            </NuxtLink>

            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
              {{ post.excerpt }}
            </p>
          </div>

          <!-- Author & Action -->
          <div class="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <UAvatar :src="post.author.avatar" :alt="post.author.name" size="xs" />
              <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ post.author.name }}</span>
            </div>

            <NuxtLink
              :to="`/blog/${post.slug}`"
              class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Đọc tiếp
              <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <UIcon name="i-heroicons-document-magnifying-glass" class="w-12 h-12 text-gray-400 mx-auto mb-3" />
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Không tìm thấy bài viết nào</h3>
      <p class="text-sm text-gray-500 mt-1">Thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.</p>
      <UButton
        color="gray"
        variant="ghost"
        size="sm"
        class="mt-4"
        @click="searchQuery = ''; selectedCategory = 'Tất cả'"
      >
        Đặt lại bộ lọc
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types'

useSeoMeta({
  title: 'Bài viết & Kiến thức Công nghệ',
  description: 'Kho bài viết kỹ thuật chất lượng cao về Nuxt 3, Vue.js và tối ưu hóa hệ thống Web.'
})

const searchQuery = ref('')
const selectedCategory = ref('Tất cả')

// Fetch posts with reactive query parameters
const { data, pending } = await useFetch<{
  posts: BlogPost[]
  total: number
  categories: string[]
}>('/api/posts', {
  query: computed(() => ({
    search: searchQuery.value,
    category: selectedCategory.value
  }))
})

const posts = computed(() => data.value?.posts || [])
</script>
