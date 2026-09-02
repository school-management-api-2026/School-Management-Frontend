import { useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as userService from '../api/services/userService'
import * as roleService from '../api/services/roleService'
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

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'gender', label: 'Gender' },
  { key: 'status', label: 'Status', badge: true },
]

export default function Users() {
  const toast = useToast()
  const crud = useApiCrud(userService)
  const [roles, setRoles] = useState([])

  useEffect(() => {
    roleService.getAll()
      .then(res => setRoles(res.data?.data ?? res.data ?? []))
      .catch(() => setRoles([]))
  }, [])

  const save = async () => {
    if (!crud.formData.name || !crud.formData.email || !crud.formData.role_id) {
      toast.error('Please fill in all required fields')
      return
    }
    try {
      await crud.handleSave(crud.formData)
      toast.success(crud.selected ? 'User updated successfully' : 'User created successfully')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('User deleted successfully')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Users" description="Manage system users" onAdd={() => crud.openAdd({ status: 'Active' })} addLabel="Add User" />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search users..." /></div>
        <FilterDropdown label="All Roles" options={roles.map(r => ({ value: r.name, label: r.name }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No users found" action={() => crud.openAdd({ status: 'Active' })} actionLabel="Add User" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit User' : 'Add User'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Full Name" required><Input value={crud.formData.name || ''} onChange={e => crud.updateForm('name', e.target.value)} placeholder="Enter full name" /></FormField>
          <FormField label="Username" required><Input value={crud.formData.username || ''} onChange={e => crud.updateForm('username', e.target.value)} placeholder="Enter username" /></FormField>
          <FormField label="Email" required><Input type="email" value={crud.formData.email || ''} onChange={e => crud.updateForm('email', e.target.value)} placeholder="Enter email" /></FormField>
          <FormField label="Phone"><Input value={crud.formData.phone || ''} onChange={e => crud.updateForm('phone', e.target.value)} placeholder="Enter phone" /></FormField>
          <FormField label="Gender"><Select value={crud.formData.gender || ''} onChange={e => crud.updateForm('gender', e.target.value)}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option></Select></FormField>
          <FormField label="Date of Birth"><Input type="date" value={crud.formData.dob || ''} onChange={e => crud.updateForm('dob', e.target.value)} /></FormField>
          <FormField label="Role" required><Select value={crud.formData.role_id || ''} onChange={e => crud.updateForm('role_id', e.target.value)}><option value="">Select Role</option>{roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></FormField>
          <FormField label="Status"><Select value={crud.formData.status || 'Active'} onChange={e => crud.updateForm('status', e.target.value)}><option value="Active">Active</option><option value="Inactive">Inactive</option></Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="User Details" size="md">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({ Name: crud.selected.name, Username: crud.selected.username, Email: crud.selected.email, Phone: crud.selected.phone, Gender: crud.selected.gender, 'Date of Birth': crud.selected.dob, Status: crud.selected.status }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete User" message={`Are you sure you want to delete "${crud.selected?.name}"? This action cannot be undone.`} />
    </div>
  )
}
