import { Inbox } from 'lucide-react'
import Button from './Button'

export default function EmptyState({ title = 'No data found', description = 'There are no records to display.', action, actionLabel = 'Add New', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-full bg-surface-100 dark:bg-surface-800 mb-4">
        <Icon size={32} className="text-surface-400" />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-6 max-w-sm">{description}</p>
      {action && <Button onClick={action}>{actionLabel}</Button>}
    </div>
  )
}
