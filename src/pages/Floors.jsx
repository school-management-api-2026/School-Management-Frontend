import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { floors as mockFloors, buildings } from '../data/mockData'
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
  { key: 'floorNumber', label: 'Floor Number' },
  { key: 'buildingName', label: 'Building' },
]

export default function Floors() {
  const toast = useToast()
  const crud = useCrudState(mockFloors)

  const save = () => {
    if (!crud.formData.buildingId || !crud.formData.floorNumber) { toast.error('Building and floor number are required'); return }
    const building = buildings.find(b => b.id === Number(crud.formData.buildingId))
    crud.handleSave({ ...crud.formData, buildingId: Number(crud.formData.buildingId), buildingName: building?.name || '', floorNumber: Number(crud.formData.floorNumber) })
    toast.success(crud.selected ? 'Floor updated' : 'Floor created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Floors" description="Manage building floors" onAdd={() => crud.openAdd({})} addLabel="Add Floor" />
      <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search floors..." /></div>

      {crud.paginated.length === 0 ? <EmptyState title="No floors found" action={() => crud.openAdd({})} actionLabel="Add Floor" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Floor' : 'Add Floor'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Building" required><Select value={crud.formData.buildingId || ''} onChange={e => crud.updateForm('buildingId', e.target.value)}><option value="">Select Building</option>{buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</Select></FormField>
          <FormField label="Floor Number" required><Input type="number" value={crud.formData.floorNumber || ''} onChange={e => crud.updateForm('floorNumber', e.target.value)} placeholder="1" /></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Floor Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ 'Floor Number': crud.selected.floorNumber, Building: crud.selected.buildingName }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v ?? '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Floor deleted') }} title="Delete Floor" message="Delete this floor?" />
    </div>
  )
}
