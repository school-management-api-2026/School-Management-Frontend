import { Loader2 } from 'lucide-react'

export default function Loading({ text = 'Loading...', fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 size={32} className="text-primary-500 animate-spin" />
      <p className="text-sm text-surface-500 dark:text-surface-400">{text}</p>
    </div>
  )

  if (fullPage) {
    return <div className="flex items-center justify-center min-h-[60vh]">{content}</div>
  }
  return content
}
