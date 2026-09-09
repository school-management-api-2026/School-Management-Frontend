import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as fineService from '../api/services/fineService'
import * as bookLoanService from '../api/services/bookLoanService'
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

const statuses = ['unpaid', 'paid']
const loanLabel = l => `${l.borrower?.name} — ${l.book_copy?.book?.title} (${l.book_copy?.barcode})`

export default function Fines() {
  const toast = useToast()
  const crud = useApiCrud(fineService)
  const [loans, setLoans] = useState([])

  useEffect(() => {
    bookLoanService.getAll().then(res => setLoans(res.data?.data ?? res.data ?? [])).catch(() => setLoans([]))
  }, [])

  const columns = [
    { key: 'borrower', label: 'Borrower', render: (_, row) => row.book_loan?.borrower?.name || '—' },
    { key: 'book', label: 'Book', render: (_, row) => row.book_loan?.book_copy?.book?.title || '—' },
    { key: 'amount', label: 'Amount', render: v => `$${Number(v).toFixed(2)}` },
    { key: 'paid_status', label: 'Paid', badge: true },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.book_loan_id) { toast.error('Book loan is required'); return }
    const payload = { book_loan_id: Number(f.book_loan_id), amount: Number(f.amount) || 0, paid_status: f.paid_status || 'unpaid' }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Fine updated' : 'Fine created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Fine deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Fines" description="Manage library fines" onAdd={() => crud.openAdd({ paid_status: 'unpaid' })} addLabel="Add Fine" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search fines..." /></div>
        <FilterDropdown label="All Statuses" options={statuses.map(s => ({ value: s, label: s }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No fines found" action={() => crud.openAdd({ paid_status: 'unpaid' })} actionLabel="Add Fine" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Fine' : 'Add Fine'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Book Loan" required><Select value={crud.formData.book_loan_id || ''} onChange={e => crud.updateForm('book_loan_id', e.target.value)}><option value="">Select Loan</option>{loans.map(l => <option key={l.id} value={l.id}>{loanLabel(l)}</option>)}</Select></FormField>
          <FormField label="Amount" required><Input type="number" step="0.01" min="0" value={crud.formData.amount ?? ''} onChange={e => crud.updateForm('amount', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Paid Status" required><Select value={crud.formData.paid_status || 'unpaid'} onChange={e => crud.updateForm('paid_status', e.target.value)}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Fine Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Borrower: crud.selected.book_loan?.borrower?.name,
              Book: crud.selected.book_loan?.book_copy?.book?.title,
              Barcode: crud.selected.book_loan?.book_copy?.barcode,
              Amount: `$${Number(crud.selected.amount).toFixed(2)}`,
              'Paid Status': crud.selected.paid_status,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Fine" message={`Delete this fine ($ ${Number(crud.selected?.amount || 0).toFixed(2)})?`} />
    </div>
  )
}