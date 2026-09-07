import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as roomService from '../api/services/roomService'
import * as buildingService from '../api/services/buildingService'
import * as floorService from '../api/services/floorService'
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
  { key: 'room_number', label: 'Room Number' },
  { key: 'name', label: 'Name' },
  { key: 'building.name', label: 'Building' },
  { key: 'floor.name', label: 'Floor' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'status', label: 'Status', badge: true },
]

export default function Rooms() {
  const toast = useToast()
  const crud = useApiCrud(roomService)
  const [buildings, setBuildings] = useState([])
  const [floors, setFloors] = useState([])

  useEffect(() => {
    buildingService.getAll().then(res => setBuildings(res.data?.data || []))
    floorService.getAll().then(res => setFloors(res.data?.data || []))
  }, [])

  // Filter floors based on selected building in form
  const availableFloors = crud.formData.building_id 
    ? floors.filter(f => f.building_id === Number(crud.formData.building_id)) 
    : floors

  const save = async () => {
    if (!crud.formData.building_id || !crud.formData.floor_id || !crud.formData.room_number || !crud.formData.name || !crud.formData.capacity) { 
      toast.error('All required fields must be filled')
      return 
    }
    
    try {
      await crud.handleSave(crud.formData)
      toast.success(crud.selected ? 'Room updated' : 'Room created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Room deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Rooms" 
        description="Manage campus rooms" 
        onAdd={() => crud.openAdd({ status: 'Active', capacity: 30 })} 
        addLabel="Add Room" 
      />
      
      <div className="max-w-sm">
        <SearchBar 
          value={crud.search} 
          onChange={crud.setSearch} 
          placeholder="Search rooms..." 
        />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No rooms found" action={() => crud.openAdd({ status: 'Active', capacity: 30 })} actionLabel="Add Room" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal 
        open={crud.modalOpen} 
        onClose={crud.closeModals} 
        title={crud.selected ? 'Edit Room' : 'Add Room'} 
        size="lg"
        footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Building" required>
            <Select 
              value={crud.formData.building_id || ''} 
              onChange={e => {
                crud.updateForm('building_id', e.target.value)
                crud.updateForm('floor_id', '') // reset floor when building changes
              }}
            >
              <option value="">Select Building</option>
              {buildings.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </Select>
          </FormField>
          
          <FormField label="Floor" required>
            <Select 
              value={crud.formData.floor_id || ''} 
              onChange={e => crud.updateForm('floor_id', e.target.value)}
              disabled={!crud.formData.building_id}
            >
              <option value="">Select Floor</option>
              {availableFloors.map(f => (
                <option key={f.id} value={f.id}>{f.name} (Lvl {f.floor_number})</option>
              ))}
            </Select>
          </FormField>

          <FormField label="Room Name" required>
            <Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="e.g. Science Lab 1" />
          </FormField>

          <FormField label="Room Number" required>
            <Input value={crud.formData.room_number || ''} onChange={e => crud.updateForm('room_number', e.target.value)} placeholder="e.g. SL-101" />
          </FormField>

          <FormField label="Capacity" required>
            <Input type="number" value={crud.formData.capacity || ''} onChange={e => crud.updateForm('capacity', e.target.value)} placeholder="30" />
          </FormField>

          <FormField label="Status">
            <Select value={crud.formData.status || 'Active'} onChange={e => crud.updateForm('status', e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
            </Select>
          </FormField>

          <FormField label="Description" className="md:col-span-2">
            <Textarea value={crud.formData.description || ''} onChange={e => crud.updateForm('description', e.target.value)} placeholder="Description" rows={2} />
          </FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Room Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ 
              ID: crud.selected.id,
              'Room Number': crud.selected.room_number,
              Name: crud.selected.name, 
              Building: crud.selected.building?.name,
              Floor: crud.selected.floor?.name,
              Capacity: crud.selected.capacity,
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
        title="Delete Room" 
        message={`Delete "${crud.selected?.name}"?`} 
      />
    </div>
  )
}
