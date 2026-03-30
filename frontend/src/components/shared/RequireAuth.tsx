import { Navigate, Outlet } from 'react-router-dom'
import { isLoggedIn } from '@/lib/auth'

export default function RequireAuth() {
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />
}
