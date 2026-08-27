import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { courses as mockCourses, subjects, teachers } from '../data/mockData'
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

const columns = [
  { key: 'name', label: 'Course' },
  { key: 'subjectName', label: 'Subject' },
  { key: 'teacherName', label: 'Teacher' },
  { key: 'unitPrice', label: 'Price', render: v => `$${v}` },
  { key: 'promotion', label: 'Discount', render: v => v ? `${v}%` : '—' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'status', label: 'Status', badge: true },
]

export default function Courses() {
  const toast = useToast()
  const crud = useCrudState(mockCourses)

  const save = () => {
    if (!crud.formData.name || !crud.formData.subjectId || !crud.formData.teacherId) { toast.error('Name, subject, and teacher are required'); return }
    const subj = subjects.find(s => s.id === Number(crud.formData.subjectId))
    const teacher = teachers.find(t => t.id === Number(crud.formData.teacherId))
    crud.handleSave({ ...crud.formData, subjectId: Number(crud.formData.subjectId), teacherId: Number(crud.formData.teacherId), subjectName: subj?.name || '', teacherName: teacher?.name || '', unitPrice: Number(crud.formData.unitPrice) || 0, promotion: Number(crud.formData.promotion) || 0, capacity: Number(crud.formData.capacity) || 0 })
    toast.success(crud.selected ? 'Course updated' : 'Course created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Courses" description="Manage academic courses" onAdd={() => crud.openAdd({ status: 'Active' })} addLabel="Add Course" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search courses..." /></div>
        <FilterDropdown label="All Statuses" options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }, { value: 'Pending', label: 'Pending' }]} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.paginated.length === 0 ? <EmptyState title="No courses found" action={() => crud.openAdd({})} actionLabel="Add Course" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Course' : 'Add Course'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Course Name" required><Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="Course name" /></FormField>
          <FormField label="Subject" required><Select value={crud.formData.subjectId || ''} onChange={e => crud.updateForm('subjectId', e.target.value)}><option value="">Select Subject</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></FormField>
          <FormField label="Teacher" required><Select value={crud.formData.teacherId || ''} onChange={e => crud.updateForm('teacherId', e.target.value)}><option value="">Select Teacher</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</Select></FormField>
          <FormField label="Unit Price"><Input type="number" value={crud.formData.unitPrice || ''} onChange={e => crud.updateForm('unitPrice', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Promotion (%)"><Input type="number" value={crud.formData.promotion || ''} onChange={e => crud.updateForm('promotion', e.target.value)} placeholder="0" /></FormField>
          <FormField label="Capacity"><Input type="number" value={crud.formData.capacity || ''} onChange={e => crud.updateForm('capacity', e.target.value)} placeholder="30" /></FormField>
          <FormField label="Start Date"><Input type="date" value={crud.formData.startDate || ''} onChange={e => crud.updateForm('startDate', e.target.value)} /></FormField>
          <FormField label="End Date"><Input type="date" value={crud.formData.endDate || ''} onChange={e => crud.updateForm('endDate', e.target.value)} /></FormField>
          <FormField label="Status"><Select value={crud.formData.status || 'Active'} onChange={e => crud.updateForm('status', e.target.value)}><option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Pending">Pending</option></Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Course Details" size="md">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ Name: crud.selected.name, Subject: crud.selected.subjectName, Teacher: crud.selected.teacherName, 'Unit Price': `$${crud.selected.unitPrice}`, Promotion: crud.selected.promotion ? `${crud.selected.promotion}%` : 'None', Capacity: crud.selected.capacity, 'Start Date': crud.selected.startDate, 'End Date': crud.selected.endDate, Status: crud.selected.status }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Course deleted') }} title="Delete Course" message={`Delete "${crud.selected?.name}"?`} />
    </div>
  )
}
