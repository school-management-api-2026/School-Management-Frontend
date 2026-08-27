import { Filter } from 'lucide-react'

export default function FilterDropdown({ label = 'Filter', options, value, onChange }) {
  return (
    <div className="relative inline-flex items-center gap-2">
      <Filter size={16} className="text-surface-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer transition-colors"
      >
        <option value="">{label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
