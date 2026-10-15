export function math5Error(statusCode: number, statusMessage: string): never {
  throw createError({ statusCode, statusMessage })
}

export function asPublicModelError(error: unknown, provider?: 'openai' | 'gemini'): never {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    throw error
  }
  const modelError = error && typeof error === 'object'
    ? error as { status?: number; message?: string; code?: string }
    : undefined
  if (modelError) {
    const status = Number(modelError.status)
    if (status === 429) math5Error(429, 'Em đã dùng hết lượt AI hôm nay. Hãy thử lại vào ngày mai nhé.')
    if (status === 404 && provider === 'gemini') math5Error(503, 'Model Gemini này chưa khả dụng cho API key hiện tại. Em hãy chọn OpenAI hoặc nhờ người quản trị đổi model Gemini.')
    if (status === 503 || /high demand|unavailable/i.test(modelError.message || '')) {
      const name = provider === 'gemini' ? 'Gemini' : 'AI'
      math5Error(503, `${name} đang quá tải. Em hãy thử lại sau ít phút hoặc chọn OpenAI nhé.`)
    }
  }
  math5Error(503, 'AI đang bận hoặc chưa phản hồi. Em hãy thử lại sau ít phút nhé.')
}
