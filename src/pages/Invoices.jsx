import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as invoiceService from '../api/services/invoiceService'
import * as enrollmentService from '../api/services/enrollmentService'
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

const statuses = ['Unpaid', 'Paid', 'Partial']
const studentName = row => row.enrollment?.student?.user?.name || '—'
const courseName = row => row.enrollment?.course?.subject?.name || '—'

export default function Invoices() {
  const toast = useToast()
  const crud = useApiCrud(invoiceService)
  const [enrollments, setEnrollments] = useState([])

  useEffect(() => {
    enrollmentService.getAll().then(res => setEnrollments(res.data?.data ?? res.data ?? [])).catch(() => setEnrollments([]))
  }, [])

  const columns = [
    { key: 'student', label: 'Student', render: (_, row) => studentName(row) },
    { key: 'course', label: 'Course', render: (_, row) => courseName(row) },
    { key: 'total_amount', label: 'Amount', render: v => `$${Number(v ?? 0).toFixed(2)}` },
    { key: 'due_date', label: 'Due Date' },
    { key: 'status', label: 'Status', badge: true },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.enrollment_id || !f.total_amount || !f.status || !f.due_date) {
      toast.error('Enrollment, amount, status and due date are required'); return
    }
    const payload = { enrollment_id: Number(f.enrollment_id), total_amount: Number(f.total_amount), status: f.status, due_date: f.due_date }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Invoice updated' : 'Invoice created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Invoice deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Invoices" description="Manage student invoices" onAdd={() => crud.openAdd({ status: 'Unpaid' })} addLabel="Add Invoice" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search invoices..." /></div>
        <FilterDropdown label="All Statuses" options={statuses.map(s => ({ value: s, label: s }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No invoices found" action={() => crud.openAdd({ status: 'Unpaid' })} actionLabel="Add Invoice" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Invoice' : 'Add Invoice'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Student — Course" required><Select value={crud.formData.enrollment_id || ''} onChange={e => crud.updateForm('enrollment_id', e.target.value)}><option value="">Select Enrollment</option>{enrollments.map(en => <option key={en.id} value={en.id}>{en.student?.user?.name} — {en.course?.subject?.name}</option>)}</Select></FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Total Amount" required><Input type="number" step="0.01" value={crud.formData.total_amount ?? ''} onChange={e => crud.updateForm('total_amount', e.target.value)} placeholder="0.00" /></FormField>
            <FormField label="Due Date" required><Input type="date" value={crud.formData.due_date || ''} onChange={e => crud.updateForm('due_date', e.target.value)} /></FormField>
          </div>
          <FormField label="Status" required><Select value={crud.formData.status || 'Unpaid'} onChange={e => crud.updateForm('status', e.target.value)}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</Select></FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Invoice Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Student: studentName(crud.selected),
              Course: courseName(crud.selected),
              Amount: `$${Number(crud.selected.total_amount ?? 0).toFixed(2)}`,
              'Due Date': crud.selected.due_date,
              Status: crud.selected.status,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Invoice" message="Delete this invoice?" />
    </div>
  )
}