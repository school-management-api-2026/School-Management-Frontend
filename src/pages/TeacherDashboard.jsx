import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Users, CalendarDays, ClipboardCheck, ArrowRight, BookMarked, Clock, UserRoundCheck, RefreshCw, Pencil } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import * as teacherCourseService from '../api/services/teacherCourseService'
import * as scheduleService from '../api/services/scheduleService'
import * as examService from '../api/services/examService'
import * as enrollmentService from '../api/services/enrollmentService'
import * as attendanceService from '../api/services/attendanceService'
import * as studentService from '../api/services/studentService'
import StatCard from '../components/common/StatCard'
import ChartCard from '../components/common/ChartCard'
import Modal from '../components/common/Modal'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'
import { useToast } from '../context/ToastContext'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#0ea5e9']

const extract = res => res?.data?.data ?? res?.data ?? []

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 px-3 py-2 text-xs shadow-lg">
      {label && <p className="font-semibold text-surface-900 dark:text-white mb-1">{label}</p>}
      {payload.map(p => (
        <div key={p.dataKey || p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.payload?.fill || p.color || '#6366f1' }} />
          <span className="text-surface-500 dark:text-surface-400 capitalize">{p.name}:</span>
          <span className="font-medium text-surface-900 dark:text-white">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const [editStudent, setEditStudent] = useState(null)
  const [studentForm, setStudentForm] = useState({})
  const [savingStudent, setSavingStudent] = useState(false)

  const [teacherCourses, setTeacherCourses] = useState([])
  const [schedules, setSchedules] = useState([])
  const [exams, setExams] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [attendance, setAttendance] = useState([])
  const [studentList, setStudentList] = useState([])

  const currentUser = useMemo(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }, [])

  const loadData = useCallback((silent = false) => {
    if (!silent) setLoading(true)

return Promise.allSettled([
      teacherCourseService.getAll(),
      scheduleService.getAll(),
      examService.getAll(),
      enrollmentService.getAll(),
      attendanceService.getAll(),
      studentService.getAll(),
    ])
      .then(([tcRes, schedRes, examRes, enrollRes, attRes, studentRes]) => {
        setTeacherCourses(extract(tcRes.value))
        setSchedules(extract(schedRes.value))
        setExams(extract(examRes.value))
        setEnrollments(extract(enrollRes.value))
        setAttendance(extract(attRes.value))
        setStudentList(extract(studentRes.value))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let cancelled = false

    Promise.allSettled([
      teacherCourseService.getAll(),
      scheduleService.getAll(),
      examService.getAll(),
      enrollmentService.getAll(),
      attendanceService.getAll(),
      studentService.getAll(),
    ])
      .then(([tcRes, schedRes, examRes, enrollRes, attRes, studentRes]) => {
        if (cancelled) return
        setTeacherCourses(extract(tcRes.value))
        setSchedules(extract(schedRes.value))
        setExams(extract(examRes.value))
        setEnrollments(extract(enrollRes.value))
        setAttendance(extract(attRes.value))
        setStudentList(extract(studentRes.value))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const onFocus = () => loadData(true)
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [loadData])

  const myCourseIds = useMemo(() => {
    const matched = []
    const myUserId = currentUser?.id ?? currentUser?.user_id
    teacherCourses.forEach(tc => {
      const teacherUserId = tc.teacher?.user?.id ?? tc.teacher?.user_id
      if (String(teacherUserId) === String(myUserId) && tc.course?.id) {
        matched.push(tc.course.id)
      }
    })
    if (matched.length > 0) return new Set(matched)
    return new Set(teacherCourses.map(tc => tc.course?.id).filter(Boolean))
  }, [teacherCourses, currentUser])

  const openEditStudent = (s) => {
    setStudentForm({
      studentId: s.studentId,
      name: s.name,
      email: s.email,
      phone: s.phone || '',
      gender: s.gender || '',
      date_of_birth: s.date_of_birth || '',
    })
    setEditStudent(s)
  }

  const setStudentField = (k, v) => setStudentForm(prev => ({ ...prev, [k]: v }))

  const saveStudent = async () => {
    if (!studentForm.name || !studentForm.email) {
      toast.error('Name and email are required')
      return
    }
    setSavingStudent(true)
    try {
      await studentService.update(studentForm.studentId, {
        name: studentForm.name,
        email: studentForm.email,
        phone: studentForm.phone,
        gender: studentForm.gender,
        date_of_birth: studentForm.date_of_birth,
        role_id: 4,
      })
      toast.success('Student updated')
      setEditStudent(null)
      loadData(true)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update student')
    } finally {
      setSavingStudent(false)
    }
  }

  const teacherName = currentUser?.name
    ? currentUser.name
    : (teacherCourses[0]?.teacher?.user?.name || 'Teacher')

  const todayLabel = useMemo(() => DAY_NAMES[new Date().getDay()] || 'Monday', [])
  const d = new Date()
  const todayDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const todayClasses = useMemo(() => {
    return schedules
      .filter(s => s.day_of_week === todayLabel && myCourseIds.has(s.teacher_course?.course?.id))
      .sort((a, b) => (a.time_start || '').localeCompare(b.time_start || ''))
  }, [schedules, todayLabel, myCourseIds])

  const myStudents = useMemo(() => {
    const courseByKey = new Map()
    enrollments.forEach(e => {
      if (!myCourseIds.has(e.course?.id)) return
      const key = String(e.student?.user_id ?? e.student?.id)
      if (!key) return
      const set = courseByKey.get(key) || new Set()
      if (e.course?.subject?.name) set.add(e.course.subject.name)
      courseByKey.set(key, set)
    })

    const byKey = new Map()
    studentList.forEach(s => {
      const user = s.user || s
      const key = String(user.id ?? s.id)
      if (!key) return
      byKey.set(key, {
        id: key,
        studentId: s.id,
        name: user.name || s.name || 'Student',
        email: user.email || '',
        image: user.image || '',
        phone: user.phone || '',
        gender: user.gender || '',
        date_of_birth: user.date_of_birth || '',
        courses: new Set(courseByKey.get(key) || []),
      })
    })

    courseByKey.forEach((set, key) => {
      if (!byKey.has(key)) {
        const e = enrollments.find(er => String(er.student?.user_id ?? er.student?.id) === key)
        if (e?.student) {
          byKey.set(key, {
            id: key,
            studentId: e.student.id,
            name: e.student.user?.name || e.student?.name || 'Student',
            email: e.student.user?.email || '',
            image: e.student.user?.image || '',
            phone: e.student.user?.phone || '',
            gender: e.student.user?.gender || '',
            date_of_birth: e.student.user?.date_of_birth || '',
            courses: new Set(set),
          })
        }
      } else {
        set.forEach(c => byKey.get(key).courses.add(c))
      }
    })

    return Array.from(byKey.values()).map(x => ({ ...x, courses: [...x.courses] }))
  }, [studentList, enrollments, myCourseIds])

  const upcomingExams = useMemo(() => {
    return exams
      .filter(ex =>
        myCourseIds.has(ex.course?.id) &&
        (!ex.exam_date || ex.exam_date >= todayDate)
      )
      .sort((a, b) => (a.exam_date || '').localeCompare(b.exam_date || ''))
      .slice(0, 6)
  }, [exams, myCourseIds, todayDate])

  const daysLeft = (examDate) => {
    if (!examDate) return null
    const diff = Math.ceil((new Date(`${examDate}T00:00:00`) - new Date(`${todayDate}T00:00:00`)) / 86400000)
    return diff
  }

  const attendanceToday = useMemo(() => {
    const today = attendance.filter(a => a.date === todayDate)
    if (myCourseIds.size === 0) return today
    return today.filter(a => !a.teacher_course?.course?.id || myCourseIds.has(a.teacher_course.course.id))
  }, [attendance, todayDate, myCourseIds])

  const mySchedules = useMemo(() => {
    return schedules.filter(s => myCourseIds.has(s.teacher_course?.course?.id))
  }, [schedules, myCourseIds])

  const weeklySlots = useMemo(() => {
    const times = new Set(mySchedules.map(s => s.time_start?.slice(0, 5)).filter(Boolean))
    return [...times].sort((a, b) => a.localeCompare(b))
  }, [mySchedules])

  const attendanceTotals = useMemo(() => {
    const t = { present: 0, late: 0, absent: 0, permission: 0 }
    attendance.forEach(a => {
      if (!myCourseIds.has(a.teacher_course?.course?.id)) return
      const st = String(a.status || '').toLowerCase()
      if (st === 'present' || st === 'persent') t.present += 1
      else if (st === 'late') t.late += 1
      else if (st === 'permission' || st === 'excused') t.permission += 1
      else t.absent += 1
    })
    return t
  }, [attendance, myCourseIds])

  const attendancePie = useMemo(() => {
    return [
      { name: 'Present', value: attendanceTotals.present },
      { name: 'Late', value: attendanceTotals.late },
      { name: 'Absent', value: attendanceTotals.absent },
      { name: 'Permission', value: attendanceTotals.permission },
    ].filter(x => x.value > 0)
  }, [attendanceTotals])

  const enrollmentByClass = useMemo(() => {
    return teacherCourses
      .filter(tc => myCourseIds.has(tc.course?.id))
      .map(tc => ({
        name: tc.course?.subject?.name || 'Course',
        students: enrollments.filter(e => e.course?.id === tc.course?.id && String(e.status).toLowerCase() !== 'dropped').length,
      }))
  }, [teacherCourses, myCourseIds, enrollments])

  const sessionsPerDay = useMemo(() => {
    return WEEK_DAYS.map(day => ({
      day: day.slice(0, 3),
      classes: schedules.filter(s => s.day_of_week === day && myCourseIds.has(s.teacher_course?.course?.id)).length,
    }))
  }, [schedules, myCourseIds])

  const attendanceByClassChart = useMemo(() => {
    const perSubject = new Map()
    attendance.forEach(a => {
      if (!myCourseIds.has(a.teacher_course?.course?.id)) return
      const subject = a.teacher_course?.course?.subject?.name || '—'
      const cur = perSubject.get(subject) || { name: subject, Present: 0, Late: 0, Absent: 0, Permission: 0 }
      const st = String(a.status || '').toLowerCase()
      if (st === 'present' || st === 'persent') cur.Present += 1
      else if (st === 'late') cur.Late += 1
      else if (st === 'permission' || st === 'excused') cur.Permission += 1
      else cur.Absent += 1
      perSubject.set(subject, cur)
    })
    return Array.from(perSubject.values())
  }, [attendance, myCourseIds])

  const classSize = (courseId) => {
    return enrollments.filter(e => e.course?.id === courseId && String(e.status).toLowerCase() !== 'dropped').length
  }

  const courseStats = (courseId) => {
    const size = classSize(courseId)
    const sessions = mySchedules.filter(s => s.teacher_course?.course?.id === courseId).length
    const capacity = teacherCourses.find(tc => tc.course?.id === courseId)?.course?.capacity || 0
    return { size, sessions, capacity }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-surface-900 dark:text-white">Teacher Dashboard</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Welcome back, {teacherName}! Here&apos;s your overview for {todayLabel}.
          </p>
        </div>
<div className="flex items-center gap-3">
          {loading && (
            <span className="inline-flex items-center gap-1.5 text-xs text-surface-400">
              <ClipboardCheck size={13} className="animate-spin" />
              Loading…
            </span>
          )}
          <button
          type="button"
          onClick={() => loadData(true)}
          className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-300 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
        <Link
          to="/teacher/profile"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          My Profile
          <ArrowRight size={16} />
        </Link>
      </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Classes" value={myCourseIds.size} icon={BookOpen} color="primary" />
        <StatCard title="My Students" value={myStudents.length} icon={Users} color="info" />
        <StatCard title="Classes Today" value={todayClasses.length} icon={CalendarDays} color="success" />
        <StatCard title="Attendance Recorded Today" value={attendanceToday.length} icon={ClipboardCheck} color="warning" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/teacher/take-attendance" className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 flex items-center gap-3 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-500/10 flex items-center justify-center">
            <UserRoundCheck size={20} className="text-success-600 dark:text-success-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-surface-900 dark:text-white">Take Attendance</p>
            <p className="text-xs text-surface-400">Mark students for today&apos;s classes</p>
          </div>
          <ArrowRight size={16} className="text-surface-300 group-hover:text-primary-500 transition-colors" />
        </Link>
        <Link to="/teacher/schedules" className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 flex items-center gap-3 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
            <CalendarDays size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-surface-900 dark:text-white">View Schedule</p>
            <p className="text-xs text-surface-400">See your weekly timetable</p>
          </div>
          <ArrowRight size={16} className="text-surface-300 group-hover:text-primary-500 transition-colors" />
        </Link>
        <Link to="/teacher/profile" className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-4 flex items-center gap-3 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-xl bg-info-50 dark:bg-info-500/10 flex items-center justify-center">
            <BookMarked size={20} className="text-info-600 dark:text-info-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-surface-900 dark:text-white">My Profile</p>
            <p className="text-xs text-surface-400">Update your account details</p>
          </div>
          <ArrowRight size={16} className="text-surface-300 group-hover:text-primary-500 transition-colors" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Attendance Breakdown">
          {attendancePie.length === 0 ? (
            <p className="flex items-center justify-center h-[260px] text-sm text-surface-400">No attendance data yet.</p>
          ) : (
            <div className="relative">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={attendancePie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" startAngle={90} endAngle={-270} isAnimationActive={false}>
                    {attendancePie.map((entry, i) => <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={ChartTooltip} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ transform: 'translateY(-14px)' }}>
                <p className="text-2xl font-bold text-surface-900 dark:text-white">{attendancePie.reduce((sum, x) => sum + x.value, 0)}</p>
                <p className="text-xs text-surface-400 mt-0.5">Records</p>
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Students per Class">
          {enrollmentByClass.length === 0 ? (
            <p className="flex items-center justify-center h-[260px] text-sm text-surface-400">No classes yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={enrollmentByClass} margin={{ left: -16, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#e2e8f0', opacity: 0.35 }} content={ChartTooltip} />
                <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} name="Students" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-success-500" />
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">My Weekly Schedule</h3>
          </div>
          <span className="text-xs text-surface-400">{myCourseIds.size} classes</span>
        </div>
        {weeklySlots.length === 0 ? (
          <p className="px-5 py-8 text-sm text-surface-400 text-center">No classes scheduled this week.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50">
                  <th className="px-5 py-3 font-medium text-surface-500 dark:text-surface-400">Time</th>
                  {WEEK_DAYS.map(d => (
                    <th key={d} className="px-5 py-3 font-medium text-surface-500 dark:text-surface-400 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        {d}
                        {d === todayLabel && <span className="w-1.5 h-1.5 bg-success-500 rounded-full" />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                {weeklySlots.map(time => (
                  <tr key={time} className="bg-white dark:bg-surface-900">
                    <td className="px-5 py-3 text-xs text-surface-400 font-mono whitespace-nowrap align-top">{time}</td>
                    {WEEK_DAYS.map(day => {
                      const items = mySchedules.filter(s => s.day_of_week === day && s.time_start?.slice(0, 5) === time)
                      return (
                        <td key={day} className="px-3 py-2 align-top">
                          {items.map(s => (
                            <div key={s.id} className={`mb-1 last:mb-0 rounded-lg border px-2 py-1.5 ${day === todayLabel ? 'bg-success-50 dark:bg-success-500/10 border-success-200 dark:border-success-500/20' : 'bg-primary-50 dark:bg-primary-500/10 border-primary-200 dark:border-primary-500/20'}`}>
                              <p className="text-xs font-semibold text-surface-900 dark:text-white truncate">{s.teacher_course?.course?.subject?.name || 'Course'}</p>
                              <p className="text-[10px] text-surface-400 truncate">{s.room?.name || s.room?.room_number || 'Room'} · {s.time_start?.slice(0, 5)}-{s.time_out?.slice(0, 5)}</p>
                            </div>
                          ))}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Classes per Day">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={sessionsPerDay} margin={{ left: -16, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: '#e2e8f0', opacity: 0.35 }} content={ChartTooltip} />
              <Bar dataKey="classes" fill="#22c55e" radius={[4, 4, 0, 0]} name="Classes" isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Attendance by Class">
          {attendanceByClassChart.length === 0 ? (
            <p className="flex items-center justify-center h-[260px] text-sm text-surface-400">No attendance data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={attendanceByClassChart} margin={{ left: -16, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" axisLine={false} tickLine={false} interval={0} />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#e2e8f0', opacity: 0.35 }} content={ChartTooltip} />
                <Bar dataKey="Present" stackId="a" fill="#22c55e" name="Present" isAnimationActive={false} />
                <Bar dataKey="Late" stackId="a" fill="#f59e0b" name="Late" isAnimationActive={false} />
                <Bar dataKey="Absent" stackId="a" fill="#ef4444" name="Absent" isAnimationActive={false} />
                <Bar dataKey="Permission" stackId="a" fill="#0ea5e9" name="Permission" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-success-500" />
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Today&apos;s Schedule</h3>
            </div>
            <Link to="/teacher/take-attendance" className="text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 inline-flex items-center gap-1">
              Take Attendance
              <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {todayClasses.length === 0 && <p className="px-5 py-8 text-sm text-surface-400 text-center">No classes scheduled for today.</p>}
            {todayClasses.map(s => (
              <div key={s.id} className="px-5 py-3 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary-700 dark:text-primary-400">
                      {s.time_start ? s.time_start.slice(0, 5) : '--'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{s.teacher_course?.course?.subject?.name || 'Course'}</p>
                    <p className="text-xs text-surface-400">
                      {s.room?.name || s.room?.room_number || 'Room'} · {s.time_start?.slice(0, 5)} - {s.time_out?.slice(0, 5)}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-surface-400">{classSize(s.teacher_course?.course?.id)} students</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center gap-2">
            <BookMarked size={16} className="text-warning-500" />
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Upcoming Exams</h3>
          </div>
          <div className="divide-y divide-surface-100 dark:divide-surface-700">
            {upcomingExams.length === 0 && <p className="px-5 py-8 text-sm text-surface-400 text-center">No upcoming exams.</p>}
            {upcomingExams.map(ex => {
              const days = daysLeft(ex.exam_date)
              return (
                <div key={ex.id} className="px-5 py-3 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {ex.exam_date ? (
                      <div className="w-14 h-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary-700 dark:text-primary-400 leading-none">{ex.exam_date.slice(8, 10)}</span>
                        <span className="text-[10px] uppercase text-primary-500 dark:text-primary-400/70 mt-0.5">
                          {new Date(`${ex.exam_date}T00:00:00`).toLocaleString('en', { month: 'short' })}
                        </span>
                      </div>
                    ) : (
                      <div className="w-14 h-12 rounded-xl bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
                        <Clock size={18} className="text-surface-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">{ex.course?.subject?.name || ex.subject?.name || 'Course'}</p>
                      <p className="text-xs text-surface-400">Type: {ex.exam_type || '—'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {days !== null && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${days === 0 ? 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500' : 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500'}`}>
                        {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `in ${days} days`}
                      </span>
                    )}
                    <p className="text-xs text-surface-400 mt-1">{ex.exam_date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-primary-500" />
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white">My Classes</h3>
            </div>
            <Link to="/teacher/schedules" className="text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 inline-flex items-center gap-1">
              View Schedule
              <ArrowRight size={14} />
            </Link>
          </div>
          {myCourseIds.size === 0 ? (
            <p className="px-5 py-8 text-sm text-surface-400 text-center">No classes assigned yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-surface-50 dark:bg-surface-800/50">
                    <th className="px-5 py-3 font-medium text-surface-500 dark:text-surface-400">Course</th>
                    <th className="px-5 py-3 font-medium text-surface-500 dark:text-surface-400 text-right">Enrollment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                  {teacherCourses
                    .filter(tc => myCourseIds.has(tc.course?.id))
                    .map(tc => {
                      const { size, sessions, capacity } = courseStats(tc.course?.id)
                      const pct = capacity > 0 ? Math.round((size / capacity) * 100) : 0
                      return (
                        <tr key={tc.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center">
                                <BookOpen size={18} className="text-primary-700 dark:text-primary-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-surface-900 dark:text-white">{tc.course?.subject?.name || 'Course'}</p>
                                <p className="text-xs text-surface-400">
                                  {tc.course?.subject?.code || '—'}
                                  <span className="mx-1.5 text-surface-300 dark:text-surface-600">·</span>
                                  <span className="inline-flex items-center gap-0.5">
                                    <CalendarDays size={11} />
                                    {sessions} sessions/wk
                                  </span>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <p className="text-sm font-semibold text-surface-900 dark:text-white">{size}<span className="font-normal text-surface-400 dark:text-surface-500"> / {capacity || '—'}</span></p>
                            {capacity > 0 && (
                              <div className="mt-1.5 flex items-center justify-end gap-2">
                                <div className="w-20 h-1.5 rounded-full bg-surface-100 dark:bg-surface-700 overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 90 ? 'var(--color-danger-500, #ef4444)' : pct >= 70 ? 'var(--color-warning-500, #f59e0b)' : 'var(--color-success-500, #10b981)' }} />
                                </div>
                                <span className="text-[11px] font-medium text-surface-400 w-8 text-right">{pct}%</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-info-500" />
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white">My Students</h3>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-info-50 text-info-600 dark:bg-info-500/10 dark:text-info-400">
              {myStudents.length} students
            </span>
          </div>
          {myStudents.length === 0 ? (
            <p className="px-5 py-8 text-sm text-surface-400 text-center">No students enrolled in your classes.</p>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-surface-100 dark:divide-surface-700">
              {myStudents.map(s => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors group">
                  {s.image ? (
                    <img src={s.image} alt={s.name} className="w-10 h-10 rounded-full object-cover border border-surface-200 dark:border-surface-700 shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-info-400 to-info-600 dark:from-info-500 dark:to-info-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {(s.name || 'S').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{s.name}</p>
                    </div>
                    <p className="text-xs text-surface-400 truncate mt-0.5">{s.email || 'Student'}</p>
                    {s.courses.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {s.courses.slice(0, 2).map(c => (
                          <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">{c}</span>
                        ))}
                        {s.courses.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-100 text-surface-400 dark:bg-surface-700">+{s.courses.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => openEditStudent(s)}
                    className="p-2 rounded-lg text-surface-300 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 dark:hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit student"
                  >
                    <Pencil size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={!!editStudent}
        onClose={() => setEditStudent(null)}
        title="Edit Student"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditStudent(null)}>Cancel</Button>
            <Button onClick={saveStudent} loading={savingStudent}>Save Changes</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Full Name" required>
            <Input value={studentForm.name || ''} onChange={e => setStudentField('name', e.target.value)} placeholder="Student name" />
          </FormField>
          <FormField label="Email" required>
            <Input type="email" value={studentForm.email || ''} onChange={e => setStudentField('email', e.target.value)} placeholder="Email address" />
          </FormField>
          <FormField label="Phone">
            <Input value={studentForm.phone || ''} onChange={e => setStudentField('phone', e.target.value)} placeholder="Phone number" />
          </FormField>
          <FormField label="Gender">
            <Select value={studentForm.gender || ''} onChange={e => setStudentField('gender', e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
          </FormField>
          <FormField label="Date of Birth">
            <Input type="date" value={studentForm.date_of_birth || ''} onChange={e => setStudentField('date_of_birth', e.target.value)} />
          </FormField>
        </div>
      </Modal>
    </div>
  )
}