import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { roles as mockRoles } from '../data/mockData'
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
  { key: 'name', label: 'Role Name' },
  { key: 'description', label: 'Description' },
  { key: 'usersCount', label: 'Users' },
]

export default function Roles() {
  const toast = useToast()
  const crud = useCrudState(mockRoles)

  const save = () => {
    if (!crud.formData.name) { toast.error('Role name is required'); return }
    crud.handleSave(crud.formData)
    toast.success(crud.selected ? 'Role updated' : 'Role created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Roles" description="Manage user roles and permissions" onAdd={() => crud.openAdd({ usersCount: 0 })} addLabel="Add Role" />
      <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search roles..." /></div>

      {crud.paginated.length === 0 ? <EmptyState title="No roles found" action={() => crud.openAdd({ usersCount: 0 })} actionLabel="Add Role" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Role' : 'Add Role'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Role Name" required><Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="Enter role name" /></FormField>
          <FormField label="Description"><Textarea value={crud.formData.description || ''} onChange={e => crud.updateForm('description', e.target.value)} rows={3} placeholder="Enter description" /></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Role Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ Name: crud.selected.name, Description: crud.selected.description, 'Total Users': crud.selected.usersCount }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v ?? '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Role deleted') }} title="Delete Role" message={`Delete "${crud.selected?.name}"? Users with this role will need reassignment.`} />
    </div>
  )
}
