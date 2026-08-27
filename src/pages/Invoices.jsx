import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { invoices as mockInvoices, students, courses } from '../data/mockData'
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
  { key: 'studentName', label: 'Student' },
  { key: 'courseName', label: 'Course' },
  { key: 'totalAmount', label: 'Amount', render: v => `$${v}` },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status', badge: true },
]

export default function Invoices() {
  const toast = useToast()
  const crud = useCrudState(mockInvoices)

  const save = () => {
    if (!crud.formData.studentId || !crud.formData.courseId || !crud.formData.totalAmount) { toast.error('Student, course, and amount are required'); return }
    const student = students.find(s => s.id === Number(crud.formData.studentId))
    const course = courses.find(c => c.id === Number(crud.formData.courseId))
    crud.handleSave({ ...crud.formData, studentId: Number(crud.formData.studentId), courseId: Number(crud.formData.courseId), studentName: student?.name || '', courseName: course?.name || '', totalAmount: Number(crud.formData.totalAmount) })
    toast.success(crud.selected ? 'Invoice updated' : 'Invoice created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Invoices" description="Manage student invoices" onAdd={() => crud.openAdd({ status: 'Unpaid' })} addLabel="Add Invoice" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search invoices..." /></div>
        <FilterDropdown label="All Statuses" options={[{ value: 'Paid', label: 'Paid' }, { value: 'Unpaid', label: 'Unpaid' }, { value: 'Partial', label: 'Partial' }]} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.paginated.length === 0 ? <EmptyState title="No invoices found" action={() => crud.openAdd({})} actionLabel="Add Invoice" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Invoice' : 'Add Invoice'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Student" required><Select value={crud.formData.studentId || ''} onChange={e => crud.updateForm('studentId', e.target.value)}><option value="">Select Student</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></FormField>
          <FormField label="Course" required><Select value={crud.formData.courseId || ''} onChange={e => crud.updateForm('courseId', e.target.value)}><option value="">Select Course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></FormField>
          <FormField label="Total Amount" required><Input type="number" value={crud.formData.totalAmount || ''} onChange={e => crud.updateForm('totalAmount', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Due Date"><Input type="date" value={crud.formData.dueDate || ''} onChange={e => crud.updateForm('dueDate', e.target.value)} /></FormField>
          <FormField label="Status"><Select value={crud.formData.status || 'Unpaid'} onChange={e => crud.updateForm('status', e.target.value)}><option value="Unpaid">Unpaid</option><option value="Paid">Paid</option><option value="Partial">Partial</option></Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Invoice Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ Student: crud.selected.studentName, Course: crud.selected.courseName, Amount: `$${crud.selected.totalAmount}`, 'Due Date': crud.selected.dueDate, Status: crud.selected.status }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Invoice deleted') }} title="Delete Invoice" message="Delete this invoice?" />
    </div>
  )
}
