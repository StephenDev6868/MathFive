export function math5Error(statusCode: number, statusMessage: string): never {
  throw createError({ statusCode, statusMessage })
}

export function asPublicModelError(error: unknown): never {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    throw error
  }
  if (error && typeof error === 'object' && 'status' in error) {
    const status = Number((error as { status?: number }).status)
    if (status === 429) math5Error(429, 'Em đã dùng hết lượt AI hôm nay. Hãy thử lại vào ngày mai nhé.')
  }
  math5Error(503, 'AI đang bận hoặc chưa phản hồi. Em hãy thử lại sau ít phút nhé.')
}
