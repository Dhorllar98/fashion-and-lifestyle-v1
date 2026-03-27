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
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
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
    <div className="bg-fl-base min-h-screen pt-28">
      <div className="max-w-3xl mx-auto px-6 md:px-12 lg:px-20 pb-28">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-4">
            Order Status
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-fl-text mb-5">
            Track Your Order
          </h1>
          <p className="text-sm text-fl-subtle font-light leading-relaxed">
            Enter your order number to see real-time production and delivery updates.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-16">
          <label className="block text-xs uppercase tracking-widest text-fl-subtle mb-3">
            Order Number
          </label>
          <div className="flex gap-0 border-b border-fl-subtle focus-within:border-fl-accent transition-colors duration-300">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-fl-text text-sm py-3 px-0 placeholder-fl-subtle/50 focus:outline-none"
              placeholder="e.g. FAL-2024-0001"
            />
            <button
              type="submit"
              disabled={loading}
              className="text-xs font-semibold uppercase tracking-widest text-fl-accent hover:text-fl-dark transition-colors duration-300 disabled:opacity-40 pb-3 pl-6"
            >
              {loading ? 'Searching…' : 'Track →'}
            </button>
          </div>
        </form>

        {error && (
          <p className="text-red-400 text-xs uppercase tracking-widest mb-10">{error}</p>
        )}

        {/* Result */}
        {order && (
          <div>
            {/* Order header */}
            <div className="flex items-start justify-between mb-12 pb-8 border-b border-fl-muted">
              <div>
                <p className="text-xs uppercase tracking-widest text-fl-subtle mb-2">
                  Order Reference
                </p>
                <p className="font-serif text-2xl font-semibold text-fl-text">
                  {order.orderNumber}
                </p>
                <p className="text-xs text-fl-subtle mt-1">
                  {order.clientName}
                </p>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-fl-accent border border-fl-accent px-4 py-2 mt-1">
                {OrderStatusLabel[order.status]}
              </span>
            </div>

            {/* Progress tracker */}
            <div className="mb-14">
              <p className="text-xs uppercase tracking-widest text-fl-subtle mb-8">
                Progress
              </p>
              <div className="relative">
                {/* Track line */}
                <div className="absolute top-3 left-0 right-0 h-px bg-fl-muted" />
                <div
                  className="absolute top-3 left-0 h-px bg-fl-accent transition-all duration-500"
                  style={{
                    width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%`,
                  }}
                />

                {/* Stage dots */}
                <div className="relative flex justify-between">
                  {STAGES.map((stage, i) => {
                    const done = i <= currentStageIndex
                    return (
                      <div key={stage} className="flex flex-col items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            done
                              ? 'bg-fl-accent border-fl-accent'
                              : 'bg-fl-base border-fl-muted'
                          }`}
                        >
                          {i < currentStageIndex && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {i === currentStageIndex && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <span
                          className={`text-xs text-center leading-tight max-w-[60px] transition-colors duration-300 ${
                            done
                              ? 'text-fl-text font-semibold uppercase tracking-wide'
                              : 'text-fl-subtle/60 font-light'
                          }`}
                          style={{ fontSize: '10px' }}
                        >
                          {OrderStatusLabel[stage]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Note */}
            {order.trackingNote && (
              <div className="bg-fl-muted px-6 py-5 mb-10 border-l-2 border-fl-accent">
                <p className="text-xs uppercase tracking-widest text-fl-accent mb-2">Note</p>
                <p className="text-sm text-fl-text font-light leading-relaxed">
                  {order.trackingNote}
                </p>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-fl-subtle mb-2">
                  Order Date
                </p>
                <p className="font-serif text-lg font-semibold text-fl-text">
                  {formatDate(order.orderDate)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-fl-subtle mb-2">
                  Est. Delivery
                </p>
                <p className="font-serif text-lg font-semibold text-fl-text">
                  {formatDate(order.estimatedDelivery)}
                </p>
              </div>
              {order.deliveredAt && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-fl-subtle mb-2">
                    Delivered
                  </p>
                  <p className="font-serif text-lg font-semibold text-fl-accent">
                    {formatDate(order.deliveredAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
