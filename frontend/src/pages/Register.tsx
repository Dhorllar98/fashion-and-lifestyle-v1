import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/services/api'
import { setAuth } from '@/lib/auth'

interface FormData {
  fullName: string
  email: string
  phone: string
  password: string
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>({ fullName: '', email: '', phone: '', password: '' })
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
      const user = await authApi.register(form)
      setAuth(user)
      navigate('/catalogue')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.')
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
            Create Account
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-semibold text-fl-text leading-tight">
            Join Fashion<br />&amp; Lifestyle
          </h1>
          <p className="text-sm text-fl-subtle font-light mt-4 leading-relaxed">
            Create your account to place bespoke orders and track your wardrobe.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-10">
          <div>
            <label className="block text-xs uppercase tracking-widest text-fl-subtle mb-3">
              Full Name
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>

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
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="+2348012345678"
              autoComplete="tel"
            />
            <p className="text-xs text-fl-subtle/60 mt-2 font-light">
              International format — e.g. +2348012345678
            </p>
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
              minLength={8}
              className="input-field"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
          </div>

          {/* Error — exact message from API */}
          {error && (
            <div className="border-l-2 border-red-400 pl-4 py-1">
              {error.split(' | ').map((msg, i) => (
                <p key={i} className="text-red-400 text-xs leading-relaxed">
                  {msg}
                </p>
              ))}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-center">
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-xs text-fl-subtle font-light mt-10 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-fl-accent hover:text-fl-dark transition-colors duration-300">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  )
}
