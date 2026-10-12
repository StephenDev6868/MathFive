export type StudentQuestion = {
  question: string
  image: File | null
  source: 'camera' | 'upload' | null
}
export type MathStep = {
  title: string
  explanation: string
  calculation?: string
}
