import { useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useApiCrud } from '../hooks/useApiCrud'
import * as payrollService from '../api/services/payrollService'
import * as teacherService from '../api/services/teacherService'
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

const formatPeriod = row => {
  if (!row.pay_period_start || !row.pay_period_end) return '—'
  const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  return `${fmt(row.pay_period_start)} – ${fmt(row.pay_period_end)}`
}

export default function Payrolls() {
  const toast = useToast()
  const crud = useApiCrud(payrollService)
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    teacherService.getAll()
      .then(res => setTeachers(res.data?.data ?? res.data ?? []))
      .catch(() => setTeachers([]))
  }, [])

  const columns = [
    { key: 'teacher', label: 'Teacher', render: (_, row) => row.teacher?.user?.name || '—' },
    { key: 'base_salary', label: 'Base Salary', render: v => currency(v) },
    { key: 'bonus', label: 'Bonus', render: v => currency(v) },
    { key: 'deduction', label: 'Deduction', render: v => currency(v) },
    { key: 'net_salary', label: 'Net Salary', render: v => currency(v) },
    { key: 'pay_period_start', label: 'Pay Period', render: (_, row) => formatPeriod(row) },
    { key: 'pay_date', label: 'Pay Date' },
  ]

  const save = async () => {
    const f = crud.formData
    if (!f.teacher_id || !f.base_salary || !f.pay_period_start || !f.pay_period_end || !f.pay_date) {
      toast.error('Teacher, base salary, pay period and pay date are required'); return
    }
    const base = Number(f.base_salary) || 0
    const bonus = Number(f.bonus) || 0
    const deduction = Number(f.deduction) || 0
    const payload = {
      teacher_id: Number(f.teacher_id),
      base_salary: base,
      bonus,
      deduction,
      net_salary: base + bonus - deduction,
      pay_date: f.pay_date,
      pay_period_start: f.pay_period_start,
      pay_period_end: f.pay_period_end,
    }
    try {
      await crud.handleSave(payload)
      toast.success(crud.selected ? 'Payroll updated' : 'Payroll created')
    } catch {
      toast.error(crud.error || 'Operation failed')
    }
  }

  const del = async () => {
    try {
      await crud.handleDelete()
      toast.success('Payroll deleted')
    } catch {
      toast.error(crud.error || 'Delete failed')
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Payrolls" description="Manage teacher payroll" onAdd={() => crud.openAdd({})} addLabel="Add Payroll" />
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1"><SearchBar value={crud.search} onChange={crud.setSearch} placeholder="Search payrolls..." /></div>
      </div>

      {crud.loading && <p className="text-sm text-surface-500 dark:text-surface-400">Loading...</p>}
      {crud.error && <p className="text-sm text-red-500">{crud.error}</p>}

      {!crud.loading && crud.paginated.length === 0 ? <EmptyState title="No payroll records" action={() => crud.openAdd({})} actionLabel="Add Payroll" /> : (
        <>
          <DataTable columns={columns} data={crud.paginated} onView={crud.openView} onEdit={crud.openEdit} onDelete={crud.openDelete} />
          <Pagination currentPage={crud.currentPage} totalPages={crud.totalPages} onPageChange={crud.setCurrentPage} />
        </>
      )}

      <Modal open={crud.modalOpen} onClose={crud.closeModals} title={crud.selected ? 'Edit Payroll' : 'Add Payroll'} size="lg" footer={<><Button variant="secondary" onClick={crud.closeModals}>Cancel</Button><Button onClick={save} disabled={crud.loading}>{crud.selected ? 'Update' : 'Create'}</Button></>}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Teacher" required><Select value={crud.formData.teacher_id || ''} onChange={e => crud.updateForm('teacher_id', e.target.value)}><option value="">Select Teacher</option>{teachers.map(t => <option key={t.id} value={t.id}>{t.user?.name || `Teacher #${t.id}`}</option>)}</Select></FormField>
          <FormField label="Pay Date" required><Input type="date" value={crud.formData.pay_date || ''} onChange={e => crud.updateForm('pay_date', e.target.value)} /></FormField>
          <FormField label="Period Start" required><Input type="date" value={crud.formData.pay_period_start || ''} onChange={e => crud.updateForm('pay_period_start', e.target.value)} /></FormField>
          <FormField label="Period End" required><Input type="date" value={crud.formData.pay_period_end || ''} onChange={e => crud.updateForm('pay_period_end', e.target.value)} /></FormField>
          <FormField label="Base Salary" required><Input type="number" step="0.01" value={crud.formData.base_salary || ''} onChange={e => crud.updateForm('base_salary', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Bonus"><Input type="number" step="0.01" value={crud.formData.bonus || ''} onChange={e => crud.updateForm('bonus', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Deduction"><Input type="number" step="0.01" value={crud.formData.deduction || ''} onChange={e => crud.updateForm('deduction', e.target.value)} placeholder="0.00" /></FormField>
          <FormField label="Net Salary (auto-calculated)">
            <Input value={currency((Number(crud.formData.base_salary) || 0) + (Number(crud.formData.bonus) || 0) - (Number(crud.formData.deduction) || 0))} disabled />
          </FormField>
        </div>
      </Modal>

      <Modal open={crud.viewModal} onClose={crud.closeModals} title="Payroll Details" size="md">
        {crud.selected && (
          <div className="space-y-3">
            {Object.entries({
              Teacher: crud.selected.teacher?.user?.name,
              'Base Salary': currency(crud.selected.base_salary),
              Bonus: currency(crud.selected.bonus),
              Deduction: currency(crud.selected.deduction),
              'Net Salary': currency(crud.selected.net_salary),
              'Pay Period': formatPeriod(crud.selected),
              'Pay Date': crud.selected.pay_date,
            }).map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-surface-100 dark:border-surface-700">
                <span className="text-sm text-surface-500 dark:text-surface-400">{k}</span>
                <span className="text-sm font-medium text-surface-900 dark:text-white">{v || '—'}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={crud.deleteModal} onClose={crud.closeModals} onConfirm={del} title="Delete Payroll" message={`Delete payroll for "${crud.selected?.teacher?.user?.name}"?`} />
    </div>
  )
}