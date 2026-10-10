import type { PortalStats, ActivityItem, ServiceItem } from '~/types'

export default defineEventHandler(() => {
  const stats: PortalStats = {
    activeProjects: 8,
    storageUsed: '4.2 GB / 20 GB',
    supportTickets: 1,
    accountBalance: '2.450.000 ₫'
  }

  const activities: ActivityItem[] = [
    {
      id: 'act-1',
      action: 'Triển khai thành công ứng dụng Portal v1.2',
      timestamp: '10 phút trước',
      icon: 'i-heroicons-check-circle',
      color: 'text-emerald-500'
    },
    {
      id: 'act-2',
      action: 'Cập nhật khóa API Token bảo mật',
      timestamp: '2 giờ trước',
      icon: 'i-heroicons-key',
      color: 'text-amber-500'
    },
    {
      id: 'act-3',
      action: 'Gia hạn gói dịch vụ Cloud Server Pro',
      timestamp: '1 ngày trước',
      icon: 'i-heroicons-credit-card',
      color: 'text-blue-500'
    },
    {
      id: 'act-4',
      action: 'Tạo tài khoản thành viên mới cho đội ngũ phát triển',
      timestamp: '3 ngày trước',
      icon: 'i-heroicons-user-plus',
      color: 'text-indigo-500'
    }
  ]

  const services: ServiceItem[] = [
    {
      id: 'srv-1',
      name: 'Hạ tầng Cloud Hosting MathFive',
      plan: 'Chuyên nghiệp',
      status: 'active',
      renewalDate: '2025-12-31',
      cost: '450.000 ₫ / tháng'
    },
    {
      id: 'srv-2',
      name: 'Dịch vụ Email Tên miền Doanh nghiệp',
      plan: 'Cơ bản',
      status: 'active',
      renewalDate: '2025-06-15',
      cost: '120.000 ₫ / tháng'
    },
    {
      id: 'srv-3',
      name: 'Gói Giám sát APM & Báo cáo Hiệu năng',
      plan: 'Doanh nghiệp',
      status: 'active',
      renewalDate: '2025-11-20',
      cost: '890.000 ₫ / tháng'
    }
  ]

  return {
    stats,
    activities,
    services
  }
})
