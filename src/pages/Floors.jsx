import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as floorService from '../api/services/floorService'
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
  { key: 'name', label: 'Name' },
  { key: 'floor_number', label: 'Floor Number' },
  { key: 'building.name', label: 'Building' },
  { key: 'status', label: 'Status', badge: true },
]

export default function Floors() {
  const toast = useToast()
  const crud = useApiCrud(floorService)
  const [buildings, setBuildings] = useState([])

  useEffect(() => {
    // Fetch buildings for the dropdown
    buildingService.getAll().then(res => {
      setBuildings(res.data?.data || [])
    }).catch(err => {
      console.error("Failed to load buildings", err)
    })
  }, [])

  const save = async () => {
    if (!crud.formData.building_id || !crud.formData.name || !crud.formData.floor_number) { 
      toast.error('Building, name, and floor number are required')
      return 
    }
    
    try {
      await crud.handleSave(crud.formData)
      toast.success(crud.selected ? 'Floor updated' : 'Floor created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Floor deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Floors" 
        description="Manage building floors" 
        onAdd={() => crud.openAdd({ status: 'Active' })} 
        addLabel="Add Floor" 
      />
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="max-w-sm flex-1">
          <SearchBar 
            value={crud.search} 
            onChange={crud.setSearch} 
            placeholder="Search floors..." 
          />
        </div>
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No floors found" action={() => crud.openAdd({ status: 'Active' })} actionLabel="Add Floor" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal 
        open={crud.modalOpen} 
        onClose={crud.closeModals} 
        title={crud.selected ? 'Edit Floor' : 'Add Floor'} 
        footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}
      >
        <div className="space-y-4">
          <FormField label="Building" required>
            <Select value={crud.formData.building_id || ''} onChange={e => crud.updateForm('building_id', e.target.value)}>
              <option value="">Select Building</option>
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Floor Name" required>
            <Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="Main Floor" />
          </FormField>
          <FormField label="Floor Number" required>
            <Input value={crud.formData.floor_number || ''} onChange={e => crud.updateForm('floor_number', e.target.value)} placeholder="1" />
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

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Floor Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ 
              ID: crud.selected.id,
              Name: crud.selected.name, 
              'Floor Number': crud.selected.floor_number,
              Building: crud.selected.building?.name,
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
        title="Delete Floor" 
        message={`Delete "${crud.selected?.name}"?`} 
      />
    </div>
  )
}
