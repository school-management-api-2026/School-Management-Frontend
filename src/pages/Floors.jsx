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
import FormField, { Input, Select } from '../components/common/FormField'

const columns = [
  { key: 'floor_number', label: 'Floor Number' },
  { key: 'building', label: 'Building', render: (_, row) => row.building?.name || '—' },
]

export default function Floors() {
  const toast = useToast()
  const crud = useApiCrud(floorService)
  const [buildings, setBuildings] = useState([])

  useEffect(() => {
    buildingService.getAll().then(res => {
      setBuildings(res.data?.data ?? res.data ?? [])
    }).catch(() => setBuildings([]))
  }, [])

  const save = async () => {
    if (!crud.formData.building_id || !crud.formData.floor_number) { 
      toast.error('Building and floor number are required')
      return 
    }
    
    const payload = { building_id: Number(crud.formData.building_id), floor_number: crud.formData.floor_number }
    try {
      await crud.handleSave(payload)
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
        onAdd={() => crud.openAdd({})} 
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
        <EmptyState title="No floors found" action={() => crud.openAdd({})} actionLabel="Add Floor" />
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
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Floor Number" required>
            <Input value={crud.formData.floor_number || ''} onChange={e => crud.updateForm('floor_number', e.target.value)} placeholder="1" />
          </FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Floor Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ 
              ID: crud.selected.id,
              'Floor Number': crud.selected.floor_number,
              Building: crud.selected.building?.name,
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
        message={`Delete floor ${crud.selected?.floor_number}?`} 
      />
    </div>
  )
}
