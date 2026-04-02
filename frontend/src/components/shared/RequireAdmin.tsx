import { Navigate, Outlet } from 'react-router-dom'
import { getUser } from '@/lib/auth'

export default function RequireAdmin() {
  const user = getUser()
  if (!user)              return <Navigate to="/login" replace />
  if (user.role !== 'Admin') return <Navigate to="/catalogue" replace />
  return <Outlet />
}
