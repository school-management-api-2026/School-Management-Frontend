import { Plus } from 'lucide-react'
import Button from './Button'

export default function PageHeader({ title, description, onAdd, addLabel = 'Add New', children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">{title}</h1>
        {description && <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {onAdd && (
          <Button onClick={onAdd}>
            <Plus size={16} />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
