import { NavLink } from 'react-router-dom'
import { X, GraduationCap, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useSidebar } from '../context/SidebarContext'
import { navGroups, logoutItem } from '../constants/navigation'

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === '/admin' || item.path === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
            : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800 dark:hover:text-surface-200'
        } ${collapsed ? 'justify-center px-2' : ''}`
      }
      title={collapsed ? item.name : undefined}
    >
      <item.icon size={20} className="flex-shrink-0" />
      {!collapsed && <span className="truncate">{item.name}</span>}
    </NavLink>
  )
}

function NavGroup({ group, collapsed }) {
  const [open, setOpen] = useState(true)

  if (collapsed) {
    return (
      <div className="space-y-1 py-1">
        {group.items.map(item => <NavItem key={item.path} item={item} collapsed />)}
      </div>
    )
  }

  return (
    <div className="py-1">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
      >
        {group.label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && (
        <div className="mt-1 space-y-0.5">
          {group.items.map(item => <NavItem key={item.path} item={item} />)}
        </div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const { open, mobileOpen, closeMobile } = useSidebar()
  
  const userStr = localStorage.getItem('user')
  let user = null;
  try { user = userStr ? JSON.parse(userStr) : null } catch { /* ignore parse error */ }
  const userRoleId = user?.role_id ? parseInt(user.role_id, 10) : 4 // Default to student
  
  const filteredNavGroups = navGroups.filter(group => {
    if (!group.allowedRoles) return true
    return group.allowedRoles.includes(userRoleId)
  })

  const sidebarContent = (
    <div className={`flex flex-col h-full bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-700 ${open ? 'w-64' : 'w-[68px]'} transition-all duration-300`}>
      <div className={`flex items-center h-16 px-4 border-b border-surface-200 dark:border-surface-700 ${!open ? 'justify-center' : 'gap-3'}`}>
        <div className="flex-shrink-0 w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
          <GraduationCap size={20} className="text-white" />
        </div>
        {open && (
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-surface-900 dark:text-white truncate">SchoolMS</h1>
            <p className="text-[10px] text-surface-400 truncate">Management System</p>
          </div>
        )}
        {mobileOpen && (
          <button onClick={closeMobile} className="ml-auto p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {filteredNavGroups.map(group => <NavGroup key={group.label} group={group} collapsed={!open} />)}
      </nav>

      <div className="p-2 border-t border-surface-200 dark:border-surface-700">
        <NavItem item={logoutItem} collapsed={!open} />
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:flex flex-shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobile} />
          <aside className="relative z-50 h-full w-64 max-w-[85vw]">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
