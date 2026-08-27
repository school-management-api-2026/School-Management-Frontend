import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { authors as mockAuthors } from '../data/mockData'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Textarea } from '../components/common/FormField'

const columns = [
  { key: 'name', label: 'Author Name' },
  { key: 'bio', label: 'Bio' },
]

export default function Authors() {
  const toast = useToast()
  const crud = useCrudState(mockAuthors)

  const save = () => {
    if (!crud.formData.name) { toast.error('Author name is required'); return }
    crud.handleSave(crud.formData)
    toast.success(crud.selected ? 'Author updated' : 'Author created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Authors" description="Manage book authors" onAdd={() => crud.openAdd({})} addLabel="Add Author" />
      <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search authors..." /></div>

      {crud.paginated.length === 0 ? <EmptyState title="No authors found" action={() => crud.openAdd({})} actionLabel="Add Author" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Author' : 'Add Author'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Author Name" required><Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="Author name" /></FormField>
          <FormField label="Bio"><Textarea value={crud.formData.bio || ''} onChange={e => crud.updateForm('bio', e.target.value)} rows={3} placeholder="Short biography" /></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Author Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ Name: crud.selected.name, Bio: crud.selected.bio }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Author deleted') }} title="Delete Author" message={`Delete "${crud.selected?.name}"?`} />
    </div>
  )
}
