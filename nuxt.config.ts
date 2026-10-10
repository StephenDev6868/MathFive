// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  telemetry: false,

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],

  app: {
    head: {
      title: 'MathFive Portal - Nền tảng Ứng dụng & Dịch vụ Số',
      titleTemplate: '%s · MathFive',
      htmlAttrs: {
        lang: 'vi'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Nền tảng portal hiện đại, tối ưu SEO, tích hợp quản lý thành viên, blog và dịch vụ số.'
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'MathFive Portal' },
        { property: 'og:title', content: 'MathFive Portal - Nền tảng Đa năng' },
        {
          property: 'og:description',
          content: 'Nền tảng portal hiện đại, tối ưu SEO, tích hợp quản lý thành viên, blog và dịch vụ số.'
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
      appName: 'MathFive Portal',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  }
})
