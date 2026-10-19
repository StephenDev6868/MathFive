import { recordMath5Activity } from '~/server/utils/math5-activity'
import { requireMath5User } from '~/server/utils/math5-user'

export default defineEventHandler(async (event) => {
  const user = await requireMath5User(event)
  await recordMath5Activity(user.id, 'login_success')
  return { data: { recorded: true } }
})
