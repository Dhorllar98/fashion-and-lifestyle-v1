import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-serif text-lg font-semibold mb-3">
              Fashion &amp; Lifestyle
            </h3>
            <p className="text-sm leading-relaxed">
              Custom-made clothing tailored to your measurements and style preferences.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalogue" className="hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link to="/measurements" className="hover:text-white transition-colors">Measurements</Link></li>
              <li><Link to="/track" className="hover:text-white transition-colors">Track Order</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3 text-sm uppercase tracking-wide">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>info@fashionlifestyle.com</li>
              <li>+234 800 000 0000</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-10 pt-6 text-xs text-center">
          &copy; {new Date().getFullYear()} Fashion &amp; Lifestyle. All rights reserved. — v1.0.0
        </div>
      </div>
    </footer>
  )
}
