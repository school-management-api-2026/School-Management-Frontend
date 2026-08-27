import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { bookLoans as mockLoans, bookCopies, users } from '../data/mockData'
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

const loanStatuses = ['Borrowed', 'Returned', 'Overdue']
const columns = [
  { key: 'borrowerName', label: 'Borrower' },
  { key: 'bookTitle', label: 'Book' },
  { key: 'bookCopyBarcode', label: 'Barcode' },
  { key: 'loanDate', label: 'Loan Date' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'returnDate', label: 'Returned', render: v => v || '—' },
  { key: 'status', label: 'Status', badge: true },
]

export default function BookLoans() {
  const toast = useToast()
  const crud = useCrudState(mockLoans)
  const staffUsers = users.filter(u => u.roleName === 'Librarian' || u.roleName === 'Admin')

  const save = () => {
    if (!crud.formData.borrowerId || !crud.formData.bookCopyId) { toast.error('Borrower and book copy are required'); return }
    const borrower = users.find(u => u.id === Number(crud.formData.borrowerId))
    const copy = bookCopies.find(c => c.id === Number(crud.formData.bookCopyId))
    const staff = users.find(u => u.id === Number(crud.formData.staffId))
    crud.handleSave({ ...crud.formData, borrowerId: Number(crud.formData.borrowerId), bookCopyId: Number(crud.formData.bookCopyId), staffId: Number(crud.formData.staffId), borrowerName: borrower?.name || '', bookCopyBarcode: copy?.barcode || '', bookTitle: copy?.bookTitle || '', staffName: staff?.name || '' })
    toast.success(crud.selected ? 'Loan updated' : 'Loan created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Book Loans" description="Manage library loans" onAdd={() => crud.openAdd({ status: 'Borrowed', loanDate: new Date().toISOString().split('T')[0] })} addLabel="Add Loan" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search loans..." /></div>
        <FilterDropdown label="All Statuses" options={loanStatuses.map(s => ({ value: s, label: s }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.paginated.length === 0 ? <EmptyState title="No loans found" action={() => crud.openAdd({})} actionLabel="Add Loan" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Loan' : 'Add Loan'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Borrower" required><Select value={crud.formData.borrowerId || ''} onChange={e => crud.updateForm('borrowerId', e.target.value)}><option value="">Select Borrower</option>{users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</Select></FormField>
          <FormField label="Book Copy" required><Select value={crud.formData.bookCopyId || ''} onChange={e => crud.updateForm('bookCopyId', e.target.value)}><option value="">Select Copy</option>{bookCopies.map(c => <option key={c.id} value={c.id}>{c.barcode} — {c.bookTitle}</option>)}</Select></FormField>
          <FormField label="Loan Date"><Input type="date" value={crud.formData.loanDate || ''} onChange={e => crud.updateForm('loanDate', e.target.value)} /></FormField>
          <FormField label="Due Date"><Input type="date" value={crud.formData.dueDate || ''} onChange={e => crud.updateForm('dueDate', e.target.value)} /></FormField>
          <FormField label="Return Date"><Input type="date" value={crud.formData.returnDate || ''} onChange={e => crud.updateForm('returnDate', e.target.value)} /></FormField>
          <FormField label="Library Staff"><Select value={crud.formData.staffId || ''} onChange={e => crud.updateForm('staffId', e.target.value)}><option value="">Select Staff</option>{staffUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</Select></FormField>
          <FormField label="Status"><Select value={crud.formData.status || 'Borrowed'} onChange={e => crud.updateForm('status', e.target.value)}>{loanStatuses.map(s => <option key={s} value={s}>{s}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Loan Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ Borrower: crud.selected.borrowerName, Book: crud.selected.bookTitle, Barcode: crud.selected.bookCopyBarcode, 'Loan Date': crud.selected.loanDate, 'Due Date': crud.selected.dueDate, 'Return Date': crud.selected.returnDate || '—', Staff: crud.selected.staffName, Status: crud.selected.status }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Loan deleted') }} title="Delete Loan" message="Delete this loan record?" />
    </div>
  )
}
