import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as examService from '../api/services/examService'
import * as courseService from '../api/services/courseService'
import * as subjectService from '../api/services/subjectService'
import * as teacherService from '../api/services/teacherService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import FilterDropdown from '../components/common/FilterDropdown'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

const examTypes = ['Quiz', 'Midterm', 'Final', 'Assignment']

export default function Exams() {
  const toast = useToast()
  const crud = useApiCrud(examService)
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    courseService.getAll().then(res => setCourses(res.data?.data ?? res.data ?? [])).catch(() => setCourses([]))
    subjectService.getAll().then(res => setSubjects(res.data?.data ?? res.data ?? [])).catch(() => setSubjects([]))
    teacherService.getAll().then(res => setTeachers(res.data?.data ?? res.data ?? [])).catch(() => setTeachers([]))
  }, [])

  const columns = [
    { key: 'exam_date', label: 'Date' },
    { key: 'exam_type', label: 'Type' },
    { key: 'subject', label: 'Subject', render: (_, row) => row.subject?.name || '—' },
    { key: 'course', label: 'Course', render: (_, row) => row.course?.subject?.name || '—' },
    { key: 'teacher', label: 'Teacher', render: (_, row) => row.teacher?.user?.name || '—' },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.course_id || !f.subject_id || !f.teacher_id || !f.exam_type || !f.exam_date) {
      toast.error('Course, subject, teacher, type and date are required'); return
    }
    const payload = { course_id: Number(f.course_id), subject_id: Number(f.subject_id), teacher_id: Number(f.teacher_id), exam_type: f.exam_type, exam_date: f.exam_date }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Exam updated' : 'Exam created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Exam deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Exams" description="Manage examinations" onAdd={() => crud.openAdd({ exam_type: '' })} addLabel="Add Exam" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search exams..." /></div>
        <FilterDropdown label="All Types" options={examTypes.map(t => ({ value: t, label: t }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No exams found" action={() => crud.openAdd({ exam_type: '' })} actionLabel="Add Exam" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Exam' : 'Add Exam'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Course" required><Select value={crud.formData.course_id || ''} onChange={e => crud.updateForm('course_id', e.target.value)}><option value="">Select Course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.subject?.name}</option>)}</Select></FormField>
          <FormField label="Subject" required><Select value={crud.formData.subject_id || ''} onChange={e => crud.updateForm('subject_id', e.target.value)}><option value="">Select Subject</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></FormField>
          <FormField label="Teacher" required><Select value={crud.formData.teacher_id || ''} onChange={e => crud.updateForm('teacher_id', e.target.value)}><option value="">Select Teacher</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name}</option>)}</Select></FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Exam Type" required><Select value={crud.formData.exam_type || ''} onChange={e => crud.updateForm('exam_type', e.target.value)}><option value="">Select Type</option>{examTypes.map(t => <option key={t} value={t}>{t}</option>)}</Select></FormField>
            <FormField label="Exam Date" required><Input type="date" value={crud.formData.exam_date || ''} onChange={e => crud.updateForm('exam_date', e.target.value)} /></FormField>
          </div>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Exam Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Date: crud.selected.exam_date,
              Type: crud.selected.exam_type,
              Subject: crud.selected.subject?.name,
              Course: crud.selected.course?.subject?.name,
              Teacher: crud.selected.teacher?.user?.name,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Exam" message="Delete this exam?" />
    </div>
  )
}