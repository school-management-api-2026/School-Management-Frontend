import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { results as mockResults, students, exams } from '../data/mockData'
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

const columns = [
  { key: 'studentName', label: 'Student' },
  { key: 'examName', label: 'Exam' },
  { key: 'score', label: 'Score' },
  { key: 'grade', label: 'Grade', render: v => <span className="font-semibold">{v}</span> },
]

export default function Results() {
  const toast = useToast()
  const crud = useCrudState(mockResults)

  const save = () => {
    if (!crud.formData.studentId || !crud.formData.examId || crud.formData.score === undefined) { toast.error('Student, exam, and score are required'); return }
    const student = students.find(s => s.id === Number(crud.formData.studentId))
    const exam = exams.find(e => e.id === Number(crud.formData.examId))
    const grade = autoGrade(crud.formData.score)
    crud.handleSave({ ...crud.formData, studentId: Number(crud.formData.studentId), examId: Number(crud.formData.examId), studentName: student?.name || '', examName: exam ? `${exam.courseName} — ${exam.examType}` : '', score: Number(crud.formData.score), grade })
    toast.success(crud.selected ? 'Result updated' : 'Result created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Results" description="Manage exam results" onAdd={() => crud.openAdd({})} addLabel="Add Result" />
      <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search results..." /></div>

      {crud.paginated.length === 0 ? <EmptyState title="No results found" action={() => crud.openAdd({})} actionLabel="Add Result" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Result' : 'Add Result'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Student" required><Select value={crud.formData.studentId || ''} onChange={e => crud.updateForm('studentId', e.target.value)}><option value="">Select Student</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></FormField>
          <FormField label="Exam" required><Select value={crud.formData.examId || ''} onChange={e => crud.updateForm('examId', e.target.value)}><option value="">Select Exam</option>{exams.map(e => <option key={e.id} value={e.id}>{e.courseName} — {e.examType} ({e.examDate})</option>)}</Select></FormField>
          <FormField label="Score" required><Input type="number" min="0" max="100" value={crud.formData.score ?? ''} onChange={e => crud.updateForm('score', e.target.value)} placeholder="0-100" /></FormField>
          <p className="text-xs text-surface-400">Grade will be auto-calculated: {crud.formData.score !== undefined && crud.formData.score !== '' ? autoGrade(crud.formData.score) : '—'}</p>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Result Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ Student: crud.selected.studentName, Exam: crud.selected.examName, Score: crud.selected.score, Grade: crud.selected.grade }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v ?? '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Result deleted') }} title="Delete Result" message="Delete this result?" />
    </div>
  )
}
