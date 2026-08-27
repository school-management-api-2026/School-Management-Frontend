import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { subjects as mockSubjects } from '../data/mockData'
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
  { key: 'name', label: 'Subject Name' },
  { key: 'code', label: 'Code' },
  { key: 'description', label: 'Description' },
  { key: 'coursesCount', label: 'Courses' },
]

export default function Subjects() {
  const toast = useToast()
  const crud = useCrudState(mockSubjects)

  const save = () => {
    if (!crud.formData.name || !crud.formData.code) { toast.error('Name and code are required'); return }
    crud.handleSave({ ...crud.formData, coursesCount: crud.formData.coursesCount || 0 })
    toast.success(crud.selected ? 'Subject updated' : 'Subject created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Subjects" description="Manage academic subjects" onAdd={() => crud.openAdd({ coursesCount: 0 })} addLabel="Add Subject" />
      <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search subjects..." /></div>

      {crud.paginated.length === 0 ? <EmptyState title="No subjects found" action={() => crud.openAdd({})} actionLabel="Add Subject" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Subject' : 'Add Subject'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Subject Name" required><Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="e.g. Mathematics" /></FormField>
          <FormField label="Code" required><Input value={crud.formData.code || ''} onChange={e => crud.updateForm('code', e.target.value)} placeholder="e.g. MATH" /></FormField>
          <FormField label="Description"><Textarea value={crud.formData.description || ''} onChange={e => crud.updateForm('description', e.target.value)} rows={3} placeholder="Subject description" /></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Subject Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ Name: crud.selected.name, Code: crud.selected.code, Description: crud.selected.description, Courses: crud.selected.coursesCount }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v ?? '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Subject deleted') }} title="Delete Subject" message={`Delete "${crud.selected?.name}"?`} />
    </div>
  )
}
