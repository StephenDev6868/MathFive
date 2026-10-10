import type { User } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body || {}

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vui lòng nhập đầy đủ Email và Mật khẩu.'
    })
  }

  // Demo validation (allows password '123456' or any password for testing)
  if (password.length < 6) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Mật khẩu phải có ít nhất 6 ký tự.'
    })
  }

  const user: User = {
    id: 'usr_882914',
    name: email.split('@')[0].toUpperCase(),
    email: email,
    role: email.includes('admin') ? 'admin' : 'member',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    company: 'Công nghệ MathFive',
    bio: 'Nhà phát triển phần mềm và thành viên tích cực tại MathFive Portal.',
    createdAt: '2024-01-15'
  }

  // Generate a mock JWT token
  const token = `mock-token-${Buffer.from(email).toString('base64')}-${Date.now()}`

  return {
    user,
    token
  }
})
