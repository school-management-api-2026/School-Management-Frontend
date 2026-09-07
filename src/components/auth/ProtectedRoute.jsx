import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role_id)) {
    // If they have a token but wrong role, redirect to a safe place depending on their actual role
    if (user.role_id === 1) return <Navigate to="/admin" replace />
    if (user.role_id === 2) return <Navigate to="/teacher" replace />
    if (user.role_id === 3) return <Navigate to="/library" replace /> // if applicable
    if (user.role_id === 4) return <Navigate to="/student" replace />
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
