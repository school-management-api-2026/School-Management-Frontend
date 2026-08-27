const statusStyles = {
  active: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500',
  inactive: 'bg-surface-100 text-surface-500 dark:bg-surface-700 dark:text-surface-400',
  present: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500',
  absent: 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500',
  late: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500',
  excused: 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500',
  paid: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500',
  unpaid: 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500',
  partial: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500',
  pending: 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-500',
  completed: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500',
  cancelled: 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500',
  available: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500',
  borrowed: 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500',
  damaged: 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500',
  lost: 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500',
  returned: 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-500',
  overdue: 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500',
  enrolled: 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-500',
  dropped: 'bg-danger-50 text-danger-700 dark:bg-danger-500/10 dark:text-danger-500',
  male: 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-500',
  female: 'bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-500',
}

export default function StatusBadge({ status }) {
  if (!status) return <span>—</span>
  const key = String(status).toLowerCase()
  const style = statusStyles[key] || 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  )
}
