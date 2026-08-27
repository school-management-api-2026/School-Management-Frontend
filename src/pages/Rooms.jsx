import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { rooms as mockRooms, floors } from '../data/mockData'
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

const roomTypes = ['Classroom', 'Lab', 'Lecture Hall', 'Library', 'Studio', 'Office']
const columns = [
  { key: 'roomName', label: 'Room Name' },
  { key: 'roomNumber', label: 'Number' },
  { key: 'roomType', label: 'Type' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'buildingName', label: 'Building' },
  { key: 'floorNumber', label: 'Floor' },
]

export default function Rooms() {
  const toast = useToast()
  const crud = useCrudState(mockRooms)

  const save = () => {
    if (!crud.formData.roomName || !crud.formData.floorId) { toast.error('Room name and floor are required'); return }
    const floor = floors.find(f => f.id === Number(crud.formData.floorId))
    crud.handleSave({ ...crud.formData, floorId: Number(crud.formData.floorId), floorNumber: floor?.floorNumber || 0, buildingName: floor?.buildingName || '', capacity: Number(crud.formData.capacity) || 0 })
    toast.success(crud.selected ? 'Room updated' : 'Room created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Rooms" description="Manage campus rooms" onAdd={() => crud.openAdd({})} addLabel="Add Room" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search rooms..." /></div>
        <FilterDropdown label="All Types" options={roomTypes.map(t => ({ value: t, label: t }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.paginated.length === 0 ? <EmptyState title="No rooms found" action={() => crud.openAdd({})} actionLabel="Add Room" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Room' : 'Add Room'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Room Name" required><Input value={crud.formData.roomName || ''} onChange={e => crud.updateForm('roomName', e.target.value)} placeholder="Room name" /></FormField>
          <FormField label="Room Number"><Input value={crud.formData.roomNumber || ''} onChange={e => crud.updateForm('roomNumber', e.target.value)} placeholder="101" /></FormField>
          <FormField label="Room Type"><Select value={crud.formData.roomType || ''} onChange={e => crud.updateForm('roomType', e.target.value)}><option value="">Select Type</option>{roomTypes.map(t => <option key={t} value={t}>{t}</option>)}</Select></FormField>
          <FormField label="Capacity"><Input type="number" value={crud.formData.capacity || ''} onChange={e => crud.updateForm('capacity', e.target.value)} placeholder="30" /></FormField>
          <FormField label="Floor" required><Select value={crud.formData.floorId || ''} onChange={e => crud.updateForm('floorId', e.target.value)}><option value="">Select Floor</option>{floors.map(f => <option key={f.id} value={f.id}>{f.buildingName} — Floor {f.floorNumber}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Room Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ 'Room Name': crud.selected.roomName, Number: crud.selected.roomNumber, Type: crud.selected.roomType, Capacity: crud.selected.capacity, Building: crud.selected.buildingName, Floor: crud.selected.floorNumber }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v ?? '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Room deleted') }} title="Delete Room" message={`Delete "${crud.selected?.roomName}"?`} />
    </div>
  )
}
