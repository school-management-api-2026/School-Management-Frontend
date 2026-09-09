import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as authorService from '../api/services/authorService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

const columns = [
  { key: 'name', label: 'Author Name' },
  { key: 'nation', label: 'Nation' },
  { key: 'gender', label: 'Gender' },
  { key: 'date_of_birth', label: 'Date of Birth' },
  { key: 'books', label: 'Books', render: (_, row) => row.book_authors?.length || 0 },
]

export default function Authors() {
  const toast = useToast()
  const crud = useApiCrud(authorService)

  const save = async () => {
    const f = crud.formData
    if (!f.name || !f.gender || !f.nation) { toast.error('Name, gender and nation are required'); return }
    const payload = {
      name: f.name,
      gender: f.gender,
      nation: f.nation,
      date_of_birth: f.date_of_birth || null,
    }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Author updated' : 'Author created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Author deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Authors" description="Manage book authors" onAdd={() => crud.openAdd({})} addLabel="Add Author" />
      <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search authors..." /></div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No authors found" action={() => crud.openAdd({})} actionLabel="Add Author" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Author' : 'Add Author'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Author Name" required><Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="Author name" /></FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Gender" required><Select value={crud.formData.gender || ''} onChange={e => crud.updateForm('gender', e.target.value)}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></Select></FormField>
            <FormField label="Nation" required><Input value={crud.formData.nation || ''} onChange={e => crud.updateForm('nation', e.target.value)} placeholder="Nationality" /></FormField>
          </div>
          <FormField label="Date of Birth"><Input type="date" value={crud.formData.date_of_birth || ''} onChange={e => crud.updateForm('date_of_birth', e.target.value)} /></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Author Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Name: crud.selected.name,
              Gender: crud.selected.gender,
              Nation: crud.selected.nation,
              'Date of Birth': crud.selected.date_of_birth,
              Books: crud.selected.book_authors?.map(b => b.book?.title).join(', ') || '—',
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Author" message={`Delete "${crud.selected?.name}"?`} />
    </div>
  )
}