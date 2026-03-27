import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { catalogueApi } from '@/services/api'
import type { Design } from '@/types'

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function DesignDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [design, setDesign] = useState<Design | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedFabric, setSelectedFabric] = useState('')

  useEffect(() => {
    if (!id) return
    catalogueApi
      .getById(Number(id))
      .then(d => {
        setDesign(d)
        setSelectedColor(d.availableColors[0])
        setSelectedFabric(d.availableFabrics[0])
      })
      .catch(() => navigate('/catalogue'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleOrder = () => {
    if (!design) return
    sessionStorage.setItem('selectedDesign', JSON.stringify({ ...design, selectedColor, selectedFabric }))
    navigate('/measurements')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-fl-base flex items-center justify-center">
        <p className="text-xs uppercase tracking-widest text-fl-subtle">Loading…</p>
      </div>
    )
  }
  if (!design) return null

  return (
    <div className="bg-fl-base min-h-screen pt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 pb-28">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="text-xs uppercase tracking-widest text-fl-subtle hover:text-fl-accent transition-colors duration-300 flex items-center gap-2 mb-14"
        >
          ← Back to Catalogue
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          {/* Image */}
          <div className="aspect-[3/4] bg-fl-muted overflow-hidden">
            {design.imageUrl ? (
              <img
                src={design.imageUrl}
                alt={design.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-xs uppercase tracking-widest text-fl-subtle/40">No image</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-4">
              {design.category}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-fl-text leading-tight mb-6">
              {design.name}
            </h1>
            <p className="text-sm text-fl-subtle font-light leading-relaxed mb-8">
              {design.description}
            </p>
            <p className="font-serif text-3xl font-semibold text-fl-text mb-12">
              {formatPrice(design.price)}
            </p>

            {/* Color selector */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-fl-subtle mb-4">
                Colour — <span className="text-fl-text">{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {design.availableColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-300 ${
                      selectedColor === c
                        ? 'border-fl-accent bg-fl-accent text-white'
                        : 'border-fl-muted text-fl-subtle hover:border-fl-subtle'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric selector */}
            <div className="mb-12">
              <p className="text-xs uppercase tracking-widest text-fl-subtle mb-4">
                Fabric — <span className="text-fl-text">{selectedFabric}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {design.availableFabrics.map(f => (
                  <button
                    key={f}
                    onClick={() => setSelectedFabric(f)}
                    className={`text-xs uppercase tracking-widest px-4 py-2 border transition-all duration-300 ${
                      selectedFabric === f
                        ? 'border-fl-accent bg-fl-accent text-white'
                        : 'border-fl-muted text-fl-subtle hover:border-fl-subtle'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleOrder} className="btn-primary w-full text-center">
              Order This Design
            </button>
            <p className="text-xs text-fl-subtle/60 mt-4 text-center font-light">
              Next: submit your measurements for a perfect fit
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
