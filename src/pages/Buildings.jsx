import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { buildings as mockBuildings } from '../data/mockData'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input } from '../components/common/FormField'

const columns = [
  { key: 'name', label: 'Building Name' },
  { key: 'totalFloors', label: 'Total Floors' },
  { key: 'address', label: 'Address' },
]

export default function Buildings() {
  const toast = useToast()
  const crud = useCrudState(mockBuildings)

  const save = () => {
    if (!crud.formData.name) { toast.error('Building name is required'); return }
    crud.handleSave({ ...crud.formData, totalFloors: Number(crud.formData.totalFloors) || 0 })
    toast.success(crud.selected ? 'Building updated' : 'Building created')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Buildings" description="Manage campus buildings" onAdd={() => crud.openAdd({})} addLabel="Add Building" />
      <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search buildings..." /></div>

      {crud.paginated.length === 0 ? <EmptyState title="No buildings found" action={() => crud.openAdd({})} actionLabel="Add Building" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Building' : 'Add Building'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Building Name" required><Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="Building name" /></FormField>
          <FormField label="Total Floors"><Input type="number" value={crud.formData.totalFloors || ''} onChange={e => crud.updateForm('totalFloors', e.target.value)} placeholder="0" /></FormField>
          <FormField label="Address"><Input value={crud.formData.address || ''} onChange={e => crud.updateForm('address', e.target.value)} placeholder="Building address" /></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Building Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ Name: crud.selected.name, 'Total Floors': crud.selected.totalFloors, Address: crud.selected.address }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v ?? '—'}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Building deleted') }} title="Delete Building" message={`Delete "${crud.selected?.name}"?`} />
    </div>
  )
}
