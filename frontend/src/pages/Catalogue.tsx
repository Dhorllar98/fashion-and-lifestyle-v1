import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalogueApi } from '@/services/api'
import type { Design } from '@/types'

const CATEGORIES = ['All', 'Suits', 'Dresses', 'Traditional', 'Tops', 'Bottoms']

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function Catalogue() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [filtered, setFiltered] = useState<Design[]>([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    catalogueApi
      .getAll()
      .then(data => { setDesigns(data); setFiltered(data) })
      .catch(() => setError('Failed to load designs. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setFiltered(category === 'All' ? designs : designs.filter(d => d.category === category))
  }, [category, designs])

  return (
    <div className="bg-fl-base min-h-screen pt-28">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-4">
          Collection
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-semibold text-fl-text mb-6">
          Design Catalogue
        </h1>
        <p className="text-sm text-fl-subtle font-light max-w-md leading-relaxed">
          Choose a design to begin your custom order. Every piece is made to your exact measurements.
        </p>
      </div>

      {/* Category filter — minimal underline style */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-14">
        <div className="flex flex-wrap gap-8 border-b border-fl-muted">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs font-semibold uppercase tracking-widest pb-4 transition-all duration-300 border-b-2 -mb-px ${
                category === cat
                  ? 'border-fl-accent text-fl-text'
                  : 'border-transparent text-fl-subtle hover:text-fl-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {loading && (
          <p className="text-fl-subtle text-sm py-20 text-center tracking-wide">
            Loading collection…
          </p>
        )}
        {error && (
          <p className="text-red-400 text-sm py-20 text-center">{error}</p>
        )}

        {/* 3-column portrait grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-fl-muted mb-24">
          {filtered.map(design => (
            <Link
              key={design.id}
              to={`/catalogue/${design.id}`}
              className="group relative bg-fl-base overflow-hidden block"
            >
              {/* Portrait image — aspect 3/4 */}
              <div className="aspect-[3/4] bg-fl-muted overflow-hidden relative">
                {design.imageUrl ? (
                  <>
                    <img
                      src={design.imageUrl}
                      alt={design.name}
                      className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                    />
                    {/* Second image crossfade on hover (same src for v1 — swap in v2 with alternate shot) */}
                    <img
                      src={design.imageUrl}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 w-full h-full object-cover object-top opacity-0 transition-opacity duration-300 group-hover:opacity-100 scale-105"
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-fl-subtle/40 text-xs uppercase tracking-widest">
                      No image
                    </span>
                  </div>
                )}

                {/* Hover overlay CTA */}
                <div className="absolute inset-0 bg-fl-dark/0 group-hover:bg-fl-dark/20 transition-all duration-300 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white bg-fl-dark/80 px-5 py-3">
                    View Details
                  </span>
                </div>
              </div>

              {/* Card info */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-1.5">
                      {design.category}
                    </p>
                    <h3 className="font-serif text-xl font-semibold text-fl-text leading-snug">
                      {design.name}
                    </h3>
                  </div>
                  <p className="font-serif text-lg font-semibold text-fl-text whitespace-nowrap mt-0.5">
                    {formatPrice(design.price)}
                  </p>
                </div>
                <p className="text-sm text-fl-subtle font-light mt-3 leading-relaxed line-clamp-2">
                  {design.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
