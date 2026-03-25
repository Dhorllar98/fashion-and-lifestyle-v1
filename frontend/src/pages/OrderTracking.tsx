import { useState } from 'react'
import { ordersApi } from '@/services/api'
import { OrderStatus, OrderStatusLabel } from '@/types'
import type { OrderTrackingResult } from '@/types'

const STAGES = [
  OrderStatus.InProduction,
  OrderStatus.Ready,
  OrderStatus.Dispatched,
  OrderStatus.InTransit,
  OrderStatus.Delivered,
]

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function OrderTracking() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState<OrderTrackingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')
    setOrder(null)
    try {
      const result = await ordersApi.track(query.trim())
      setOrder(result)
    } catch {
      setError('Order not found. Please check your order number.')
    } finally {
      setLoading(false)
    }
  }

  const currentStageIndex = order ? STAGES.indexOf(order.status) : -1

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Track Your Order</h1>
      <p className="text-stone-500 mb-8">Enter your order number to see the latest status.</p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-10">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input-field flex-1"
          placeholder="e.g. FAL-2024-0001"
        />
        <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
          {loading ? 'Searching...' : 'Track'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-6">{error}</p>}

      {order && (
        <div className="card p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-stone-500">Order Number</p>
              <p className="font-bold text-lg text-stone-800">{order.orderNumber}</p>
            </div>
            <span className="bg-brand-100 text-brand-700 text-sm font-semibold px-3 py-1 rounded-full">
              {OrderStatusLabel[order.status]}
            </span>
          </div>

          {/* Progress tracker */}
          <div className="mb-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-4 h-1 bg-stone-100 -z-10" />
              <div
                className="absolute left-0 top-4 h-1 bg-brand-500 -z-10 transition-all duration-500"
                style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
              />
              {STAGES.map((stage, i) => (
                <div key={stage} className="flex flex-col items-center gap-2 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    i <= currentStageIndex
                      ? 'bg-brand-600 border-brand-600 text-white'
                      : 'bg-white border-stone-200 text-stone-400'
                  }`}>
                    {i < currentStageIndex ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs text-center leading-tight ${i <= currentStageIndex ? 'text-brand-700 font-medium' : 'text-stone-400'}`}>
                    {OrderStatusLabel[stage]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {order.trackingNote && (
            <div className="bg-stone-50 rounded-lg px-4 py-3 text-sm text-stone-600 mb-4">
              {order.trackingNote}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-stone-500">Order Date</p>
              <p className="font-medium">{formatDate(order.orderDate)}</p>
            </div>
            <div>
              <p className="text-stone-500">Est. Delivery</p>
              <p className="font-medium">{formatDate(order.estimatedDelivery)}</p>
            </div>
            {order.deliveredAt && (
              <div>
                <p className="text-stone-500">Delivered On</p>
                <p className="font-medium text-green-600">{formatDate(order.deliveredAt)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
