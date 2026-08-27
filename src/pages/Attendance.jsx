import { useToast } from '../context/ToastContext'
import { useCrudState } from '../hooks/useCrudState'
import { attendance as mockAttendance, users } from '../data/mockData'
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

const statuses = ['Present', 'Absent', 'Late', 'Excused']
const columns = [
  { key: 'userName', label: 'User' },
  { key: 'date', label: 'Date' },
  { key: 'timeIn', label: 'Time In', render: v => v || '—' },
  { key: 'timeOut', label: 'Time Out', render: v => v || '—' },
  { key: 'status', label: 'Status', badge: true },
]

export default function Attendance() {
  const toast = useToast()
  const crud = useCrudState(mockAttendance)

  const save = () => {
    if (!crud.formData.userId || !crud.formData.date || !crud.formData.status) { toast.error('User, date, and status are required'); return }
    const userId = Number(crud.formData.userId)
    const date = crud.formData.date
    const duplicate = crud.data.find(a => a.userId === userId && a.date === date && (!crud.selected || a.id !== crud.selected.id))
    if (duplicate) { toast.error('Attendance already recorded for this user on this date'); return }
    const user = users.find(u => u.id === userId)
    crud.handleSave({ ...crud.formData, userId, userName: user?.name || '' })
    toast.success(crud.selected ? 'Attendance updated' : 'Attendance recorded')
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Attendance" description="Track daily attendance" onAdd={() => crud.openAdd({ date: new Date().toISOString().split('T')[0], status: 'Present' })} addLabel="Record Attendance" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search attendance..." /></div>
        <FilterDropdown label="All Statuses" options={statuses.map(s => ({ value: s, label: s }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.paginated.length === 0 ? <EmptyState title="No attendance records" action={() => crud.openAdd({})} actionLabel="Record Attendance" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Attendance' : 'Record Attendance'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save}>{crud.selected ? 'Update' : 'Record'}</Button></>}>
        <div className="space-y-4">
          <FormField label="User" required><Select value={crud.formData.userId || ''} onChange={e => crud.updateForm('userId', e.target.value)}><option value="">Select User</option>{users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.roleName})</option>)}</Select></FormField>
          <FormField label="Date" required><Input type="date" value={crud.formData.date || ''} onChange={e => crud.updateForm('date', e.target.value)} /></FormField>
          <FormField label="Time In"><Input type="time" value={crud.formData.timeIn || ''} onChange={e => crud.updateForm('timeIn', e.target.value)} /></FormField>
          <FormField label="Time Out"><Input type="time" value={crud.formData.timeOut || ''} onChange={e => crud.updateForm('timeOut', e.target.value)} /></FormField>
          <FormField label="Status" required><Select value={crud.formData.status || 'Present'} onChange={e => crud.updateForm('status', e.target.value)}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Attendance Details">
        {crud.selected && (<div className="space-y-3">{Object.entries({ User: crud.selected.userName, Date: crud.selected.date, 'Time In': crud.selected.timeIn || '—', 'Time Out': crud.selected.timeOut || '—', Status: crud.selected.status }).map(([k, v]) => (<div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700"><span className="text-sm text-surface-500">{k}</span><span className="text-sm font-medium text-surface-900 dark:text-white">{v}</span></div>))}</div>)}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={() => { crud.handleDelete(); toast.success('Attendance deleted') }} title="Delete Attendance" message="Delete this attendance record?" />
    </div>
  )
}
