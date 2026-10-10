import type { User } from '~/types'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Chưa xác thực hoặc token không hợp lệ'
    })
  }

  const token = authHeader.replace('Bearer ', '')

  // Mock user returned based on token
  const user: User = {
    id: 'usr_882914',
    name: 'Nguyễn Văn A',
    email: 'user@mathfive.com',
    role: token.includes('admin') ? 'admin' : 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user@mathfive.com',
    company: 'Công nghệ MathFive',
    bio: 'Nhà phát triển phần mềm và thành viên tích cực tại MathFive Portal.',
    createdAt: '2024-01-15'
  }

  return user
})
