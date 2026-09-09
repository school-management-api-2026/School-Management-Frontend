import { useEffect, useState, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/common/Button'
import Loading from '../components/common/Loading'
import FormField, { Input, Select } from '../components/common/FormField'
import * as settingService from '../api/services/settingService'
import { Save, Moon, Bell, Globe, Shield } from 'lucide-react'

const DEFAULT_SETTINGS = {
  schoolName: 'SchoolMS Academy',
  email: 'admin@schoolms.com',
  phone: '012-555-0100',
  address: '123 Education Avenue',
  language: 'en',
  timezone: 'UTC',
  notifications: true,
  autoBackup: true,
}

const toBool = v => v === '1' || v === true

export default function Settings() {
  const { dark, toggle } = useTheme()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  const loadedRef = useRef(false)

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    settingService.getAll()
      .then(res => {
        const saved = res.data?.data || {}
        setSettings({
          ...DEFAULT_SETTINGS,
          ...Object.fromEntries(Object.entries(saved).map(([k, v]) => [k, k === 'notifications' || k === 'autoBackup' ? toBool(v) : v])),
        })
      })
      .catch(() => toast.error('Failed to load settings.'))
      .finally(() => setLoading(false))
  }, [toast])

  const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    const payload = Object.fromEntries(
      Object.entries(settings).map(([k, v]) => [k, typeof v === 'boolean' ? (v ? '1' : '0') : String(v)])
    )
    try {
      await settingService.saveAll(payload)
      toast.success('Settings saved successfully')
    } catch {
      toast.error('Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loading fullPage={false} className="min-h-[60vh]" />
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">Settings</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage application preferences</p>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-surface-200 dark:border-surface-700">
          <Globe size={20} className="text-primary-500" />
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">General</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="School Name"><Input value={settings.schoolName} onChange={e => update('schoolName', e.target.value)} /></FormField>
          <FormField label="Email"><Input type="email" value={settings.email} onChange={e => update('email', e.target.value)} /></FormField>
          <FormField label="Phone"><Input value={settings.phone} onChange={e => update('phone', e.target.value)} /></FormField>
          <FormField label="Address"><Input value={settings.address} onChange={e => update('address', e.target.value)} /></FormField>
          <FormField label="Language">
            <Select value={settings.language} onChange={e => update('language', e.target.value)}>
              <option value="en">English</option>
              <option value="km">Khmer</option>
              <option value="fr">French</option>
            </Select>
          </FormField>
          <FormField label="Timezone">
            <Select value={settings.timezone} onChange={e => update('timezone', e.target.value)}>
              <option value="UTC">UTC</option>
              <option value="Asia/Phnom_Penh">Asia/Phnom Penh (UTC+7)</option>
              <option value="America/New_York">America/New York (EST)</option>
            </Select>
          </FormField>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-surface-200 dark:border-surface-700">
          <Moon size={20} className="text-primary-500" />
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-surface-900 dark:text-white">Dark Mode</p>
            <p className="text-xs text-surface-400">Toggle dark/light theme</p>
          </div>
          <button
            onClick={toggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${dark ? 'bg-primary-600' : 'bg-surface-300'}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${dark ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-surface-200 dark:border-surface-700">
          <Bell size={20} className="text-primary-500" />
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-surface-900 dark:text-white">Enable Notifications</p>
            <p className="text-xs text-surface-400">Receive system notifications</p>
          </div>
          <button
            onClick={() => update('notifications', !settings.notifications)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifications ? 'bg-primary-600' : 'bg-surface-300'}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-surface-200 dark:border-surface-700">
          <Shield size={20} className="text-primary-500" />
          <h2 className="text-base font-semibold text-surface-900 dark:text-white">Security</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-surface-900 dark:text-white">Auto Backup</p>
            <p className="text-xs text-surface-400">Automatic daily database backup</p>
          </div>
          <button
            onClick={() => update('autoBackup', !settings.autoBackup)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.autoBackup ? 'bg-primary-600' : 'bg-surface-300'}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${settings.autoBackup ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}><Save size={16} />{saving ? 'Saving...' : 'Save Settings'}</Button>
      </div>
    </div>
  )
}