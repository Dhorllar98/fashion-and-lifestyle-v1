import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { to: '/catalogue', label: 'Catalogue' },
    { to: '/measurements', label: 'Measurements' },
    { to: '/track', label: 'Track Order' },
  ]

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-serif text-xl font-bold text-brand-700 tracking-wide">
            Fashion &amp; Lifestyle
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-brand-600' : 'text-stone-600 hover:text-brand-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/catalogue" className="btn-primary text-sm py-2 px-5">
              Order Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-stone-100 px-4 py-4 space-y-3 bg-white">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className="block text-sm font-medium text-stone-700 hover:text-brand-600"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/catalogue" className="btn-primary block text-center text-sm py-2">
            Order Now
          </Link>
        </div>
      )}
    </nav>
  )
}
