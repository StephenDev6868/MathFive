/*
 * Provision a school roster using Supabase Admin API.
 *
 * Usage:
 * SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/provision-school-roster.mjs \
 *   --students private-delivery/dshs-lop-5-credentials.csv \
 *   --teachers private-delivery/gvcn-mapping.csv
 *
 * The mapping file is mandatory because the supplied workbook contains students
 * only. It must provide one teacher (existing or new) for every class code.
 */
import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const SCHOOL_NAME = 'Tiểu học Bùi Thị Xuân'
const ACCOUNT_EMAIL_DOMAIN = 'accounts.math5.local'

function valueAfter(flag) {
  const index = process.argv.indexOf(flag)
  return index === -1 ? undefined : process.argv[index + 1]
}

function parseCsv(text, fileName) {
  const lines = text.trim().split(/\r?\n/)
  const [header, ...body] = lines.map((line) => line.split(','))
  if (!header?.length || body.some((row) => row.length !== header.length)) {
    throw new Error(`${fileName} must be a simple comma-separated file with a header row.`)
  }
  return body.filter((row) => row.some(Boolean)).map((row) => Object.fromEntries(header.map((key, i) => [key, row[i].trim()])))
}

function assertUsername(username, description) {
  if (!/^[a-z][a-z0-9]{2,39}$/.test(username)) {
    throw new Error(`${description}: username '${username}' is invalid.`)
  }
}

async function provisionAccount(admin, record, role) {
  assertUsername(record.username, record.full_name || role)
  const { data: current, error: lookupError } = await admin
    .from('profiles')
    .select('id, role')
    .ilike('username', record.username)
    .maybeSingle()
  if (lookupError) throw lookupError

  let userId = current?.id
  if (current && current.role !== role) {
    throw new Error(`Username '${record.username}' already belongs to a ${current.role} account.`)
  }
  if (!userId) {
    if (!/^\d{8}$/.test(record.password)) {
      throw new Error(`${record.username}: password must contain exactly eight digits.`)
    }
    const { data, error } = await admin.auth.admin.createUser({
      email: `${record.username}@${ACCOUNT_EMAIL_DOMAIN}`,
      password: record.password,
      email_confirm: true,
      user_metadata: { display_name: record.full_name },
    })
    if (error || !data.user) throw error ?? new Error(`Could not create ${record.username}.`)
    userId = data.user.id
  }

  const { error: profileError } = await admin.from('profiles').upsert({
    id: userId,
    display_name: record.full_name,
    username: record.username,
    role,
    must_change_password: true,
  })
  if (profileError) throw profileError
  return userId
}

async function main() {
  const studentsFile = valueAfter('--students')
  const teachersFile = valueAfter('--teachers')
  if (!studentsFile || !teachersFile) throw new Error('Both --students and --teachers are required.')
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
  }

  const students = parseCsv(await readFile(studentsFile, 'utf8'), studentsFile)
  const teachers = parseCsv(await readFile(teachersFile, 'utf8'), teachersFile)
  const classCodes = [...new Set(students.map((student) => student.class_code))].sort()
  if (students.length !== 319) throw new Error(`Expected 319 students, received ${students.length}.`)
  if (new Set(students.map((student) => student.username)).size !== students.length) throw new Error('Student usernames are not unique.')

  const admin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const teacherByClass = new Map()
  for (const teacher of teachers) {
    if (teacher.role !== 'teacher') throw new Error(`${teacher.full_name}: role must be teacher.`)
    const teacherId = await provisionAccount(admin, teacher, 'teacher')
    for (const classCode of teacher.class_codes.split(';').map((value) => value.trim()).filter(Boolean)) {
      if (teacherByClass.has(classCode)) throw new Error(`More than one homeroom teacher was supplied for ${classCode}.`)
      teacherByClass.set(classCode, teacherId)
    }
  }
  for (const classCode of classCodes) {
    if (!teacherByClass.has(classCode)) throw new Error(`Missing homeroom teacher mapping for ${classCode}.`)
  }

  const studentsByClass = new Map()
  for (const student of students) {
    const id = await provisionAccount(admin, student, 'student')
    const list = studentsByClass.get(student.class_code) ?? []
    list.push(id)
    studentsByClass.set(student.class_code, list)
  }

  for (const classCode of classCodes) {
    const externalKey = `btx-${classCode.replace('/', '-')}`
    const { data: classroom, error: classroomError } = await admin.from('classrooms').upsert({
      external_key: externalKey,
      name: classCode,
      class_code: classCode,
      school_name: SCHOOL_NAME,
      teacher_id: teacherByClass.get(classCode),
    }, { onConflict: 'external_key' }).select('id').single()
    if (classroomError || !classroom) throw classroomError ?? new Error(`Could not provision ${classCode}.`)
    const memberships = studentsByClass.get(classCode).map((studentId) => ({ classroom_id: classroom.id, student_id: studentId }))
    const { error: membersError } = await admin.from('classroom_members').upsert(memberships, { onConflict: 'classroom_id,student_id' })
    if (membersError) throw membersError
  }

  console.log(`Provisioned ${students.length} students into ${classCodes.length} classes.`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
