import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { catalogueApi } from '@/services/api'
import type { Design } from '@/types'

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
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
    catalogueApi.getById(Number(id))
      .then(d => { setDesign(d); setSelectedColor(d.availableColors[0]); setSelectedFabric(d.availableFabrics[0]) })
      .catch(() => navigate('/catalogue'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleOrder = () => {
    if (!design) return
    sessionStorage.setItem('selectedDesign', JSON.stringify({ ...design, selectedColor, selectedFabric }))
    navigate('/measurements')
  }

  if (loading) return <div className="py-20 text-center text-stone-500">Loading...</div>
  if (!design) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="text-sm text-stone-500 hover:text-brand-600 mb-6 flex items-center gap-1">
        ← Back to Catalogue
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-stone-100 rounded-2xl overflow-hidden">
          {design.imageUrl ? (
            <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">No image</div>
          )}
        </div>
        <div>
          <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">{design.category}</span>
          <h1 className="text-3xl font-bold text-stone-800 mt-1 mb-3">{design.name}</h1>
          <p className="text-stone-600 leading-relaxed mb-6">{design.description}</p>
          <p className="text-2xl font-bold text-stone-800 mb-6">{formatPrice(design.price)}</p>

          <div className="mb-5">
            <p className="text-sm font-medium text-stone-700 mb-2">Select Color</p>
            <div className="flex flex-wrap gap-2">
              {design.availableColors.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedColor === c
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium text-stone-700 mb-2">Select Fabric</p>
            <div className="flex flex-wrap gap-2">
              {design.availableFabrics.map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFabric(f)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selectedFabric === f
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'border-stone-200 text-stone-600 hover:border-stone-300'
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
          <p className="text-xs text-stone-400 mt-3 text-center">
            Next: Submit your measurements for a perfect fit
          </p>
        </div>
      </div>
    </div>
  )
}
