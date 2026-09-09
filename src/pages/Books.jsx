import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as bookService from '../api/services/bookService'
import * as authorService from '../api/services/authorService'
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
const authorNames = row => (row.book_authors ?? []).map(a => a.author?.name).filter(Boolean).join(', ')

export default function Books() {
  const toast = useToast()
  const crud = useApiCrud(bookService)
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    authorService.getAll().then(res => setAuthors(res.data?.data ?? res.data ?? [])).catch(() => setAuthors([]))
  }, [])

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'isbn', label: 'ISBN' },
    { key: 'category', label: 'Category' },
    { key: 'authors', label: 'Authors', render: (_, row) => authorNames(row) || '—' },
    { key: 'copies', label: 'Copies', render: (_, row) => row.book_copies?.length || 0 },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.title || !f.isbn) { toast.error('Title and ISBN are required'); return }
    const payload = { title: f.title, isbn: f.isbn, category: f.category || null, author_id: f.author_id ? Number(f.author_id) : null }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Book updated' : 'Book created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Book deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Books" description="Manage library books" onAdd={() => crud.openAdd({})} addLabel="Add Book" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search books..." /></div>
        <FilterDropdown label="All Categories" options={categories.map(c => ({ value: c, label: c }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No books found" action={() => crud.openAdd({})} actionLabel="Add Book" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Book' : 'Add Book'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Title" required><Input value={crud.formData.title || ''} onChange={e => crud.updateForm('title', e.target.value)} placeholder="Book title" /></FormField>
          <FormField label="ISBN" required><Input value={crud.formData.isbn || ''} onChange={e => crud.updateForm('isbn', e.target.value)} placeholder="978-..." /></FormField>
          <FormField label="Category"><Select value={crud.formData.category || ''} onChange={e => crud.updateForm('category', e.target.value)}><option value="">Select Category</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</Select></FormField>
          <FormField label="Author"><Select value={crud.formData.author_id || ''} onChange={e => crud.updateForm('author_id', e.target.value)}><option value="">Select Author</option>{authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Book Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Title: crud.selected.title,
              ISBN: crud.selected.isbn,
              Category: crud.selected.category,
              Authors: authorNames(crud.selected),
              Copies: crud.selected.book_copies?.length || 0,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Book" message={`Delete "${crud.selected?.title}"?`} />
    </div>
  )
}