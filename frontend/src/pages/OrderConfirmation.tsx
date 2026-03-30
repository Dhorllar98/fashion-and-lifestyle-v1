import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function OrderConfirmation() {
  const [orderNumber, setOrderNumber] = useState('')
  const [tracking,    setTracking]    = useState<OrderTrackingResult | null>(null)
  const [fetching,    setFetching]    = useState(true)

  useEffect(() => {
    const num = sessionStorage.getItem('orderNumber') ?? ''
    sessionStorage.removeItem('orderNumber')
    setOrderNumber(num)

    if (!num) { setFetching(false); return }

    ordersApi
      .track(num)
      .then(setTracking)
      .catch(() => {}) // order number still shown even if track call fails
      .finally(() => setFetching(false))
  }, [])

  const currentStageIndex = tracking ? STAGES.indexOf(tracking.status) : -1

  return (
    <div className="bg-fl-base min-h-screen pt-28 pb-28">
      <div className="max-w-lg mx-auto px-6">

        {/* Check mark */}
        <div className="w-16 h-16 border border-fl-accent flex items-center justify-center mx-auto mb-10">
          <svg className="w-7 h-7 text-fl-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-5">
            Confirmed
          </p>
          <h1 className="font-serif text-5xl font-semibold text-fl-text mb-6">
            Order Placed
          </h1>
          <p className="text-sm text-fl-subtle font-light leading-relaxed max-w-sm mx-auto">
            Thank you. Our team will begin production shortly and you'll receive
            status updates at every stage.
          </p>
        </div>

        {/* Order number */}
        {orderNumber && (
          <div className="bg-fl-muted px-8 py-7 mb-14 text-center">
            <p className="text-xs uppercase tracking-widest text-fl-subtle mb-3">
              Your Order Number
            </p>
            <p className="font-serif text-3xl font-semibold text-fl-dark tracking-widest">
              {orderNumber}
            </p>
            <p className="text-xs text-fl-subtle/60 mt-3 font-light">
              Save this number to track your order at any time
            </p>
          </div>
        )}

        {/* Live status — fetched from backend after order creation */}
        {fetching && (
          <p className="text-xs uppercase tracking-widest text-fl-subtle text-center mb-14">
            Loading status…
          </p>
        )}

        {!fetching && tracking && (
          <div className="border-t border-fl-muted pt-12 mb-14">
            {/* Status badge */}
            <div className="flex items-center justify-between mb-12">
              <p className="text-xs uppercase tracking-widest text-fl-subtle">Current Status</p>
              <span className="text-xs font-semibold uppercase tracking-widest text-fl-accent border border-fl-accent px-4 py-2">
                {OrderStatusLabel[tracking.status]}
              </span>
            </div>

            {/* Progress tracker */}
            <div className="relative mb-14">
              <div className="absolute top-3 left-0 right-0 h-px bg-fl-muted" />
              <div
                className="absolute top-3 left-0 h-px bg-fl-accent transition-all duration-500"
                style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {STAGES.map((stage, i) => {
                  const done = i <= currentStageIndex
                  return (
                    <div key={stage} className="flex flex-col items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          done ? 'bg-fl-accent border-fl-accent' : 'bg-fl-base border-fl-muted'
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
                        className={`text-center leading-tight max-w-[60px] transition-colors duration-300 ${
                          done ? 'text-fl-text font-semibold uppercase tracking-wide' : 'text-fl-subtle/60 font-light'
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

            {/* Dates */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-fl-subtle mb-2">Order Date</p>
                <p className="font-serif text-lg font-semibold text-fl-text">
                  {formatDate(tracking.orderDate)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-fl-subtle mb-2">Est. Delivery</p>
                <p className="font-serif text-lg font-semibold text-fl-text">
                  {formatDate(tracking.estimatedDelivery)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/track" className="btn-primary text-center flex-1">
            Track My Order
          </Link>
          <Link to="/catalogue" className="btn-dark text-center flex-1">
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  )
}
