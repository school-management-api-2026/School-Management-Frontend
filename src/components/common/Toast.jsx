import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
}

const styles = {
    success: 'bg-success-50 text-success-700 border-success-200 dark:bg-success-500/10 dark:text-success-500 dark:border-success-500/20',
    error: 'bg-danger-50 text-danger-700 border-danger-200 dark:bg-danger-500/10 dark:text-danger-500 dark:border-danger-500/20',
    warning: 'bg-warning-50 text-warning-600 border-warning-200 dark:bg-warning-500/10 dark:text-warning-500 dark:border-warning-500/20',
    info: 'bg-info-50 text-info-700 border-info-200 dark:bg-info-500/10 dark:text-info-500 dark:border-info-500/20',
}

export default function Toast() {
    const { toasts, removeToast } = useToast()

    if (toasts.length === 0) return null

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
            {toasts.map(toast => {
                const Icon = icons[toast.type]
                return (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right duration-300 ${styles[toast.type]}`}
                    >
                        <Icon size={18} className="flex-shrink-0" />
                        <p className="text-sm flex-1">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                            <X size={16} />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
