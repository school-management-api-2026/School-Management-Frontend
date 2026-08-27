import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { bookCopies as mockCopies, books } from '../data/mockData'
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

const statuses = ['Available', 'Borrowed', 'Damaged', 'Lost']
const columns = [
  { key: 'barcode', label: 'Barcode' },
  { key: 'bookTitle', label: 'Book' },
  { key: 'status', label: 'Status', badge: true },
]

export default function BookCopies() {
  const toast = useToast()
  const crud = useCrudState(mockCopies)

  const save = () => {
    if (!crud.formData.bookId || !crud.formData.barcode) { toast.error('Book and barcode are required'); return }
    const book = books.find(b => b.id === Number(crud.formData.bookId))
    crud.handleSave({ ...crud.formData, bookId: Number(crud.formData.bookId), bookTitle: book?.title || '' })
    toast.success(crud.selected ? 'Book copy updated' : 'Book copy created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Book Copies" description="Manage book copy inventory" onAdd={() => crud.openAdd({ status: 'Available' })} addLabel="Add Copy" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search copies..." /></div>
        <FilterDropdown label="All Statuses" options={statuses.map(s => ({ value: s, label: s }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.paginated.length === 0 ? <EmptyState title="No copies found" action={() => crud.openAdd({})} actionLabel="Add Copy" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Book Copy' : 'Add Book Copy'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Book" required><Select value={crud.formData.bookId || ''} onChange={e => crud.updateForm('bookId', e.target.value)}><option value="">Select Book</option>{books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}</Select></FormField>
          <FormField label="Barcode" required><Input value={crud.formData.barcode || ''} onChange={e => crud.updateForm('barcode', e.target.value)} placeholder="BC-0001" /></FormField>
          <FormField label="Status"><Select value={crud.formData.status || 'Available'} onChange={e => crud.updateForm('status', e.target.value)}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Book Copy Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ Barcode: crud.selected.barcode, Book: crud.selected.bookTitle, Status: crud.selected.status }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Book copy deleted') }} title="Delete Book Copy" message={`Delete copy "${crud.selected?.barcode}"?`} />
    </div>
  )
}
