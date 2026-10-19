import { math5Error } from './math5-errors'
import { useMath5SupabaseAdmin } from './math5-supabase'

export async function getTeacherOwnedClasses(teacherId: string) {
  const admin = useMath5SupabaseAdmin()
  const { data, error } = await admin
    .from('classrooms')
    .select('id, name, class_code, school_name')
    .eq('teacher_id', teacherId)
    .order('class_code')
  if (error) math5Error(503, 'Không thể tải lớp chủ nhiệm.')
  return data || []
}

export async function requireTeacherStudent(teacherId: string, studentId: string) {
  const admin = useMath5SupabaseAdmin()
  const classes = await getTeacherOwnedClasses(teacherId)
  if (!classes.length) math5Error(404, 'Tài khoản chưa được phân công lớp chủ nhiệm.')
  const classIds = classes.map(item => item.id)
  const { data: membership, error } = await admin
    .from('classroom_members')
    .select('classroom_id, student_id')
    .eq('student_id', studentId)
    .in('classroom_id', classIds)
    .maybeSingle()
  if (error) math5Error(503, 'Không thể kiểm tra quyền quản lý học sinh.')
  if (!membership) math5Error(404, 'Không tìm thấy học sinh thuộc lớp chủ nhiệm.')
  return { classes, membership }
}
