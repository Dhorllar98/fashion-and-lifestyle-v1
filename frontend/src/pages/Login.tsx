import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'
import { setAuth } from '@/lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
      setAuth(user)
      navigate('/catalogue')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-fl-base min-h-screen pt-28 pb-28">
      <div className="max-w-md mx-auto px-6">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-4">
            Welcome Back
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-fl-text leading-tight">
            Sign In
          </h1>
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
              placeholder="john@example.com"
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

        <p className="text-xs text-fl-subtle font-light mt-10 text-center">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-fl-accent hover:text-fl-dark transition-colors duration-300">
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}
