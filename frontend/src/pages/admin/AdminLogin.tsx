import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'
import { setAuth } from '@/lib/auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await authApi.login(form)
      if (user.role !== 'Admin') {
        setError('This account does not have admin access.')
        return
      }
      setAuth(user)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-fl-base min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-4">
            Admin Access
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-fl-text leading-tight">
            Fashion &amp; Lifestyle
          </h1>
          <p className="text-sm text-fl-subtle font-light mt-4">
            Restricted to admin accounts only.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-10">
          <div>
            <label className="block text-xs uppercase tracking-widest text-fl-subtle mb-3">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="admin@fashionlifestyle.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-fl-subtle mb-3">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="border-l-2 border-red-400 pl-4 py-1">
              <p className="text-red-400 text-xs leading-relaxed">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-center">
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-fl-subtle/50 font-light mt-10 text-center">
          Customer login? <a href="/login" className="hover:text-fl-accent transition-colors duration-300">Go here</a>
        </p>

      </div>
    </div>
  )
}
