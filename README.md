# MathFive Portal - Nuxt 3 Web App & Member Portal Boilerplate

Bộ khung mã nguồn hoàn chỉnh (Starter Template) xây dựng bằng **Nuxt 3**, **Nuxt UI**, **Tailwind CSS**, và **Pinia**, được thiết kế chuyên biệt cho việc phát triển **Web Application đa năng**, **Portal dịch vụ thành viên**, và **Sản phẩm SaaS**.

---

## 🌟 Tính Năng Nổi Bật

- **⚡ Nuxt 3 & Nitro Engine:** Server-Side Rendering (SSR) siêu tốc, tự động sinh code và tích hợp sẵn TypeScript chuẩn hóa.
- **🎨 Nuxt UI & Tailwind CSS:** Hệ thống UI Component phong phú (Buttons, Form Inputs, Modals, Tables, Notifications, Accordion), tự động đồng bộ Dark Mode.
- **🔐 Quản lý Phiên & Auth Guard:** 
  - Lưu token an toàn với `useCookie` tương thích hoàn hảo giữa Client và Server SSR hydration.
  - Phân tách luồng truy cập với Nuxt Route Middleware (`middleware/auth.ts`, `middleware/guest.ts`).
  - Trang đăng nhập có sẵn tính năng **Tự động điền tài khoản mẫu (Demo autofill)**.
- **📊 Khu vực Cổng Thành viên (Member Portal):**
  - Giao diện riêng biệt (`layouts/portal.vue`) với thanh Sidebar và Header phản hồi đa màn hình (Mobile Drawer).
  - Bảng tổng quan (Dashboard) hiển thị thống kê tài nguyên, nhật ký hoạt động thời gian thực.
  - Trang quản lý dịch vụ (`pages/portal/services.vue`) kèm bộ lọc, bảng dữ liệu và form đăng ký mới.
  - Cài đặt tài khoản & đổi mật khẩu (`pages/portal/profile.vue`).
- **📝 Hệ thống Bài viết & Blog:**
  - Trang danh sách tin tức & bài viết (`pages/blog/index.vue`) kèm bộ lọc danh mục và ô tìm kiếm tức thì.
  - Trang chi tiết bài viết (`pages/blog/[slug].vue`) tối ưu SEO động bằng `useSeoMeta()`.
- **🚀 Server Routes (Mock BFF Backend):**
  - Hệ thống API viết trực tiếp trong `server/api/` (xác thực, người dùng, bài viết, số liệu dashboard), dễ dàng tích hợp Database (Prisma / Drizzle / MongoDB) hoặc trỏ tới backend ngoài.
- **🛠️ Composable useApi:** Wrapper type-safe cho `$fetch`, tự động đính kèm `Bearer Token` vào mọi request.

---

## 📁 Cấu Trúc Thư Mục

```text
MathFive/
├── app.config.ts            # Cấu hình theme màu (primary: emerald, gray: slate)
├── app.vue                  # Root App component (Loading indicator, Toasts, Modals)
├── nuxt.config.ts           # Cấu hình Nuxt modules, Head SEO, runtimeConfig
├── package.json             # Khai báo dependencies & scripts
├── tsconfig.json            # Cấu hình TypeScript
├── .env.example             # Mẫu biến môi trường
├── components/              # Các components tái sử dụng
│   ├── AppHeader.vue        # Header điều hướng trang công khai & menu mobile
│   ├── AppFooter.vue        # Chân trang công khai & form nhận tin
│   ├── common/
│   │   └── ThemeToggle.vue  # Nút chuyển đổi Dark/Light mode
│   └── portal/
│       ├── PortalHeader.vue # Top bar khu vực thành viên (Search, Thông báo, User avatar)
│       └── PortalSidebar.vue# Thanh sidebar điều hướng cho thành viên
├── composables/             # Các Vue composables nghiệp vụ
│   ├── useApi.ts            # Wrapper gọi API có gắn token tự động
│   └── useAuth.ts           # Composable truy cập trạng thái người dùng
├── layouts/                 # Giao diện khung
│   ├── default.vue          # Layout website công khai
│   ├── portal.vue           # Layout khu vực thành viên / Portal
│   └── auth.vue             # Layout các trang đăng nhập / đăng ký
├── middleware/              # Route Middleware kiểm soát truy cập
│   ├── auth.ts              # Chặn người chưa đăng nhập vào /portal
│   └── guest.ts             # Chặn người đã đăng nhập vào /auth
├── pages/                   # File-based routing
│   ├── index.vue            # Trang chủ Landing page
│   ├── about.vue            # Trang giới thiệu sứ mệnh & công nghệ
│   ├── auth/
│   │   ├── login.vue        # Trang đăng nhập
│   │   └── register.vue     # Trang đăng ký
│   ├── blog/
│   │   ├── index.vue        # Danh sách bài viết & bộ lọc
│   │   └── [slug].vue       # Chi tiết bài viết & SEO meta
│   └── portal/
│       ├── index.vue        # Dashboard tổng quan thành viên
│       ├── services.vue     # Quản lý dịch vụ & gói đăng ký
│       └── profile.vue      # Thông tin cá nhân & mật khẩu
├── server/
│   └── api/                 # Backend API routes
│       ├── auth/            # API đăng nhập, đăng xuất, lấy profile
│       ├── blog/            # API danh sách bài viết & chi tiết
│       └── portal/          # API dữ liệu dashboard thành viên
├── stores/                  # Pinia State Management
│   └── auth.ts              # Quản lý phiên đăng nhập, cookie & user state
└── types/                   # Định nghĩa TypeScript Interfaces & Types
    └── index.ts
```

---

## ⚡ Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Cài đặt các gói phụ thuộc (Dependencies)
Bạn có thể sử dụng `pnpm`, `npm` hoặc `yarn`:

```bash
# Khuyến nghị dùng pnpm:
pnpm install

# Hoặc dùng npm:
npm install
```

### 2. Khởi chạy môi trường phát triển (Dev Server)

```bash
pnpm dev
# hoặc: npm run dev
```

Sau khi chạy lệnh, ứng dụng sẽ hoạt động tại: **`http://localhost:3000`**

### 3. Build chạy Production

```bash
# Biên dịch mã nguồn:
pnpm build

# Chạy thử bản production:
pnpm preview
```

---

## 🔑 Tài Khoản Thử Nghiệm (Demo Account)

Khi truy cập trang [Đăng nhập](http://localhost:3000/auth/login), bạn có thể click nút **"Tự động điền"** hoặc sử dụng thông tin:
- **Email:** `demo@mathfive.com`
- **Mật khẩu:** `123456`

---

## 🔧 Hướng Dẫn Tùy Biến & Mở Rộng

1. **Đổi tông màu giao diện:**
   Chỉnh sửa file `app.config.ts`:
   ```ts
   export default defineAppConfig({
     ui: {
       primary: 'indigo', // indigo, violet, blue, rose, v.v.
       gray: 'zinc'
     }
   })
   ```

2. **Kết nối Backend REST API bên ngoài:**
   - Cập nhật URL trong file `.env`:
     ```env
     NUXT_PUBLIC_API_BASE=https://api.yourdomain.com/v1
     ```
   - Trong các component hoặc page, gọi trực tiếp:
     ```ts
     const api = useApi()
     const data = await api.get('/projects')
     ```

3. **Thêm Route thành viên mới:**
   Chỉ cần thêm file `.vue` vào thư mục `pages/portal/` và khai báo:
   ```ts
   definePageMeta({
     layout: 'portal',
     middleware: 'auth'
   })
   ```
