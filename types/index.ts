export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher'
  avatar: string
  company?: string
  bio?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  coverImage: string
  author: {
    name: string
    avatar: string
    role: string
  }
  publishedAt: string
  readTime: string
  tags: string[]
}

export interface ServiceItem {
  id: string
  name: string
  plan: 'Cơ bản' | 'Chuyên nghiệp' | 'Doanh nghiệp'
  status: 'active' | 'pending' | 'expired'
  renewalDate: string
  cost: string
}

export interface PortalStats {
  activeProjects: number
  storageUsed: string
  supportTickets: number
  accountBalance: string
}

export interface ActivityItem {
  id: string
  action: string
  timestamp: string
  icon: string
  color: string
}
