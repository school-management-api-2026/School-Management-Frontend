import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as attendanceService from '../api/services/attendanceService'
import * as studentService from '../api/services/studentService'
import * as teacherCourseService from '../api/services/teacherCourseService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

const statuses = [
  { value: 'persent', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late' },
  { value: 'permission', label: 'Permission (Excused)' }
]

export default function Attendance() {
  const toast = useToast()
  const crud = useApiCrud(attendanceService)
  const [students, setStudents] = useState([])
  const [teacherCourses, setTeacherCourses] = useState([])

  useEffect(() => {
    studentService.getAll().then(res => {
      setStudents(res.data?.data || [])
    }).catch(err => console.error("Failed to load students", err))
    teacherCourseService.getAll().then(res => {
      setTeacherCourses(res.data?.data || [])
    }).catch(err => console.error("Failed to load classes", err))
  }, [])

  const classLabel = tc => tc ? `${tc.teacher?.user?.name} — ${tc.course?.subject?.name}` : '—'

  const studentName = (userId) => {
    const st = students.find(s => s.user_id === userId)
    return st?.user?.name || st?.name || '—'
  }

  const columns = [
    { key: 'user_id', label: 'Student', render: v => studentName(v) },
    { key: 'class', label: 'Class', render: (_, row) => classLabel(row.teacher_course) },
    { key: 'date', label: 'Date' },
    { key: 'time_in', label: 'Time In', render: v => v || '—' },
    { key: 'time_out', label: 'Time Out', render: v => v || '—' },
    {
      key: 'status',
      label: 'Status',
      render: v => {
        const match = statuses.find(s => s.value === v)
        const label = match ? match.label : v
        let colorClass = 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-300'
        if (v === 'persent') colorClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
        if (v === 'absent') colorClass = 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'
        if (v === 'late') colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300'
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>{label}</span>
      }
    },
  ]

  const save = async () => {
    if (!crud.formData.user_id || !crud.formData.date || !crud.formData.status || !crud.formData.time_in || !crud.formData.time_out) { 
      toast.error('All fields (Student, Date, Time In, Time Out, Status) are required'); 
      return 
    }
    
    try {
      await crud.handleSave({ ...crud.formData, teacher_course_id: crud.formData.teacher_course_id ? Number(crud.formData.teacher_course_id) : null })
      toast.success(crud.selected ? 'Attendance updated' : 'Attendance recorded')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Attendance deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Student Attendance" 
        description="Track daily attendance for students" 
        onAdd={() => crud.openAdd({ date: new Date().toISOString().split('T')[0], status: '', time_in: '08:00', time_out: '16:00' })} 
        addLabel="Record Attendance" 
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search attendance..." />
        </div>
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No attendance records" action={() => crud.openAdd({ date: new Date().toISOString().split('T')[0], status: '', time_in: '08:00', time_out: '16:00' })} actionLabel="Record Attendance" /> 
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal 
        open={crud.modalOpen} 
        onClose={crud.closeModals} 
        title={crud.selected ? 'Edit Attendance' : 'Record Attendance'} 
        footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Record'}</Button></>}
      >
        <div className="space-y-4">
          <FormField label="Class">
            <Select value={crud.formData.teacher_course_id || ''} onChange={e => crud.updateForm('teacher_course_id', e.target.value)}>
              <option value="">No Class</option>
              {teacherCourses.map(tc => <option key={tc.id} value={tc.id}>{classLabel(tc)}</option>)}
            </Select>
          </FormField>
          <FormField label="Student" required>
            <Select value={crud.formData.user_id || ''} onChange={e => crud.updateForm('user_id', e.target.value)}>
              <option value="">Select Student</option>
              {students.map(u => <option key={u.id} value={u.user_id}>{u.user?.name || u.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Date" required>
            <Input type="date" value={crud.formData.date || ''} onChange={e => crud.updateForm('date', e.target.value)} />
          </FormField>
          <FormField label="Time In" required>
            <Input type="time" value={crud.formData.time_in || ''} onChange={e => crud.updateForm('time_in', e.target.value)} />
          </FormField>
          <FormField label="Time Out" required>
            <Input type="time" value={crud.formData.time_out || ''} onChange={e => crud.updateForm('time_out', e.target.value)} />
          </FormField>
          <FormField label="Status" required>
            <Select value={crud.formData.status || ''} onChange={e => crud.updateForm('status', e.target.value)}>
              <option value="">Select Status</option>
              {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>
          </FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Attendance Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ 
              Student: studentName(crud.selected.user_id), 
              Class: classLabel(crud.selected.teacher_course), 
              Date: crud.selected.date, 
              'Time In': crud.selected.time_in || '—', 
              'Time Out': crud.selected.time_out || '—', 
              Status: (statuses.find(s => s.value === crud.selected.status) || {}).label || crud.selected.status 
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog 
        open={crud.deleteModal} 
        onClose={crud.closeModals} 
        onConfirm={del} 
        title="Delete Attendance" 
        message="Delete this attendance record?" 
      />
    </div>
  )
}