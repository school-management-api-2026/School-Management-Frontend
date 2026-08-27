import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { books as mockBooks, authors } from '../data/mockData'
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

const categories = ['Computer Science', 'Literature', 'Science', 'Mathematics', 'History', 'Art']
const columns = [
  { key: 'title', label: 'Title' },
  { key: 'isbn', label: 'ISBN' },
  { key: 'category', label: 'Category' },
  { key: 'authorNames', label: 'Authors', render: v => v?.join(', ') || '—' },
  { key: 'copiesCount', label: 'Copies' },
]

export default function Books() {
  const toast = useToast()
  const crud = useCrudState(mockBooks)

  const save = () => {
    if (!crud.formData.title || !crud.formData.isbn) { toast.error('Title and ISBN are required'); return }
    const authorId = Number(crud.formData.authorId)
    const author = authors.find(a => a.id === authorId)
    crud.handleSave({ ...crud.formData, authorIds: authorId ? [authorId] : [], authorNames: author ? [author.name] : [], copiesCount: Number(crud.formData.copiesCount) || 0 })
    toast.success(crud.selected ? 'Book updated' : 'Book created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Books" description="Manage library books" onAdd={() => crud.openAdd({ copiesCount: 0 })} addLabel="Add Book" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search books..." /></div>
        <FilterDropdown label="All Categories" options={categories.map(c => ({ value: c, label: c }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.paginated.length === 0 ? <EmptyState title="No books found" action={() => crud.openAdd({})} actionLabel="Add Book" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Book' : 'Add Book'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Title" required><Input value={crud.formData.title || ''} onChange={e => crud.updateForm('title', e.target.value)} placeholder="Book title" /></FormField>
          <FormField label="ISBN" required><Input value={crud.formData.isbn || ''} onChange={e => crud.updateForm('isbn', e.target.value)} placeholder="978-..." /></FormField>
          <FormField label="Category"><Select value={crud.formData.category || ''} onChange={e => crud.updateForm('category', e.target.value)}><option value="">Select Category</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</Select></FormField>
          <FormField label="Author"><Select value={crud.formData.authorId || ''} onChange={e => crud.updateForm('authorId', e.target.value)}><option value="">Select Author</option>{authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></FormField>
          <FormField label="Copies Count"><Input type="number" value={crud.formData.copiesCount || ''} onChange={e => crud.updateForm('copiesCount', e.target.value)} placeholder="0" /></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Book Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ Title: crud.selected.title, ISBN: crud.selected.isbn, Category: crud.selected.category, Authors: crud.selected.authorNames?.join(', '), Copies: crud.selected.copiesCount }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Book deleted') }} title="Delete Book" message={`Delete "${crud.selected?.title}"?`} />
    </div>
  )
}
