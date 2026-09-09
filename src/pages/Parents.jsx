import { useRef, useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import { uploadImage } from '../api/services/uploadService'
import * as parentService from '../api/services/parentService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

export default function Parents() {
  const toast = useToast()
  const crud = useApiCrud(parentService)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (_, row) => (
        <img
          src={row.user?.image || '/default-profile.webp'}
          alt="Parent"
          className="w-8 h-8 rounded-full object-cover border border-surface-200 dark:border-surface-700"
        />
      ),
    },
    { key: 'name', label: 'Name', render: (_, row) => row.user?.name || '—' },
    { key: 'code', label: 'Code', render: (_, row) => row.user?.code || '—' },
    { key: 'email', label: 'Email', render: (_, row) => row.user?.email || '—' },
    { key: 'phone', label: 'Phone', render: (_, row) => row.user?.phone || '—' },
    { key: 'gender', label: 'Gender', render: (_, row) => row.user?.gender || '—' },
  ]

  const updateUserField = (key, value) =>
    crud.updateForm('user', { ...(crud.formData.user || {}), [key]: value })

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      crud.updateForm('image', url)
      toast.success('Image uploaded successfully')
    } catch (err) {
      toast.error(err?.response?.data?.message ? `Image upload failed: ${err.response.data.message}` : 'Image upload failed. Check the server is running.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const save = async () => {
    const user = crud.formData.user || {}
    if (!user.name || !user.email) { toast.error('Name and email are required'); return }
    const payload = {
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      date_of_birth: user.date_of_birth,
      role_id: crud.formData.role_id ?? user.role_id ?? 5,
      image: crud.formData.image || user.image,
    }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Parent updated' : 'Parent created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Parent deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Parents" description="Manage parent records" onAdd={() => crud.openAdd({ role_id: 5, user: {} })} addLabel="Add Parent" />
      <div className="max-w-sm"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search parents..." /></div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? <EmptyState title="No parents found" action={() => crud.openAdd({ role_id: 5, user: {} })} actionLabel="Add Parent" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Parent' : 'Add Parent'} size="xl" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={crud.formData.image || crud.formData.user?.image || '/default-profile.webp'}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover bg-surface-100 dark:bg-surface-700 border border-surface-200 dark:border-surface-700 shadow-sm"
              />
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary-600 text-white cursor-pointer hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-sm">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              </button>
              {uploading && <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center"><Loader2 size={18} className="animate-spin text-white" /></div>}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            </div>
            <div className="flex-1 space-y-1.5">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-white">
                {crud.formData.user?.name || 'Parent Profile'}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">Upload a profile photo or paste an image URL below.</p>
              <Input value={crud.formData.image || ''} onChange={e => crud.updateForm('image', e.target.value)} placeholder="Or paste an image URL" />
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-3">Account Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" required><Input value={crud.formData.user?.name || ''} onChange={e => updateUserField('name', e.target.value)} placeholder="Parent name" /></FormField>
              <FormField label="Username"><Input value={crud.formData.user?.username || ''} onChange={e => updateUserField('username', e.target.value)} placeholder="Username" /></FormField>
              <FormField label="Email" required><Input type="email" value={crud.formData.user?.email || ''} onChange={e => updateUserField('email', e.target.value)} placeholder="Email address" /></FormField>
              <FormField label="Phone"><Input value={crud.formData.user?.phone || ''} onChange={e => updateUserField('phone', e.target.value)} placeholder="Phone number" /></FormField>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-3">Personal Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Gender"><Select value={crud.formData.user?.gender || ''} onChange={e => updateUserField('gender', e.target.value)}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option></Select></FormField>
              <FormField label="Date of Birth"><Input type="date" value={crud.formData.user?.date_of_birth || ''} onChange={e => updateUserField('date_of_birth', e.target.value)} /></FormField>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Parent Details" size="md">
        {crud.selected && (
          <div className="space-y-3">
            <div className="flex justify-center py-2">
              <img
                src={crud.selected.user?.image || '/default-profile.webp'}
                alt="Parent"
                className="w-24 h-24 rounded-full object-cover border-2 border-surface-200 dark:border-surface-700 shadow-sm"
              />
            </div>
            {Object.entries({
              Code: crud.selected.user?.code,
              Name: crud.selected.user?.name,
              Username: crud.selected.user?.username,
              Email: crud.selected.user?.email,
              Phone: crud.selected.user?.phone,
              Gender: crud.selected.user?.gender,
              'Date of Birth': crud.selected.user?.date_of_birth,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Parent" message={`Delete "${crud.selected?.user?.name}"?`} />
    </div>
  )
}