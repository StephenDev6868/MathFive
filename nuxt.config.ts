// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  telemetry: false,

  css: ['~/assets/css/math5-theme.css', '~/assets/css/math5-dashboard.css'],

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/supabase'
  ],

  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/auth/login']
    }
  },

  app: {
    head: {
      title: 'AI kiểm tra bài làm Toán lớp 5',
      titleTemplate: '%s · MathFive',
      htmlAttrs: {
        lang: 'vi'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'AI phát hiện lỗi trong bài làm Toán lớp 5 và gợi ý để học sinh tự sửa.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'MathFive' },
        { property: 'og:title', content: 'AI kiểm tra bài làm Toán lớp 5' },
        {
          property: 'og:description',
          content: 'Chụp bài làm, tìm chỗ sai và nhận gợi ý để tự sửa.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },

  typescript: {
    strict: true,
    shim: false
  },

  runtimeConfig: {
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
    openaiVisionModel: process.env.NUXT_OPENAI_VISION_MODEL,
    openaiSolveModel: process.env.NUXT_OPENAI_SOLVE_MODEL,
    geminiApiKey: process.env.NUXT_GEMINI_API_KEY,
    geminiVisionModel: process.env.NUXT_GEMINI_VISION_MODEL,
    geminiSolveModel: process.env.NUXT_GEMINI_SOLVE_MODEL,
    supabaseSecretKey: process.env.NUXT_SUPABASE_SECRET_KEY,
    aiDailyOcrLimit: Number(process.env.NUXT_AI_DAILY_OCR_LIMIT || 40),
    aiDailySolveLimit: Number(process.env.NUXT_AI_DAILY_SOLVE_LIMIT || 15),
    
    // Public keys available on both client & server
    public: {
      appName: 'MathFive',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY
    }
  }
})
