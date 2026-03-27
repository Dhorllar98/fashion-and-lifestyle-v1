import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-fl-dark text-fl-subtle">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div>
            <h3 className="font-serif text-2xl font-semibold text-fl-base mb-5">
              Fashion &amp; Lifestyle
            </h3>
            <p className="text-sm leading-relaxed text-fl-subtle max-w-xs">
              Custom-made clothing tailored to your measurements and style preferences.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-fl-muted mb-6">
              Explore
            </p>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/catalogue', label: 'Catalogue' },
                { to: '/measurements', label: 'Measurements' },
                { to: '/track', label: 'Track Order' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-fl-subtle hover:text-fl-base transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-fl-muted mb-6">
              Contact
            </p>
            <ul className="space-y-3 text-sm">
              <li>info@fashionlifestyle.com</li>
              <li>+234 800 000 0000</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-fl-subtle/60">
            &copy; {new Date().getFullYear()} Fashion &amp; Lifestyle. All rights reserved.
          </p>
          <p className="text-xs text-fl-subtle/40 tracking-widest uppercase">v1.0.0</p>
        </div>
      </div>
    </footer>
  )
}
