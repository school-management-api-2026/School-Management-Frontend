import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as resultService from '../api/services/resultService'
import * as enrollmentService from '../api/services/enrollmentService'
import * as examService from '../api/services/examService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

function autoGrade(score) {
  const s = Number(score)
  if (s >= 95) return 'A+'
  if (s >= 90) return 'A'
  if (s >= 85) return 'A-'
  if (s >= 80) return 'B+'
  if (s >= 75) return 'B'
  if (s >= 70) return 'B-'
  if (s >= 65) return 'C+'
  if (s >= 60) return 'C'
  if (s >= 55) return 'D'
  return 'F'
}

const studentName = row => row.enrollment?.student?.user?.name || '—'
const examName = row => row.exam ? `${row.exam.subject?.name || ''} — ${row.exam.exam_type || ''}`.trim() || '—' : '—'

export default function Results() {
  const toast = useToast()
  const crud = useApiCrud(resultService)
  const [enrollments, setEnrollments] = useState([])
  const [exams, setExams] = useState([])

  useEffect(() => {
    enrollmentService.getAll().then(res => setEnrollments(res.data?.data ?? res.data ?? [])).catch(() => setEnrollments([]))
    examService.getAll().then(res => setExams(res.data?.data ?? res.data ?? [])).catch(() => setExams([]))
  }, [])

  const columns = [
    { key: 'student', label: 'Student', render: (_, row) => studentName(row) },
    { key: 'exam', label: 'Exam', render: (_, row) => examName(row) },
    { key: 'score', label: 'Score' },
    { key: 'grade', label: 'Grade', render: v => <span className="font-semibold">{v || '—'}</span> },
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
    <div className="space-y-4">
      <PageHeader title="Results" description="Manage exam results" onAdd={() => crud.openAdd({})} addLabel="Add Result" />
      <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search results..." /></div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No results found" action={() => crud.openAdd({})} actionLabel="Add Result" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
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
              Grade: crud.selected.grade || '—',
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