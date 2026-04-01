import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-fl-base flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-6">
        404
      </p>
      <h1 className="font-serif text-5xl md:text-6xl font-semibold text-fl-text mb-6 leading-tight max-w-lg">
        This page doesn't exist — but your perfect outfit does.
      </h1>
      <p className="text-sm text-fl-subtle font-light mb-12 max-w-sm leading-relaxed">
        Fashion &amp; Lifestyle
      </p>
      <Link
        to="/"
        className="text-xs font-semibold uppercase tracking-widest px-8 py-4 bg-fl-accent text-white hover:bg-fl-dark transition-all duration-300"
      >
        Back to Homepage
      </Link>
    </div>
  )
}
