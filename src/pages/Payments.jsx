import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { payments as mockPayments, invoices } from '../data/mockData'
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

const methods = ['Cash', 'Credit Card', 'Bank Transfer', 'Check']
const columns = [
  { key: 'invoiceRef', label: 'Invoice' },
  { key: 'amount', label: 'Amount', render: v => `$${v}` },
  { key: 'paymentDate', label: 'Date' },
  { key: 'paymentMethod', label: 'Method' },
  { key: 'status', label: 'Status', badge: true },
]

export default function Payments() {
  const toast = useToast()
  const crud = useCrudState(mockPayments)

  const save = () => {
    if (!crud.formData.invoiceId || !crud.formData.amount) { toast.error('Invoice and amount are required'); return }
    const inv = invoices.find(i => i.id === Number(crud.formData.invoiceId))
    crud.handleSave({ ...crud.formData, invoiceId: Number(crud.formData.invoiceId), invoiceRef: inv ? `INV-${String(inv.id).padStart(3, '0')}` : '', amount: Number(crud.formData.amount) })
    toast.success(crud.selected ? 'Payment updated' : 'Payment created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Payments" description="Manage payment records" onAdd={() => crud.openAdd({ status: 'Completed', paymentDate: new Date().toISOString().split('T')[0] })} addLabel="Add Payment" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search payments..." /></div>
        <FilterDropdown label="All Methods" options={methods.map(m => ({ value: m, label: m }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.paginated.length === 0 ? <EmptyState title="No payments found" action={() => crud.openAdd({})} actionLabel="Add Payment" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Payment' : 'Add Payment'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Invoice" required><Select value={crud.formData.invoiceId || ''} onChange={e => crud.updateForm('invoiceId', e.target.value)}><option value="">Select Invoice</option>{invoices.map(i => <option key={i.id} value={i.id}>INV-{String(i.id).padStart(3, '0')} — {i.studentName} (${i.totalAmount})</option>)}</Select></FormField>
          <FormField label="Amount" required><Input type="number" value={crud.formData.amount || ''} onChange={e => crud.updateForm('amount', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Payment Date"><Input type="date" value={crud.formData.paymentDate || ''} onChange={e => crud.updateForm('paymentDate', e.target.value)} /></FormField>
          <FormField label="Payment Method"><Select value={crud.formData.paymentMethod || ''} onChange={e => crud.updateForm('paymentMethod', e.target.value)}><option value="">Select Method</option>{methods.map(m => <option key={m} value={m}>{m}</option>)}</Select></FormField>
          <FormField label="Status"><Select value={crud.formData.status || 'Completed'} onChange={e => crud.updateForm('status', e.target.value)}><option value="Completed">Completed</option><option value="Pending">Pending</option><option value="Cancelled">Cancelled</option></Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Payment Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ Invoice: crud.selected.invoiceRef, Amount: `$${crud.selected.amount}`, Date: crud.selected.paymentDate, Method: crud.selected.paymentMethod, Status: crud.selected.status }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Payment deleted') }} title="Delete Payment" message="Delete this payment?" />
    </div>
  )
}
