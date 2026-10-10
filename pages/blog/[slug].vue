<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Back button -->
    <div class="mb-8">
      <UButton
        to="/blog"
        color="gray"
        variant="ghost"
        size="sm"
        icon="i-heroicons-arrow-left"
      >
        Quay lại danh sách bài viết
      </UButton>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="pending" class="space-y-6">
      <USkeleton class="h-10 w-3/4" />
      <USkeleton class="h-64 w-full rounded-2xl" />
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-5/6" />
    </div>

    <!-- Error State -->
    <div v-else-if="error || !post" class="text-center py-20">
      <UIcon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-amber-500 mx-auto mb-4" />
      <h1 class="text-2xl font-bold">Bài viết không tồn tại</h1>
      <p class="text-gray-500 mt-2">Bài viết này có thể đã bị xóa hoặc đường dẫn không đúng.</p>
      <UButton to="/blog" color="emerald" class="mt-6">Xem tất cả bài viết</UButton>
    </div>

    <!-- Article Content -->
    <article v-else class="space-y-8">
      <!-- Article Header -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <UBadge color="emerald" variant="subtle" size="sm">{{ post.category }}</UBadge>
          <span class="text-xs text-gray-500">{{ post.publishedAt }}</span>
          <span class="text-xs text-gray-500">•</span>
          <span class="text-xs text-gray-500">{{ post.readTime }}</span>
        </div>

        <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
          {{ post.title }}
        </h1>

        <!-- Author Banner -->
        <div class="flex items-center gap-3 pt-2">
          <UAvatar :src="post.author.avatar" :alt="post.author.name" size="md" />
          <div>
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ post.author.name }}</p>
            <p class="text-xs text-gray-500">{{ post.author.role }}</p>
          </div>
        </div>
      </div>

      <!-- Feature Image -->
      <div class="rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800">
        <img
          :src="post.coverImage"
          :alt="post.title"
          class="w-full max-h-[450px] object-cover"
        />
      </div>

      <!-- Excerpt Highlight -->
      <blockquote class="p-4 border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-gray-700 dark:text-gray-300 italic text-base rounded-r-lg">
        {{ post.excerpt }}
      </blockquote>

      <!-- Content Body -->
      <div class="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed space-y-4 text-base whitespace-pre-line">
        {{ post.content }}
      </div>

      <!-- Tags -->
      <div class="pt-8 border-t border-gray-200 dark:border-gray-800">
        <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Chủ đề bài viết</h4>
        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            color="gray"
            variant="solid"
            size="sm"
          >
            #{{ tag }}
          </UBadge>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/types'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data: post, pending, error } = await useFetch<BlogPost>(`/api/posts/${slug.value}`)

// Set dynamic SEO tags when post is loaded
watchEffect(() => {
  if (post.value) {
    useSeoMeta({
      title: post.value.title,
      description: post.value.excerpt,
      ogTitle: post.value.title,
      ogDescription: post.value.excerpt,
      ogImage: post.value.coverImage
    })
  }
})
</script>
