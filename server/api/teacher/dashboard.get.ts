import { TeacherDashboardQuerySchema } from '~/shared/schemas/math5'
import { math5Error } from '~/server/utils/math5-errors'
import { useMath5SupabaseAdmin } from '~/server/utils/math5-supabase'
import { requireMath5Teacher } from '~/server/utils/math5-user'
import type { AccountClassSummary, TeacherDailyMetric, TeacherDashboard } from '~/types/dashboard'

const DAY_MS = 86_400_000
const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh'
const PAGE_SIZE = 1000

async function fetchAllRows<T>(fetchPage: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: any }>) {
  const rows: T[] = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const result = await fetchPage(from, from + PAGE_SIZE - 1)
    if (result.error) return { data: rows, error: result.error }
    const page = result.data || []
    rows.push(...page)
    if (page.length < PAGE_SIZE) return { data: rows, error: null }
  }
}

function vietnamDateKey(value: Date | string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: VIETNAM_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(value))
  const part = (type: string) => parts.find(item => item.type === type)?.value || ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

function shortDateLabel(date: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: VIETNAM_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(`${date}T00:00:00+07:00`))
}

export default defineEventHandler(async (event) => {
  const teacher = await requireMath5Teacher(event)
  const parsed = TeacherDashboardQuerySchema.safeParse(getQuery(event))
  if (!parsed.success) math5Error(400, 'Khoảng thống kê hoặc lớp học không hợp lệ.')
  const admin = useMath5SupabaseAdmin()
  const { data: ownedClasses, error: classError } = await admin
    .from('classrooms')
    .select('id, name, class_code, school_name')
    .eq('teacher_id', teacher.id)
    .order('class_code')
  if (classError) math5Error(503, 'Không thể tải lớp chủ nhiệm.')
  if (!ownedClasses?.length) math5Error(404, 'Tài khoản chưa được phân công lớp chủ nhiệm.')

  const selected = parsed.data.classId
    ? ownedClasses.find(item => item.id === parsed.data.classId)
    : ownedClasses[0]
  if (!selected) math5Error(404, 'Không tìm thấy lớp thuộc quyền giáo viên.')

  const { data: allMemberships, error: membershipsError } = await admin
    .from('classroom_members')
    .select('classroom_id, student_id')
    .in('classroom_id', ownedClasses.map(item => item.id))
  if (membershipsError) math5Error(503, 'Không thể tải danh sách học sinh.')
  const studentIds = (allMemberships || [])
    .filter(item => item.classroom_id === selected.id)
    .map(item => item.student_id)
  const classes: AccountClassSummary[] = ownedClasses.map(item => ({
    id: item.id,
    name: item.name,
    classCode: item.class_code || item.name,
    schoolName: item.school_name || 'Tiểu học Bùi Thị Xuân',
    studentCount: (allMemberships || []).filter(member => member.classroom_id === item.id).length,
  }))

  const today = vietnamDateKey(new Date())
  const todayStart = new Date(`${today}T00:00:00+07:00`)
  const dateKeys = Array.from({ length: parsed.data.days }, (_, index) => {
    const offset = parsed.data.days - index - 1
    return vietnamDateKey(new Date(todayStart.getTime() - offset * DAY_MS))
  })
  const from = dateKeys[0]
  const fromIso = new Date(`${from}T00:00:00+07:00`).toISOString()
  const toExclusiveIso = new Date(todayStart.getTime() + DAY_MS).toISOString()
  const emptyResult: { data: any[]; error: null } = { data: [], error: null }
  const [eventsResult, problemsResult, attemptsResult] = studentIds.length
    ? await Promise.all([
        fetchAllRows<{ user_id: string; occurred_at: string }>((from, to) => admin.from('user_activity_events').select('user_id, occurred_at').in('user_id', studentIds).eq('event_type', 'login_success').gte('occurred_at', fromIso).lt('occurred_at', toExclusiveIso).order('occurred_at').range(from, to)),
        fetchAllRows<{ id: string; student_id: string; created_at: string }>((from, to) => admin.from('math_problems').select('id, student_id, created_at').in('student_id', studentIds).gte('created_at', fromIso).lt('created_at', toExclusiveIso).order('created_at').range(from, to)),
        fetchAllRows<{ student_id: string; verdict: string; created_at: string }>((from, to) => admin.from('student_attempts').select('student_id, verdict, created_at').in('student_id', studentIds).gte('created_at', fromIso).lt('created_at', toExclusiveIso).order('created_at').range(from, to)),
      ])
    : [emptyResult, emptyResult, emptyResult]
  if (eventsResult.error || problemsResult.error || attemptsResult.error) math5Error(503, 'Không thể tổng hợp thống kê lớp học.')

  const dailyByDate = new Map<string, {
    logins: Set<string>
    questions: number
    askers: Set<string>
    retries: number
    correctRetries: number
  }>(dateKeys.map(date => [date, { logins: new Set(), questions: 0, askers: new Set(), retries: 0, correctRetries: 0 }]))
  for (const item of eventsResult.data || []) dailyByDate.get(vietnamDateKey(item.occurred_at))?.logins.add(item.user_id)
  for (const item of problemsResult.data || []) {
    const day = dailyByDate.get(vietnamDateKey(item.created_at))
    if (day) {
      day.questions += 1
      day.askers.add(item.student_id)
    }
  }
  for (const item of attemptsResult.data || []) {
    const day = dailyByDate.get(vietnamDateKey(item.created_at))
    if (day) {
      day.retries += 1
      if (item.verdict === 'correct') day.correctRetries += 1
    }
  }

  const daily: TeacherDailyMetric[] = dateKeys.map((date) => {
    const item = dailyByDate.get(date)!
    return {
      date,
      label: shortDateLabel(date),
      loggedInStudents: item.logins.size,
      questions: item.questions,
      askingStudents: item.askers.size,
      retries: item.retries,
      correctRetries: item.correctRetries,
    }
  })
  const loggedInStudentIds = new Set((eventsResult.data || []).map(item => item.user_id))
  const askingStudentIds = new Set((problemsResult.data || []).map(item => item.student_id))
  const retries = (attemptsResult.data || []).length
  const correctRetries = (attemptsResult.data || []).filter(item => item.verdict === 'correct').length
  const result: TeacherDashboard = {
    classroom: classes.find(item => item.id === selected.id)!,
    classes,
    range: { days: parsed.data.days, from, to: today },
    totals: {
      students: studentIds.length,
      loggedInStudents: loggedInStudentIds.size,
      questions: (problemsResult.data || []).length,
      askingStudents: askingStudentIds.size,
      retries,
      correctRetries,
      retryAccuracy: retries ? Math.round((correctRetries / retries) * 100) : null,
    },
    daily,
  }
  return { data: result }
})
