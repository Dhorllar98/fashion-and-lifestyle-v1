import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalogueApi } from '@/services/api'
import type { Design } from '@/types'

const CATEGORIES = ['All', 'Suits', 'Dresses', 'Traditional', 'Tops', 'Bottoms']

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
}

export default function Catalogue() {
  const [designs, setDesigns] = useState<Design[]>([])
  const [filtered, setFiltered] = useState<Design[]>([])
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    catalogueApi.getAll()
      .then(data => { setDesigns(data); setFiltered(data) })
      .catch(() => setError('Failed to load designs. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    setFiltered(category === 'All' ? designs : designs.filter(d => d.category === category))
  }, [category, designs])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-stone-800 mb-2">Design Catalogue</h1>
      <p className="text-stone-500 mb-8">Choose a design to start your custom order.</p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-brand-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-stone-500">Loading designs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(design => (
          <Link key={design.id} to={`/catalogue/${design.id}`} className="card hover:shadow-md transition-shadow group">
            <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center overflow-hidden">
              {design.imageUrl ? (
                <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <span className="text-stone-300 text-sm">No image</span>
              )}
            </div>
            <div className="p-5">
              <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">{design.category}</span>
              <h3 className="font-semibold text-stone-800 mt-1 mb-2">{design.name}</h3>
              <p className="text-sm text-stone-500 line-clamp-2 mb-4">{design.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800">{formatPrice(design.price)}</span>
                <span className="text-brand-600 text-sm font-medium">View Details →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
