import { Menu, Search, Bell, Sun, Moon, User, ChevronDown, LogOut } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSidebar } from '../context/SidebarContext'
import { useTheme } from '../context/ThemeContext'
import axiosClient from '../api/axios'

export default function Navbar() {
  const navigate = useNavigate()
  const { toggle } = useSidebar()
  const { dark, toggle: toggleTheme } = useTheme()
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const profileRef = useRef()
  const notifRef = useRef()

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    let ignore = false
    axiosClient.get('/me').then(res => {
      if (ignore || !res.data) return
      const fresh = res.data
      setCurrentUser(fresh)
      try {
        const parsed = JSON.parse(localStorage.getItem('user') || 'null')
        const merged = parsed
          ? { ...parsed, ...fresh, image: parsed.image || fresh.image || '' }
          : fresh
        localStorage.setItem('user', JSON.stringify(merged))
      } catch { /* ignore parse error */ }
    }).catch(() => { /* keep stored user */ })
    return () => { ignore = true }
  }, [])

  useEffect(() => {
    const onUserUpdated = () => {
      try {
        const stored = localStorage.getItem('user')
        setCurrentUser(stored ? JSON.parse(stored) : null)
      } catch { setCurrentUser(null) }
    }
    window.addEventListener('user-updated', onUserUpdated)
    window.addEventListener('storage', onUserUpdated)
    return () => {
      window.removeEventListener('user-updated', onUserUpdated)
      window.removeEventListener('storage', onUserUpdated)
    }
  }, [])

  const userName = currentUser?.name || 'Guest'
  const roleNames = { 1: 'Admin', 2: 'Teacher', 3: 'Librarian', 4: 'Student' }
  const userRole = currentUser?.role?.name || roleNames[currentUser?.role_id] || 'Unknown'
  const userRoleId = currentUser?.role_id ? parseInt(currentUser.role_id, 10) : 1

  const getProfilePath = () => {
    if (userRoleId === 2) return '/teacher/profile'
    if (userRoleId === 4) return '/student/profile'
    return '/admin/profile'
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await axiosClient.post('/logout')
    } catch { /* ignore errors on logout */ }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const notifications = [
    { id: 1, text: 'New student enrolled in Mathematics', time: '5 min ago' },
    { id: 2, text: 'Payment received from John Doe', time: '15 min ago' },
    { id: 3, text: 'Exam scheduled for Computer Science', time: '1 hour ago' },
  ]

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
      <div className="flex items-center justify-between h-16 px-4 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <Menu size={20} />
          </button>

          <div className="hidden md:block relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-72 pl-10 pr-4 py-2 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
            />
          </div>
          <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800">
            <Search size={20} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" title={dark ? 'Light mode' : 'Dark mode'}>
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div ref={notifRef} className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-lg text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-700">
                  <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-surface-100 dark:divide-surface-700">
                  {notifications.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors cursor-pointer">
                      <p className="text-sm text-surface-700 dark:text-surface-300">{n.text}</p>
                      <p className="text-xs text-surface-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-surface-200 dark:border-surface-700 text-center">
                  <button className="text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline">View all</button>
                </div>
              </div>
            )}
          </div>

          <div ref={profileRef} className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center overflow-hidden">
                {currentUser?.image ? (
                  <img src={currentUser.image} alt={userName} className="w-8 h-8 rounded-full object-cover" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/default-profile.webp' }} />
                ) : (
                  <User size={16} className="text-primary-600 dark:text-primary-400" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-surface-900 dark:text-white">{userName}</p>
                <p className="text-xs text-surface-400">{userRole}</p>
              </div>
              <ChevronDown size={16} className="hidden md:block text-surface-400" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 shadow-lg overflow-hidden">
                <div className="py-1">
                  <button onClick={() => { setProfileOpen(false); navigate(getProfilePath()) }} className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">Profile</button>
                  <button onClick={() => { setProfileOpen(false); navigate('/admin/settings') }} className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">Settings</button>
                  <hr className="border-surface-200 dark:border-surface-700" />
                  <button onClick={handleLogout} disabled={loggingOut} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10 transition-colors disabled:opacity-50">
                    <LogOut size={14} />
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search anything..."
              autoFocus
              className="w-full pl-10 pr-4 py-2 text-sm bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-900 dark:text-surface-100 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
            />
          </div>
        </div>
      )}
    </header>
  )
}
