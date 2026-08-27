import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { payrolls as mockPayrolls, teachers } from '../data/mockData'
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
  { key: 'teacherName', label: 'Teacher' },
  { key: 'baseSalary', label: 'Base Salary', render: v => `$${v?.toLocaleString()}` },
  { key: 'bonus', label: 'Bonus', render: v => `$${v?.toLocaleString()}` },
  { key: 'deduction', label: 'Deduction', render: v => `$${v?.toLocaleString()}` },
  { key: 'netSalary', label: 'Net Salary', render: v => `$${v?.toLocaleString()}` },
  { key: 'payPeriod', label: 'Pay Period' },
  { key: 'status', label: 'Status', badge: true },
]

export default function Payrolls() {
  const toast = useToast()
  const crud = useCrudState(mockPayrolls)

  const save = () => {
    if (!crud.formData.teacherId || !crud.formData.baseSalary) { toast.error('Teacher and base salary are required'); return }
    const teacher = teachers.find(t => t.id === Number(crud.formData.teacherId))
    const base = Number(crud.formData.baseSalary) || 0
    const bonus = Number(crud.formData.bonus) || 0
    const deduction = Number(crud.formData.deduction) || 0
    crud.handleSave({ ...crud.formData, teacherId: Number(crud.formData.teacherId), teacherName: teacher?.name || '', baseSalary: base, bonus, deduction, netSalary: base + bonus - deduction })
    toast.success(crud.selected ? 'Payroll updated' : 'Payroll created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Payrolls" description="Manage teacher payroll" onAdd={() => crud.openAdd({ status: 'Pending' })} addLabel="Add Payroll" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search payrolls..." /></div>
        <FilterDropdown label="All Statuses" options={[{ value: 'Paid', label: 'Paid' }, { value: 'Pending', label: 'Pending' }]} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.paginated.length === 0 ? <EmptyState title="No payroll records" action={() => crud.openAdd({})} actionLabel="Add Payroll" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Payroll' : 'Add Payroll'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Teacher" required><Select value={crud.formData.teacherId || ''} onChange={e => crud.updateForm('teacherId', e.target.value)}><option value="">Select Teacher</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</Select></FormField>
          <FormField label="Pay Period"><Input value={crud.formData.payPeriod || ''} onChange={e => crud.updateForm('payPeriod', e.target.value)} placeholder="e.g. August 2026" /></FormField>
          <FormField label="Base Salary" required><Input type="number" value={crud.formData.baseSalary || ''} onChange={e => crud.updateForm('baseSalary', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Bonus"><Input type="number" value={crud.formData.bonus || ''} onChange={e => crud.updateForm('bonus', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Deduction"><Input type="number" value={crud.formData.deduction || ''} onChange={e => crud.updateForm('deduction', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Pay Date"><Input type="date" value={crud.formData.payDate || ''} onChange={e => crud.updateForm('payDate', e.target.value)} /></FormField>
          <FormField label="Status"><Select value={crud.formData.status || 'Pending'} onChange={e => crud.updateForm('status', e.target.value)}><option value="Pending">Pending</option><option value="Paid">Paid</option></Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Payroll Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ Teacher: crud.selected.teacherName, 'Base Salary': `$${crud.selected.baseSalary}`, Bonus: `$${crud.selected.bonus}`, Deduction: `$${crud.selected.deduction}`, 'Net Salary': `$${crud.selected.netSalary}`, 'Pay Date': crud.selected.payDate, 'Pay Period': crud.selected.payPeriod, Status: crud.selected.status }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Payroll deleted') }} title="Delete Payroll" message="Delete this payroll record?" />
    </div>
  )
}
