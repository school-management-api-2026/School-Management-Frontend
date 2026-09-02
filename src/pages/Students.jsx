import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as studentService from '../api/services/studentService'
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
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'gender', label: 'Gender' },
  { key: 'enrollment_date', label: 'Enrolled' },
  { key: 'status', label: 'Status', badge: true },
]

export default function Students() {
  const toast = useToast()
  const crud = useApiCrud(studentService)

  const save = async () => {
    if (!crud.formData.name || !crud.formData.email) { toast.error('Name and email are required'); return }
    try {
      await crud.handleSave(crud.formData)
      toast.success(crud.selected ? 'Student updated' : 'Student created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Student deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Students" description="Manage student records" onAdd={() => crud.openAdd({ status: 'Active', enrollment_date: new Date().toISOString().split('T')[0] })} addLabel="Add Student" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search students..." /></div>
        <FilterDropdown label="All Statuses" options={[{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }]} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? <EmptyState title="No students found" action={() => crud.openAdd({})} actionLabel="Add Student" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Student' : 'Add Student'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Full Name" required><Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="Student name" /></FormField>
          <FormField label="Email" required><Input type="email" value={crud.formData.email || ''} onChange={e => crud.updateForm('email', e.target.value)} placeholder="Email address" /></FormField>
          <FormField label="Phone"><Input value={crud.formData.phone || ''} onChange={e => crud.updateForm('phone', e.target.value)} placeholder="Phone number" /></FormField>
          <FormField label="Gender"><Select value={crud.formData.gender || ''} onChange={e => crud.updateForm('gender', e.target.value)}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option></Select></FormField>
          <FormField label="Date of Birth"><Input type="date" value={crud.formData.dob || ''} onChange={e => crud.updateForm('dob', e.target.value)} /></FormField>
          <FormField label="Enrollment Date"><Input type="date" value={crud.formData.enrollment_date || ''} onChange={e => crud.updateForm('enrollment_date', e.target.value)} /></FormField>
          <FormField label="Status"><Select value={crud.formData.status || 'Active'} onChange={e => crud.updateForm('status', e.target.value)}><option value="Active">Active</option><option value="Inactive">Inactive</option></Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Student Details" size="md">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ Name: crud.selected.name, Email: crud.selected.email, Phone: crud.selected.phone, Gender: crud.selected.gender, DOB: crud.selected.dob, 'Enrollment Date': crud.selected.enrollment_date, Status: crud.selected.status }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Student" message={`Delete "${crud.selected?.name}"?`} />
    </div>
  )
}
