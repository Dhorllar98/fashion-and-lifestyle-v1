import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { clearAuth, getUser } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

const navLinks = [
  { to: '/catalogue',    label: 'Catalogue' },
  { to: '/measurements', label: 'Measurements' },
  { to: '/track',        label: 'Track Order' },
]

export default function Navbar() {
  const navigate   = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const [user,     setUser]     = useState<AuthUser | null>(() => getUser())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep auth state in sync across the app via the custom event
  useEffect(() => {
    const sync = () => setUser(getUser())
    window.addEventListener('auth-change', sync)
    return () => window.removeEventListener('auth-change', sync)
  }, [])

  const handleLogout = () => {
    clearAuth()
    navigate('/')
    setOpen(false)
  }

  const firstName = user?.fullName.split(' ')[0]

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-fl-base/95 backdrop-blur-sm border-b border-fl-muted shadow-sm'
          : 'bg-fl-base/80 backdrop-blur-sm border-b border-fl-muted'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-18 py-5 gap-12">

          {/* Logo */}
          <Link
            to="/"
            className="font-serif text-xl font-semibold tracking-wide text-fl-dark whitespace-nowrap flex-shrink-0"
          >
            Fashion &amp; Lifestyle
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 ml-auto">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${
                    isActive ? 'text-fl-accent' : 'text-fl-subtle hover:text-fl-text'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {user ? (
              <div className="flex items-center gap-6">
                <span className="text-xs font-semibold uppercase tracking-widest text-fl-text">
                  {firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold uppercase tracking-widest text-fl-subtle hover:text-fl-accent transition-colors duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/register"
                className="text-xs font-semibold uppercase tracking-widest px-6 py-3 transition-all duration-300 bg-fl-accent text-white hover:bg-fl-dark"
              >
                Register
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1.5 p-2 text-fl-dark"
          >
            <span className={`block h-px w-6 bg-current transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px w-6 bg-current transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-current transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-fl-base border-t border-fl-muted ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 space-y-5">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block text-xs font-semibold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-fl-accent' : 'text-fl-subtle hover:text-fl-accent'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-fl-text">
                {firstName}
              </p>
              <button
                onClick={handleLogout}
                className="block text-xs font-semibold uppercase tracking-widest text-fl-subtle hover:text-fl-accent transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="btn-primary block text-center"
            >
              Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
