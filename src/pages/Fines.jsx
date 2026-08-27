import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { fines as mockFines, bookLoans } from '../data/mockData'
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
  { key: 'borrowerName', label: 'Borrower' },
  { key: 'bookTitle', label: 'Book' },
  { key: 'amount', label: 'Amount', render: v => `$${Number(v).toFixed(2)}` },
  { key: 'reason', label: 'Reason' },
  { key: 'paidStatus', label: 'Paid', badge: true },
]

export default function Fines() {
  const toast = useToast()
  const crud = useCrudState(mockFines)

  const save = () => {
    if (!crud.formData.bookLoanId) { toast.error('Book loan is required'); return }
    const loan = bookLoans.find(l => l.id === Number(crud.formData.bookLoanId))
    crud.handleSave({ ...crud.formData, bookLoanId: Number(crud.formData.bookLoanId), borrowerName: loan?.borrowerName || '', bookTitle: loan?.bookTitle || '', amount: Number(crud.formData.amount) || 0 })
    toast.success(crud.selected ? 'Fine updated' : 'Fine created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Fines" description="Manage library fines" onAdd={() => crud.openAdd({ paidStatus: 'Unpaid' })} addLabel="Add Fine" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search fines..." /></div>
        <FilterDropdown label="All Statuses" options={[{ value: 'Paid', label: 'Paid' }, { value: 'Unpaid', label: 'Unpaid' }]} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.paginated.length === 0 ? <EmptyState title="No fines found" action={() => crud.openAdd({})} actionLabel="Add Fine" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Fine' : 'Add Fine'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Book Loan" required><Select value={crud.formData.bookLoanId || ''} onChange={e => crud.updateForm('bookLoanId', e.target.value)}><option value="">Select Loan</option>{bookLoans.map(l => <option key={l.id} value={l.id}>{l.borrowerName} — {l.bookTitle}</option>)}</Select></FormField>
          <FormField label="Amount"><Input type="number" step="0.01" value={crud.formData.amount || ''} onChange={e => crud.updateForm('amount', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Reason"><Input value={crud.formData.reason || ''} onChange={e => crud.updateForm('reason', e.target.value)} placeholder="e.g. Overdue return" /></FormField>
          <FormField label="Paid Status"><Select value={crud.formData.paidStatus || 'Unpaid'} onChange={e => crud.updateForm('paidStatus', e.target.value)}><option value="Unpaid">Unpaid</option><option value="Paid">Paid</option><option value="N/A">N/A</option></Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Fine Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ Borrower: crud.selected.borrowerName, Book: crud.selected.bookTitle, Amount: `$${Number(crud.selected.amount).toFixed(2)}`, Reason: crud.selected.reason, 'Paid Status': crud.selected.paidStatus }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Fine deleted') }} title="Delete Fine" message="Delete this fine?" />
    </div>
  )
}
