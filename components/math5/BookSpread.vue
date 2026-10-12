<template>
  <div class="m5-book" aria-label="Sổ tay học Toán">
    <picture class="m5-book__art" aria-hidden="true">
      <source media="(max-width: 767px)" :srcset="bookMobile" />
      <source media="(max-width: 1099px)" :srcset="bookIpad" />
      <img :src="bookPc" alt="" width="1448" height="1086" />
    </picture>

    <div class="m5-book__content">
      <section class="m5-book__page m5-book__page--question" aria-label="Trang hỏi bài">
        <header class="m5-book__heading m5-book__heading--question">
          <MessageCircleQuestion :size="29" aria-hidden="true" />
          <h2>Hỏi đáp với AI</h2>
          <img src="/math5/decorations/sparkle.svg" alt="" />
        </header>
        <slot name="question" />
      </section>
      <section class="m5-book__page m5-book__page--answer" aria-label="Trang lời giải">
        <header class="m5-book__heading m5-book__heading--answer">
          <Lightbulb :size="29" aria-hidden="true" />
          <h2>Lời giải từ AI</h2>
          <img src="/math5/decorations/book-badge.svg" alt="" />
        </header>
        <slot name="answer" />
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { MessageCircleQuestion, Lightbulb } from 'lucide-vue-next'
import bookPc from '~/assets/css/images/book_pc.png'
import bookIpad from '~/assets/css/images/book_ipad.png'
import bookMobile from '~/assets/css/images/book_mobile.png'
</script>
