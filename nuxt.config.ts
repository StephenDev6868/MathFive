// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  telemetry: false,

  css: ['~/assets/css/math5-theme.css'],

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

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
    // Private keys only available on server
    jwtSecret: process.env.JWT_SECRET || 'super-secret-key-change-me-in-production',
    
    // Public keys available on both client & server
    public: {
      appName: 'MathFive',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  }
})
