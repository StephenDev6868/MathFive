import { randomBytes, randomUUID } from 'node:crypto'
import { GuestLoginSchema } from '~/shared/schemas/math5'
import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin, useMath5SupabaseAuth } from '~/server/utils/math5-supabase'

export default defineEventHandler(async (event) => {
  const parsed = GuestLoginSchema.safeParse(await readBody(event))
  if (!parsed.success) math5Error(400, 'Tên của em cần từ 2 đến 50 ký tự.')

  const displayName = parsed.data.displayName.replace(/\s+/g, ' ')
  const email = `guest-${randomUUID()}@guests.math5.local`
  const password = randomBytes(32).toString('base64url')
  const admin = useMath5SupabaseAdmin()
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { is_guest: true },
    user_metadata: { display_name: displayName },
  })
  if (createError || !created.user) math5Error(503, 'Chưa thể tạo phiên dùng thử lúc này.')

  const guestId = created.user.id
  try {
    const { error: profileError } = await admin
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', guestId)
    if (profileError) math5Error(503, 'Chưa thể lưu tên cho phiên dùng thử.')

    const { data: signedIn, error: signInError } = await useMath5SupabaseAuth().auth.signInWithPassword({
      email,
      password,
    })
    if (signInError || !signedIn.session) math5Error(503, 'Chưa thể bắt đầu phiên dùng thử.')

    return {
      data: {
        accessToken: signedIn.session.access_token,
        refreshToken: signedIn.session.refresh_token,
      },
    }
  } catch (error) {
    await admin.auth.admin.deleteUser(guestId).catch(() => undefined)
    throw error
  }
})
