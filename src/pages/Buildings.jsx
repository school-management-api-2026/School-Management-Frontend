import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as buildingService from '../api/services/buildingService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select, Textarea } from '../components/common/FormField'

const columns = [
  { key: 'name', label: 'Building Name' },
  { key: 'total_floors', label: 'Total_floors'},
  { key: 'description', label: 'description'},
  { key: 'status', label: 'Status', badge: true },
]

export default function Buildings() {
  const toast = useToast()
  const crud = useApiCrud(buildingService)

  const save = async () => {
    if (!crud.formData.name) { 
      toast.error('Building name and code are required')
      return 
    }
    
    try {
      await crud.handleSave(crud.formData)
      toast.success(crud.selected ? 'Building updated' : 'Building created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Building deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Buildings" 
        description="Manage campus buildings" 
        onAdd={() => crud.openAdd({ status: 'Active' })} 
        addLabel="Add Building" 
      />
      <div className="max-w-sm">
        <SearchBar 
          value={crud.search} 
          onChange={crud.setSearch} 
          placeholder="Search buildings..." 
        />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No buildings found" action={() => crud.openAdd({ status: 'Active' })} actionLabel="Add Building" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal 
        open={crud.modalOpen} 
        onClose={crud.closeModals} 
        title={crud.selected ? 'Edit Building' : 'Add Building'} 
        footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}
      >
        <div className="space-y-4">
          <FormField label="Building Name" required>
            <Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="Building name" />
          </FormField>
        
          <FormField label="Total Floors" required>
            <Input 
              type="number" 
              value={crud.formData.total_floors || ''} 
              onChange={e => crud.updateForm('total_floors', e.target.value)} 
              placeholder="Enter total floors" 
            />
          </FormField>

          <FormField label="Description">
            <Textarea value={crud.formData.description || ''} onChange={e => crud.updateForm('description', e.target.value)} placeholder="Description" rows={3} />
          </FormField>
          
          <FormField label="Status">
            <Select value={crud.formData.status || 'Active'} onChange={e => crud.updateForm('status', e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </Select>
          </FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Building Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ 
              ID: crud.selected.id,
              Name: crud.selected.name, 
              Total_floors: crud.selected.total_floors,
              Description: crud.selected.description,
              Status: crud.selected.status
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog 
        open={crud.deleteModal} 
        onClose={crud.closeModals} 
        onConfirm={del} 
        title="Delete Building" 
        message={`Delete "${crud.selected?.name}"?`} 
      />
    </div>
  )
}
