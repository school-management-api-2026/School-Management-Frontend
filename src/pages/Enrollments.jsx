import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as enrollmentService from '../api/services/enrollmentService'
import * as studentService from '../api/services/studentService'
import * as courseService from '../api/services/courseService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

const statuses = ['Enrolled', 'Pending', 'Completed', 'Dropped']

export default function Enrollments() {
  const toast = useToast()
  const crud = useApiCrud(enrollmentService)
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    studentService.getAll()
      .then(res => setStudents(res.data?.data ?? res.data ?? []))
      .catch(() => setStudents([]))
    courseService.getAll()
      .then(res => setCourses(res.data?.data ?? res.data ?? []))
      .catch(() => setCourses([]))
  }, [])

  const columns = [
    { key: 'student', label: 'Student', render: (_, row) => row.student?.user?.name || '—' },
    { key: 'course', label: 'Course', render: (_, row) => row.course?.subject?.name || '—' },
    { key: 'enrollment_date', label: 'Enrollment Date' },
    { key: 'status', label: 'Status', render: v => v || '—' },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.student_id || !f.course_id || !f.enrollment_date) {
      toast.error('Student, course and enrollment date are required'); return
    }
    const payload = {
      student_id: Number(f.student_id),
      course_id: Number(f.course_id),
      enrollment_date: f.enrollment_date,
      status: f.status || 'Enrolled',
    }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Enrollment updated' : 'Enrollment created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Enrollment deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Enrollments" description="Manage student enrollments" onAdd={() => crud.openAdd({ status: 'Enrolled', enrollment_date: new Date().toISOString().split('T')[0] })} addLabel="Add Enrollment" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search enrollments..." /></div>
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? <EmptyState title="No enrollments found" action={() => crud.openAdd({})} actionLabel="Add Enrollment" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Enrollment' : 'Add Enrollment'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Student" required><Select value={crud.formData.student_id || ''} onChange={e => crud.updateForm('student_id', e.target.value)}><option value="">Select Student</option>{students.map(s => <option key={s.id} value={s.id}>{s.user?.name || `Student #${s.id}`}</option>)}</Select></FormField>
          <FormField label="Course" required><Select value={crud.formData.course_id || ''} onChange={e => crud.updateForm('course_id', e.target.value)}><option value="">Select Course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.subject?.name || `Course #${c.id}`}</option>)}</Select></FormField>
          <FormField label="Enrollment Date" required><Input type="date" value={crud.formData.enrollment_date || ''} onChange={e => crud.updateForm('enrollment_date', e.target.value)} /></FormField>
          <FormField label="Status"><Select value={crud.formData.status || 'Enrolled'} onChange={e => crud.updateForm('status', e.target.value)}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Enrollment Details" size="md">
        {crud.selected && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={crud.selected.student?.user?.image || '/default-profile.webp'} alt="Student" className="w-12 h-12 rounded-full object-cover border border-surface-200 dark:border-surface-700" />
              <div>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">{crud.selected.student?.user?.name}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{crud.selected.student?.user?.code || '—'}</p>
              </div>
            </div>
            {Object.entries({
              Course: crud.selected.course?.subject?.name,
              'Enrollment Date': crud.selected.enrollment_date,
              Status: crud.selected.status,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Enrollment" message="Delete this enrollment?" />
    </div>
  )
}