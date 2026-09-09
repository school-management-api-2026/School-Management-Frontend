import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as paymentService from '../api/services/paymentService'
import * as invoiceService from '../api/services/invoiceService'
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

const methods = ['Cash', 'Credit Card', 'Bank Transfer', 'Check']
const statuses = ['Completed', 'Pending', 'Cancelled', 'wait']

const invoiceRef = row => `INV-${String(row.invoice?.id ?? row.invoice_id ?? '').padStart(3, '0')}`

export default function Payments() {
  const toast = useToast()
  const crud = useApiCrud(paymentService)
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    invoiceService.getAll().then(res => setInvoices(res.data?.data ?? res.data ?? [])).catch(() => setInvoices([]))
  }, [])

  const columns = [
    { key: 'invoice', label: 'Invoice', render: (_, row) => invoiceRef(row) },
    { key: 'student', label: 'Student', render: (_, row) => row.invoice?.enrollment?.student?.user?.name || '—' },
    { key: 'amount_paid', label: 'Amount', render: v => `$${Number(v ?? 0).toFixed(2)}` },
    { key: 'payment_date', label: 'Date' },
    { key: 'payment_method', label: 'Method' },
    { key: 'status', label: 'Status', badge: true },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.invoice_id || !f.amount_paid || !f.payment_method || !f.payment_date || !f.status) {
      toast.error('Invoice, amount, method, date and status are required'); return
    }
    const payload = { invoice_id: Number(f.invoice_id), amount_paid: Number(f.amount_paid), payment_method: f.payment_method, payment_date: f.payment_date, status: f.status }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Payment updated' : 'Payment created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Payment deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Payments" description="Manage payment records" onAdd={() => crud.openAdd({ status: 'Completed', payment_date: new Date().toISOString().split('T')[0], payment_method: 'Cash' })} addLabel="Add Payment" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search payments..." /></div>
        <FilterDropdown label="All Methods" options={methods.map(m => ({ value: m, label: m }))} value={crud.filter} onChange={crud.setFilter} />
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? (
        <EmptyState title="No payments found" action={() => crud.openAdd({ status: 'Completed', payment_date: new Date().toISOString().split('T')[0], payment_method: 'Cash' })} actionLabel="Add Payment" />
      ) : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Payment' : 'Add Payment'} footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <FormField label="Invoice" required><Select value={crud.formData.invoice_id || ''} onChange={e => crud.updateForm('invoice_id', e.target.value)}><option value="">Select Invoice</option>{invoices.map(i => <option key={i.id} value={i.id}>INV-{String(i.id).padStart(3, '0')} — {i.enrollment?.student?.user?.name} ({i.enrollment?.course?.subject?.name})</option>)}</Select></FormField>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Amount" required><Input type="number" step="0.01" value={crud.formData.amount_paid ?? ''} onChange={e => crud.updateForm('amount_paid', e.target.value)} placeholder="0.00" /></FormField>
            <FormField label="Payment Date" required><Input type="date" value={crud.formData.payment_date || ''} onChange={e => crud.updateForm('payment_date', e.target.value)} /></FormField>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Payment Method" required><Select value={crud.formData.payment_method || ''} onChange={e => crud.updateForm('payment_method', e.target.value)}><option value="">Select Method</option>{methods.map(m => <option key={m} value={m}>{m}</option>)}</Select></FormField>
            <FormField label="Status" required><Select value={crud.formData.status || 'Completed'} onChange={e => crud.updateForm('status', e.target.value)}>{statuses.map(s => <option key={s} value={s}>{s}</option>)}</Select></FormField>
          </div>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Payment Details">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Invoice: invoiceRef(crud.selected),
              Student: crud.selected.invoice?.enrollment?.student?.user?.name,
              Amount: `$${Number(crud.selected.amount_paid ?? 0).toFixed(2)}`,
              Date: crud.selected.payment_date,
              Method: crud.selected.payment_method,
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

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Payment" message="Delete this payment?" />
    </div>
  )
}