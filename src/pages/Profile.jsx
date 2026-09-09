import { useState, useEffect, useRef } from 'react'
import { User, Mail, Lock, Save, Shield, Camera } from 'lucide-react'
import axiosClient from '../api/axios'
import { uploadImage } from '../api/services/uploadService'
import { useToast } from '../context/ToastContext'
import Button from '../components/common/Button'
import FormField, { Input } from '../components/common/FormField'

export default function Profile() {
  const toast = useToast()
  const fileInputRef = useRef(null)
  const loadedRef = useRef(false)

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})

  const [form, setForm] = useState({image: '', name: '', username: '', email: '', phone: '' })
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })

  useEffect(() => {
    if (loadedRef.current) return
    loadedRef.current = true
    let ignore = false
    axiosClient.get('/me').then(res => {
      if (ignore) return
      const userData = res.data
      setUser(userData)
      setForm({
        image: userData.image || '',
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
      })
    }).catch(() => {
      if (!ignore) toast.error('Failed to load profile')
    }).finally(() => {
      if (!ignore) setLoading(false)
    })
    return () => { ignore = true }
  }, [toast])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    try {
      const res = await axiosClient.put('/profile', form)
      const updatedUser = res.data.user
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      toast.success(res.data.message || 'Profile updated successfully')
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setErrors(err.response.data.errors)
      } else {
        toast.error(err.response?.data?.message || 'Failed to update profile')
      }
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setSavingPassword(true)
    setPasswordErrors({})

    try {
      const res = await axiosClient.put('/profile/password', passwordForm)
      toast.success(res.data.message || 'Password updated successfully')
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' })
    } catch (err) {
      if (err.response?.status === 422) {
        if (err.response?.data?.errors) {
          setPasswordErrors(err.response.data.errors)
        } else {
          toast.error(err.response?.data?.message || 'Failed to update password')
        }
      } else {
        toast.error('Failed to update password')
      }
    } finally {
      setSavingPassword(false)
    }
  }

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const updatePasswordForm = (key, value) => setPasswordForm(prev => ({ ...prev, [key]: value }))

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      updateForm('image', url)
      setUser(prev => ({ ...prev, image: url }))
      toast.success('Image uploaded successfully')
    } catch (err) {
      const detail = err?.response?.data?.message
      toast.error(detail ? `Image upload failed: ${detail}` : 'Image upload failed. Check the server is running.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">View and manage your account information</p>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6">
        <div className="flex items-center gap-5 pb-6 border-b border-surface-200 dark:border-surface-700">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </span>
              )}
            </div>
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute -bottom-1 -right-1 w-7 h-7 bg-surface-100 dark:bg-surface-700 border-2 border-white dark:border-surface-800 rounded-lg flex items-center justify-center hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors">
              <Camera size={12} className="text-surface-500" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">{user?.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400">
                <Shield size={10} />
                {user?.role?.name || 'N/A'}
              </span>
              {user?.code && (
                <span className="text-xs text-surface-400 font-mono">{user.code}</span>
              )}
            </div>
            <p className="text-sm text-surface-400 mt-1">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="pt-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <User size={20} className="text-primary-500" />
            <h3 className="text-base font-semibold text-surface-900 dark:text-white">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name" required error={errors.name?.[0]}>
              <Input
                value={form.name}
                onChange={e => updateForm('name', e.target.value)}
                placeholder="Your full name"
              />
            </FormField>
            <FormField label="Username" required error={errors.username?.[0]}>
              <Input
                value={form.username}
                onChange={e => updateForm('username', e.target.value)}
                placeholder="your.username"
              />
            </FormField>
            <FormField label="Email Address" required error={errors.email?.[0]}>
              <Input
                type="email"
                value={form.email}
                onChange={e => updateForm('email', e.target.value)}
                placeholder="email@example.com"
              />
            </FormField>
            <FormField label="Phone Number" error={errors.phone?.[0]}>
              <Input
                value={form.phone}
                onChange={e => updateForm('phone', e.target.value)}
                placeholder="+855 12 345 678"
              />
            </FormField>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={saving}>
              <Save size={16} />Save Changes
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6">
        <form onSubmit={handlePasswordUpdate} className="space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-surface-200 dark:border-surface-700">
            <Lock size={20} className="text-primary-500" />
            <h3 className="text-base font-semibold text-surface-900 dark:text-white">Change Password</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField label="Current Password" required error={passwordErrors.current_password?.[0]}>
              <Input
                type="password"
                value={passwordForm.current_password}
                onChange={e => updatePasswordForm('current_password', e.target.value)}
                placeholder="••••••••"
              />
            </FormField>
            <FormField label="New Password" required error={passwordErrors.new_password?.[0]}>
              <Input
                type="password"
                value={passwordForm.new_password}
                onChange={e => updatePasswordForm('new_password', e.target.value)}
                placeholder="••••••••"
              />
            </FormField>
            <FormField label="Confirm New Password" required error={passwordErrors.new_password_confirmation?.[0]}>
              <Input
                type="password"
                value={passwordForm.new_password_confirmation}
                onChange={e => updatePasswordForm('new_password_confirmation', e.target.value)}
                placeholder="••••••••"
              />
            </FormField>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" loading={savingPassword}>
              <Lock size={16} />Update Password
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-6">
        <div className="flex items-center gap-3 pb-4 border-b border-surface-200 dark:border-surface-700">
          <Mail size={20} className="text-primary-500" />
          <h3 className="text-base font-semibold text-surface-900 dark:text-white">Account Details</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-3 bg-surface-50 dark:bg-surface-900/50 rounded-lg">
            <p className="text-xs text-surface-400 mb-1">User ID</p>
            <p className="text-sm font-medium text-surface-900 dark:text-white">{user?.id || '—'}</p>
          </div>
          <div className="p-3 bg-surface-50 dark:bg-surface-900/50 rounded-lg">
            <p className="text-xs text-surface-400 mb-1">Role</p>
            <p className="text-sm font-medium text-surface-900 dark:text-white">{user?.role?.name || '—'}</p>
          </div>
          <div className="p-3 bg-surface-50 dark:bg-surface-900/50 rounded-lg">
            <p className="text-xs text-surface-400 mb-1">Account Code</p>
            <p className="text-sm font-mono font-medium text-surface-900 dark:text-white">{user?.code || '—'}</p>
          </div>
          <div className="p-3 bg-surface-50 dark:bg-surface-900/50 rounded-lg">
            <p className="text-xs text-surface-400 mb-1">Member Since</p>
            <p className="text-sm font-medium text-surface-900 dark:text-white">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
