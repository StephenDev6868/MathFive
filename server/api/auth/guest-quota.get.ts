import { getGuestQuestionQuota } from '~/server/utils/math5-quota'
import { requireMath5User } from '~/server/utils/math5-user'

export default defineEventHandler(async (event) => {
  const user = await requireMath5User(event)
  const quota = await getGuestQuestionQuota(user)
  return { data: quota || { limit: 10, used: 0, remaining: 10 } }
})
