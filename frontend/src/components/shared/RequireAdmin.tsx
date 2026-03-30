import { Navigate, Outlet } from 'react-router-dom'
import { getUser } from '@/lib/auth'

export default function RequireAdmin() {
  const user = getUser()
  if (!user)              return <Navigate to="/admin/login" replace />
  if (user.role !== 'Admin') return <Navigate to="/" replace />
  return <Outlet />
}
