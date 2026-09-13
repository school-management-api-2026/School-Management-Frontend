import { useState, useEffect } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ClipboardList, Gauge, TrendingUp, Award } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as resultService from '../api/services/resultService'
import * as enrollmentService from '../api/services/enrollmentService'
import * as examService from '../api/services/examService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import FilterDropdown from '../components/common/FilterDropdown'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import StatCard from '../components/common/StatCard'
import ChartCard from '../components/common/ChartCard'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

const LETTER_GRADES = ['A', 'B', 'C', 'D', 'E', 'F']

const GRADE_STYLES = {
  'A+': 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500',
  'A': 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500',
  'A-': 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500',
  'B+': 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500',
  'B': 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500',
  'B-': 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500',
  'C+': 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500',
  'C': 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500',
  'D': 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-500',
  'E': 'bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-500',
  'F': 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500',
}

const GRADE_FILLS = { A: '#22c55e', B: '#84cc16', C: '#facc15', D: '#f59e0b', E: '#f97316', F: '#ef4444' }

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 px-3 py-2 text-xs shadow-lg">
      {label && <p className="font-semibold text-surface-900 dark:text-white mb-1">{label}</p>}
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          {p.color && <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />}
          <span className="text-surface-500 dark:text-surface-400 capitalize">{p.name}:</span>
          <span className="font-medium text-surface-900 dark:text-white">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function autoGrade(score) {
  const s = Number(score)
  if (s >= 90) return 'A'
  if (s >= 80) return 'B'
  if (s >= 70) return 'C'
  if (s >= 60) return 'D'
  if (s >= 50) return 'E'
  return 'F'
}

const studentName = row => row.enrollment?.student?.user?.name || '—'
const studentInitials = row => (studentName(row) === '—' ? '?' : studentName(row).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase())

function GradeBadge({ grade }) {
  if (!grade) return <span className="text-surface-400">—</span>
  return (
    <span className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 py-1 rounded-lg text-xs font-bold ${GRADE_STYLES[grade] || 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'}`}>
      {grade}
    </span>
  )
}

export default function Results() {
  const toast = useToast()
  const crud = useApiCrud(resultService)
  const [enrollments, setEnrollments] = useState([])
  const [exams, setExams] = useState([])
  const [gradeFilter, setGradeFilter] = useState('')
  const [examFilter, setExamFilter] = useState('')

  useEffect(() => {
    enrollmentService.getAll().then(res => setEnrollments(res.data?.data ?? res.data ?? [])).catch(() => setEnrollments([]))
    examService.getAll().then(res => setExams(res.data?.data ?? res.data ?? [])).catch(() => setExams([]))
  }, [])

  const all = crud.data
  const scores = all.map(r => Number(r.score)).filter(n => !Number.isNaN(n))
  const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0'
  const passCount = scores.filter(s => s >= 50).length
  const passRate = scores.length ? Math.round((passCount / scores.length) * 100) : 0
  const topScore = scores.length ? Math.max(...scores) : 0
  const failCount = scores.length - passCount

  const gradeDist = LETTER_GRADES
    .map(g => ({ grade: g, count: all.filter(r => autoGrade(r.score) === g).length }))
    .filter(d => d.count > 0)

  const passFail = [
    { name: 'Pass', value: passCount },
    { name: 'Fail', value: failCount },
  ]

  const gradeOptions = LETTER_GRADES
    .filter(g => all.some(r => (r.grade || autoGrade(r.score)) === g))
    .map(g => ({ value: g, label: g }))

  const examOptions = [...new Set(all.map(r => r.exam?.exam_type).filter(Boolean))]
    .map(t => ({ value: t, label: t }))

  const filteredRows = crud.filtered.filter(r => {
    const matchesGrade = !gradeFilter || (r.grade || autoGrade(r.score)) === gradeFilter
    const matchesExam = !examFilter || r.exam?.exam_type === examFilter
    return matchesGrade && matchesExam
  })

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / crud.perPage))
  const rows = filteredRows.slice((crud.currentPage - 1) * crud.perPage, crud.currentPage * crud.perPage)

  const columns = [
    {
      key: 'student',
      label: 'Student',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-400">
            {studentInitials(row)}
          </div>
          <div>
            <p className="font-medium text-surface-900 dark:text-white">{studentName(row)}</p>
            <p className="text-xs text-surface-400">{row.enrollment?.course?.subject?.name || ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'exam',
      label: 'Exam',
      render: (_, row) => (
        <div>
          <p className="font-medium text-surface-900 dark:text-white">{row.exam?.subject?.name || '—'}</p>
          <p className="text-xs text-surface-400">{row.exam?.exam_type}{row.exam?.exam_date ? ` · ${row.exam.exam_date}` : ''}</p>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: v => {
        const n = Number(v)
        const passed = n >= 55
        return (
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, n)}%`, background: passed ? '#22c55e' : '#ef4444' }} />
            </div>
            <span className={`font-semibold ${passed ? 'text-success-600 dark:text-success-500' : 'text-danger-600 dark:text-danger-500'}`}>{v}</span>
          </div>
        )
      },
    },
    {
      key: 'grade',
      label: 'Grade',
      render: v => <GradeBadge grade={v} />,
    },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.enrollment_id || !f.exam_id || f.score === undefined || f.score === '' || f.score === null) {
      toast.error('Student (enrollment), exam, and score are required'); return
    }
    const grade = autoGrade(f.score)
    const payload = { enrollment_id: Number(f.enrollment_id), exam_id: Number(f.exam_id), score: Number(f.score), grade }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Result updated' : 'Result created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Result deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Results" description="Manage and analyze exam results" onAdd={() => crud.openAdd({})} addLabel="Add Result" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Results" value={all.length} icon={ClipboardList} color="primary" />
        <StatCard title="Average Score" value={avgScore} icon={Gauge} color="info" />
        <StatCard title="Pass Rate" value={`${passRate}%`} icon={TrendingUp} color="success" />
        <StatCard title="Top Score" value={topScore} icon={Award} color="warning" />
      </div>

      {!crud.loading && crud.data.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ChartCard title="Grade Distribution">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradeDist} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="grade" tick={{ fontSize: 13, fontWeight: 600 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#e2e8f0', opacity: 0.35 }} content={ChartTooltip} />
                  <Bar dataKey="count" name="Students" radius={[8, 8, 0, 0]}>
                    {gradeDist.map(entry => <Cell key={entry.grade} fill={GRADE_FILLS[entry.grade] || '#6366f1'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
          <ChartCard title="Pass / Fail">
            <div className="relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={passFail} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={4} cornerRadius={6} dataKey="value" startAngle={90} endAngle={-270}>
                    <Cell key="pass" fill="#22c55e" />
                    <Cell key="fail" fill="#ef4444" />
                  </Pie>
                  <Tooltip content={ChartTooltip} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-14">
                <p className="text-3xl font-bold text-surface-900 dark:text-white">{passRate}%</p>
                <p className="text-xs text-surface-400 mt-1">Pass Rate</p>
              </div>
            </div>
          </ChartCard>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="max-w-sm w-full"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search results..." /></div>
        <div className="flex items-center gap-3">
          <FilterDropdown label="All Grades" value={gradeFilter} onChange={v => { setGradeFilter(v); crud.setCurrentPage(1) }} options={gradeOptions} />
          <FilterDropdown label="All Exams" value={examFilter} onChange={v => { setExamFilter(v); crud.setCurrentPage(1) }} options={examOptions} />
        </div>
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && filteredRows.length === 0 ? (
        <EmptyState title="No results found" action={() => crud.openAdd({})} actionLabel="Add Result" />
      ) : (
        <>
          <DataTable columns={columns} data={rows} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Result' : 'Add Result'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Student — Course" required><Select value={crud.formData.enrollment_id || ''} onChange={e => crud.updateForm('enrollment_id', e.target.value)}><option value="">Select Student</option>{enrollments.map(en => <option key={en.id} value={en.id}>{en.student?.user?.name} — {en.course?.subject?.name}</option>)}</Select></FormField>
          <FormField label="Exam" required><Select value={crud.formData.exam_id || ''} onChange={e => crud.updateForm('exam_id', e.target.value)}><option value="">Select Exam</option>{exams.map(x => <option key={x.id} value={x.id}>{x.subject?.name} — {x.exam_type} ({x.exam_date})</option>)}</Select></FormField>
          <FormField label="Score" required><Input type="number" min="0" max="100" value={crud.formData.score ?? ''} onChange={e => crud.updateForm('score', e.target.value)} placeholder="0-100" /></FormField>
          <p className="text-xs text-surface-400 dark:text-surface-500">Grade will be auto-calculated: {crud.formData.score !== undefined && crud.formData.score !== '' ? autoGrade(crud.formData.score) : '—'}</p>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Result Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Student: studentName(crud.selected),
              Exam: examName(crud.selected),
              Score: crud.selected.score,
              Grade: <GradeBadge grade={crud.selected.grade || '—'} />,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v ?? '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Result" message="Delete this result?" />
    </div>
  )
}

function examName(row) {
  const subject = row.exam?.subject?.name || ''
  const type = row.exam?.exam_type || ''
  return `${subject}${type ? ` — ${type}` : ''}`.trim() || '—'
}