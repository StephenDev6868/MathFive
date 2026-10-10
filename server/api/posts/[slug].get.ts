import type { BlogPost } from '~/types'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')

  // Sample articles data
  const posts: Record<string, BlogPost> = {
    'kien-truc-nuxt-3-cho-du-an-doanh-nghiep': {
      id: 'post-1',
      slug: 'kien-truc-nuxt-3-cho-du-an-doanh-nghiep',
      title: 'Kiến trúc Nuxt 3 chuẩn hóa cho các dự án phần mềm doanh nghiệp',
      excerpt: 'Tìm hiểu cách tổ chức thư mục, chia sẻ state với Pinia, cấu hình SSR/SSG và bảo mật API trong Nuxt 3.',
      content: `Nuxt 3 mang đến sự đột phá với kiến trúc Nitro Engine, Vue 3 Composition API và khả năng Full-stack mạnh mẽ. Đối với các dự án phần mềm quy mô lớn, việc thiết lập chuẩn mực kiến trúc ngay từ đầu giúp tối ưu hiệu năng và dễ dàng mở rộng.\n\n### 1. Phân tầng kiến trúc\n- **Presentation Layer (Pages & Components):** Giữ UI thuần túy, hạn chế logic phức tạp.\n- **State Management (Pinia stores):** Quản lý trạng thái chia sẻ giữa client và server hydration an toàn qua cookies.\n- **Service Layer (Composables):** Đóng gói logic nghiệp vụ và tương tác API qua useApi.\n- **Server Layer (Nitro API routes):** Đảm nhiệm BFF (Backend For Frontend) và bảo mật bí mật API.\n\n### 2. Tối ưu hiệu năng SSR\nSử dụng cơ chế Payload caching và Server-side Data Fetching với useAsyncData giúp trang tải tức thì mà không giật giật giao diện.\n\n### 3. Kết luận\nMột kiến trúc chuẩn giúp đội ngũ lập trình viên tăng tốc độ phát triển và giảm thiểu lỗi bảo mật.`,
      category: 'Kiến trúc & Công nghệ',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'Thành Nguyễn',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=thanhnguyen',
        role: 'Tech Lead / Architect'
      },
      publishedAt: '2025-01-10',
      readTime: '6 phút đọc',
      tags: ['Nuxt 3', 'Vue.js', 'Architecture', 'TypeScript']
    },
    'toi-uu-seo-va-hieu-nang-web-voi-nuxt-ui': {
      id: 'post-2',
      slug: 'toi-uu-seo-va-hieu-nang-web-voi-nuxt-ui',
      title: 'Tối ưu SEO và hiệu năng Web Core Vitals với Nuxt UI & Tailwind CSS',
      excerpt: 'Bí quyết đạt điểm Lighthouse 100/100, tối ưu hoá thẻ Meta, SSR Rendering và tự động hóa Sitemap.',
      content: `Các trang thông tin và cổng dịch vụ số cần được các công cụ tìm kiếm chỉ mục hóa chính xác và xếp hạng cao. Nuxt 3 hỗ trợ SSR theo mặc định, đem lại lợi thế rất lớn so với SPA truyền thống.\n\n### 1. Thẻ Meta động với useSeoMeta\nNuxt 3 cung cấp useSeoMeta() với đầy đủ TypeScript autocomplete, đảm bảo thẻ OpenGraph, Twitter Cards luôn chuẩn xác.\n\n### 2. Tinh gọn CSS với Tailwind\nTailwind CSS loại bỏ các class thừa khi build production, giúp kích thước file css chỉ vỏn vẹn vài chục kilobytes.`,
      category: 'SEO & Hiệu năng',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'Hải Đăng',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=haidang',
        role: 'SEO & Growth Specialist'
      },
      publishedAt: '2025-01-05',
      readTime: '4 phút đọc',
      tags: ['SEO', 'Nuxt UI', 'Performance', 'Tailwind']
    },
    'xay-dung-client-portal-an-toan-voi-jwt-va-nuxt-middleware': {
      id: 'post-3',
      slug: 'xay-dung-client-portal-an-toan-voi-jwt-va-nuxt-middleware',
      title: 'Xây dựng Client Portal bảo mật với JWT, Pinia và Nuxt Route Middleware',
      excerpt: 'Hướng dẫn thiết lập cơ chế phân quyền, bảo vệ route thành viên và tự động làm mới phiên đăng nhập.',
      content: `Trong Nuxt, route middleware cho phép chặn các truy cập trái phép trước khi component được render, cả ở phía server lẫn client.\n\n### 1. Cơ chế Route Middleware\nĐịnh nghĩa middleware trong thư mục /middleware và gán vào page meta definePageMeta({ middleware: 'auth' }).\n\n### 2. Lưu trữ Token an toàn với useCookie\nSử dụng cookie giúp cả server renderer và client renderer đều biết được trạng thái đăng nhập của người dùng.`,
      category: 'Bảo mật & Backend',
      coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      author: {
        name: 'Minh Quân',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=minhquan',
        role: 'Security Engineer'
      },
      publishedAt: '2024-12-28',
      readTime: '5 phút đọc',
      tags: ['Security', 'JWT', 'Pinia', 'Portal']
    }
  }

  const post = slug ? posts[slug] : null

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Bài viết không tồn tại.'
    })
  }

  return post
})
