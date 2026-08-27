import { useState } from 'react'
import { ChevronUp, ChevronDown, Eye, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from './StatusBadge'

export default function DataTable({ columns, data, onView, onEdit, onDelete, actions = true }) {
  const [sortKey, setSortKey] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (!key) return
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey] ?? ''
    const bVal = b[sortKey] ?? ''
    const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
    return sortDir === 'asc' ? cmp : -cmp
  })

  return (
    <div className="overflow-x-auto border border-surface-200 dark:border-surface-700 rounded-xl">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-surface-50 dark:bg-surface-800/50">
            {columns.map(col => (
              <th
                key={col.key}
                className={`px-4 py-3 font-medium text-surface-500 dark:text-surface-400 whitespace-nowrap ${col.sortable !== false ? 'cursor-pointer select-none hover:text-surface-700 dark:hover:text-surface-200' : ''}`}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {sortKey === col.key && (sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </span>
              </th>
            ))}
            {actions && <th className="px-4 py-3 font-medium text-surface-500 dark:text-surface-400 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
          {sorted.map((row, i) => (
            <tr key={row.id || i} className="bg-white dark:bg-surface-900 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-surface-700 dark:text-surface-300 whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : (
                    col.badge ? <StatusBadge status={row[col.key]} /> : String(row[col.key] ?? '—')
                  )}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {onView && (
                      <button onClick={() => onView(row)} className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors" title="View">
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg text-surface-400 hover:text-warning-600 hover:bg-warning-50 dark:hover:bg-warning-500/10 transition-colors" title="Edit">
                        <Pencil size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
