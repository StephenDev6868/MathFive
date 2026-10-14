// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  telemetry: false,

  css: ['~/assets/css/math5-theme.css'],

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
      title: 'Học Toán lớp 5 cùng AI',
      titleTemplate: '%s · MathFive',
      htmlAttrs: {
        lang: 'vi'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Trợ lý học Toán lớp 5 giúp học sinh hiểu cách giải từng bước.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'MathFive' },
        { property: 'og:title', content: 'Học Toán lớp 5 cùng AI' },
        {
          property: 'og:description',
          content: 'Chụp đề, thử tự làm và xem hướng dẫn Toán lớp 5 từng bước.'
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
    supabaseSecretKey: process.env.NUXT_SUPABASE_SECRET_KEY,
    aiDailyOcrLimit: Number(process.env.NUXT_AI_DAILY_OCR_LIMIT || 20),
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
