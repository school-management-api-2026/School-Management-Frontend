import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as courseService from '../api/services/courseService'
import * as subjectService from '../api/services/subjectService'
import PageHeader from '../components/common/PageHeader'
import SearchBar from '../components/common/SearchBar'
import DataTable from '../components/common/DataTable'
import Pagination from '../components/common/Pagination'
import Modal from '../components/common/Modal'
import ConfirmDialog from '../components/common/ConfirmDialog'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import FormField, { Input, Select } from '../components/common/FormField'

const currency = v => `$${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function Courses() {
  const toast = useToast()
  const crud = useApiCrud(courseService)
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    subjectService.getAll()
      .then(res => setSubjects(res.data?.data ?? res.data ?? []))
      .catch(() => setSubjects([]))
  }, [])

  const columns = [
    { key: 'subject', label: 'Subject', render: (_, row) => row.subject?.name || '—' },
    { key: 'unit_price', label: 'Price', render: v => currency(v) },
    { key: 'promotion', label: 'Discount', render: v => v ? `${v}%` : '—' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.subject_id || !f.unit_price || !f.start_date || !f.end_date) {
      toast.error('Subject, price and dates are required'); return
    }
    const payload = {
      subject_id: Number(f.subject_id),
      unit_price: Number(f.unit_price) || 0,
      promotion: Number(f.promotion) || 0,
      capacity: Number(f.capacity) || 0,
      start_date: f.start_date,
      end_date: f.end_date,
    }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Course updated' : 'Course created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Course deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Courses" description="Manage academic courses" onAdd={() => crud.openAdd({})} addLabel="Add Course" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search courses..." /></div>
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? <EmptyState title="No courses found" action={() => crud.openAdd({})} actionLabel="Add Course" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Course' : 'Add Course'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Subject" required className="md:col-span-2"><Select value={crud.formData.subject_id || ''} onChange={e => crud.updateForm('subject_id', e.target.value)}><option value="">Select Subject</option>{subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</Select></FormField>
          <FormField label="Unit Price" required><Input type="number" step="0.01" value={crud.formData.unit_price || ''} onChange={e => crud.updateForm('unit_price', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Promotion (%)"><Input type="number" value={crud.formData.promotion || ''} onChange={e => crud.updateForm('promotion', e.target.value)} placeholder="0" /></FormField>
          <FormField label="Capacity"><Input type="number" value={crud.formData.capacity || ''} onChange={e => crud.updateForm('capacity', e.target.value)} placeholder="30" /></FormField>
          <FormField label="Start Date" required><Input type="date" value={crud.formData.start_date || ''} onChange={e => crud.updateForm('start_date', e.target.value)} /></FormField>
          <FormField label="End Date" required><Input type="date" value={crud.formData.end_date || ''} onChange={e => crud.updateForm('end_date', e.target.value)} /></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Course Details" size="md">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Subject: crud.selected.subject?.name,
              'Unit Price': currency(crud.selected.unit_price),
              Promotion: crud.selected.promotion ? `${crud.selected.promotion}%` : 'None',
              Capacity: crud.selected.capacity,
              'Start Date': crud.selected.start_date,
              'End Date': crud.selected.end_date,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Course" message={`Delete this course (${crud.selected?.subject?.name})?`} />
    </div>
  )
}