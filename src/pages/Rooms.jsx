import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as roomService from '../api/services/roomService'
import * as floorService from '../api/services/floorService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

const roomTypes = ['Classroom', 'Computer Lab', 'Science Lab', 'Library', 'Office']

export default function Rooms() {
  const toast = useToast()
  const crud = useApiCrud(roomService)
  const [floors, setFloors] = useState([])

  useEffect(() => {
    floorService.getAll().then(res => setFloors(res.data?.data ?? res.data ?? [])).catch(() => setFloors([]))
  }, [])

  const buildings = [...new Map(floors.filter(f => f.building).map(f => [f.building.id, f.building])).values()]

  const availableFloors = crud.formData.building_id
    ? floors.filter(f => f.building_id === Number(crud.formData.building_id))
    : floors

  const columns = [
    { key: 'room_number', label: 'Room Number' },
    { key: 'room_type', label: 'Type' },
    { key: 'floor', label: 'Floor', render: (_, row) => `Floor ${row.floor?.floor_number || '—'}` },
    { key: 'building', label: 'Building', render: (_, row) => row.floor?.building?.name || '—' },
    { key: 'capacity', label: 'Capacity' },
  ]

  const save = async () => {
    if (!crud.formData.floor_id || !crud.formData.room_number || !crud.formData.room_type || !crud.formData.capacity) {
      toast.error('Floor, room number, type, and capacity are required')
      return
    }
    const payload = {
      floor_id: Number(crud.formData.floor_id),
      room_number: crud.formData.room_number,
      room_type: crud.formData.room_type,
      capacity: Number(crud.formData.capacity),
    }
    try {
      await crud.handleSave(payload)
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
      <PageHeader title="Rooms" description="Manage campus rooms" onAdd={() => crud.openAdd({ room_type: 'Classroom' })} addLabel="Add Room" />

      <div className="max-w-sm">
        <SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search rooms..." />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No rooms found" action={() => crud.openAdd({ room_type: 'Classroom' })} actionLabel="Add Room" />
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
                if (e.target.value) crud.updateForm('floor_id', '')
              }}
            >
              <option value="">Select Building</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </FormField>

          <FormField label="Floor" required>
            <Select value={crud.formData.floor_id || ''} onChange={e => crud.updateForm('floor_id', e.target.value)} disabled={!crud.formData.building_id}>
              <option value="">Select Floor</option>
              {availableFloors.map(f => <option key={f.id} value={f.id}>Floor {f.floor_number}</option>)}
            </Select>
          </FormField>

          <FormField label="Room Number" required>
            <Input value={crud.formData.room_number || ''} onChange={e => crud.updateForm('room_number', e.target.value)} placeholder="e.g. 101" />
          </FormField>

          <FormField label="Room Type" required>
            <Select value={crud.formData.room_type || ''} onChange={e => crud.updateForm('room_type', e.target.value)}>
              <option value="">Select Type</option>
              {roomTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </FormField>

          <FormField label="Capacity" required>
            <Input type="number" value={crud.formData.capacity || ''} onChange={e => crud.updateForm('capacity', e.target.value)} placeholder="30" />
          </FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Room Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              ID: crud.selected.id,
              'Room Number': crud.selected.room_number,
              Type: crud.selected.room_type,
              Building: crud.selected.floor?.building?.name,
              Floor: crud.selected.floor && `Floor ${crud.selected.floor.floor_number}`,
              Capacity: crud.selected.capacity,
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
        message={`Delete room ${crud.selected?.room_number}?`}
      />
    </div>
  )
}