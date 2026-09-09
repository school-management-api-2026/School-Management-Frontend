import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as bookLoanService from '../api/services/bookLoanService'
import * as bookCopyService from '../api/services/bookCopyService'
import * as userService from '../api/services/userService'
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

const loanStatuses = ['borrowed', 'returned', 'overdue']
const isStaff = u => (u.role_name || u.role?.name) === 'Library_staff' || (u.role_name || u.role?.name) === 'Admin'

export default function BookLoans() {
  const toast = useToast()
  const crud = useApiCrud(bookLoanService)
  const [copies, setCopies] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    bookCopyService.getAll().then(res => setCopies(res.data?.data ?? res.data ?? [])).catch(() => setCopies([]))
    userService.getAll().then(res => setUsers(res.data?.data ?? res.data ?? [])).catch(() => setUsers([]))
  }, [])

  const staffUsers = users.filter(isStaff)
  const columns = [
    { key: 'borrower', label: 'Borrower', render: (_, row) => row.borrower?.name || '—' },
    { key: 'book', label: 'Book', render: (_, row) => row.book_copy?.book?.title || '—' },
    { key: 'barcode', label: 'Barcode', render: (_, row) => row.book_copy?.barcode || '—' },
    { key: 'loan_date', label: 'Loan Date' },
    { key: 'due_date', label: 'Due Date' },
    { key: 'return_date', label: 'Returned', render: v => v || '—' },
    { key: 'status', label: 'Status', badge: true },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.user_id || !f.book_copy_id || !f.library_staff_id) { toast.error('Borrower, book copy and staff are required'); return }
    const payload = {
      user_id: Number(f.user_id),
      book_copy_id: Number(f.book_copy_id),
      library_staff_id: Number(f.library_staff_id),
      loan_date: f.loan_date,
      due_date: f.due_date,
      return_date: f.return_date || null,
      status: f.status || 'borrowed',
    }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Loan updated' : 'Loan created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Loan deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Book Loans" description="Manage library loans" onAdd={() => crud.openAdd({ status: 'borrowed', loan_date: new Date().toISOString().split('T')[0] })} addLabel="Add Loan" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search loans..." /></div>
        <FilterDropdown label="All Statuses" options={loanStatuses.map(s => ({ value: s, label: s }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No loans found" action={() => crud.openAdd({})} actionLabel="Add Loan" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Loan' : 'Add Loan'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Borrower" required><Select value={crud.formData.user_id || ''} onChange={e => crud.updateForm('user_id', e.target.value)}><option value="">Select Borrower</option>{users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</Select></FormField>
          <FormField label="Book Copy" required><Select value={crud.formData.book_copy_id || ''} onChange={e => crud.updateForm('book_copy_id', e.target.value)}><option value="">Select Copy</option>{copies.map(c => <option key={c.id} value={c.id}>{c.barcode} — {c.book?.title}</option>)}</Select></FormField>
          <FormField label="Loan Date" required><Input type="date" value={crud.formData.loan_date || ''} onChange={e => crud.updateForm('loan_date', e.target.value)} /></FormField>
          <FormField label="Due Date" required><Input type="date" value={crud.formData.due_date || ''} onChange={e => crud.updateForm('due_date', e.target.value)} /></FormField>
          <FormField label="Return Date"><Input type="date" value={crud.formData.return_date || ''} onChange={e => crud.updateForm('return_date', e.target.value)} /></FormField>
          <FormField label="Library Staff" required><Select value={crud.formData.library_staff_id || ''} onChange={e => crud.updateForm('library_staff_id', e.target.value)}><option value="">Select Staff</option>{staffUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</Select></FormField>
          <FormField label="Status"><Select value={crud.formData.status || 'borrowed'} onChange={e => crud.updateForm('status', e.target.value)}>{loanStatuses.map(s => <option key={s} value={s}>{s}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Loan Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Borrower: crud.selected.borrower?.name,
              Book: crud.selected.book_copy?.book?.title,
              Barcode: crud.selected.book_copy?.barcode,
              'Loan Date': crud.selected.loan_date,
              'Due Date': crud.selected.due_date,
              'Return Date': crud.selected.return_date || '—',
              Staff: crud.selected.staff?.name,
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

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Loan" message="Delete this loan record?" />
    </div>
  )
}