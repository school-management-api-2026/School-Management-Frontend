export default function ChartCard({ title, children, action }) {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-white">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  )
}
