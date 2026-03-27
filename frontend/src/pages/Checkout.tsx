import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ordersApi } from '@/services/api'
import type { Design } from '@/types'

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function Checkout() {
  const navigate = useNavigate()
  const [design, setDesign] = useState<(Design & { selectedColor: string; selectedFabric: string }) | null>(null)
  const [clientPhone, setClientPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('selectedDesign')
    const measurementId = sessionStorage.getItem('measurementId')
    if (!raw || !measurementId) { navigate('/catalogue'); return }
    setDesign(JSON.parse(raw))
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!design) return
    const measurementId = Number(sessionStorage.getItem('measurementId'))
    setLoading(true)
    setError('')
    try {
      const order = await ordersApi.create({
        clientName: '',
        clientEmail: '',
        clientPhone,
        designId: design.id,
        measurementId,
        selectedColor: design.selectedColor,
        selectedFabric: design.selectedFabric,
        totalAmount: design.price,
      })
      sessionStorage.setItem('orderNumber', order.orderNumber)
      sessionStorage.removeItem('selectedDesign')
      sessionStorage.removeItem('measurementId')
      navigate('/order-confirmation')
    } catch {
      setError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!design) return null

  return (
    <div className="bg-fl-base min-h-screen pt-28">
      <div className="max-w-2xl mx-auto px-6 md:px-12 lg:px-20 pb-28">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-4">
            Step 3 of 3
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-fl-text">
            Order Summary
          </h1>
        </div>

        {/* Order item */}
        <div className="border-t border-b border-fl-muted py-8 mb-12">
          <div className="flex justify-between items-start gap-6">
            <div>
              <p className="font-serif text-xl font-semibold text-fl-text mb-1">{design.name}</p>
              <p className="text-xs uppercase tracking-widest text-fl-subtle">
                {design.selectedColor} &nbsp;·&nbsp; {design.selectedFabric}
              </p>
            </div>
            <p className="font-serif text-xl font-semibold text-fl-text whitespace-nowrap">
              {formatPrice(design.price)}
            </p>
          </div>
          <div className="flex justify-between items-center mt-8 pt-8 border-t border-fl-muted">
            <span className="text-xs uppercase tracking-widest text-fl-subtle">Total</span>
            <span className="font-serif text-2xl font-semibold text-fl-text">
              {formatPrice(design.price)}
            </span>
          </div>
        </div>

        {/* Payment notice */}
        <div className="bg-fl-muted px-6 py-5 mb-12 border-l-2 border-fl-accent">
          <p className="text-xs uppercase tracking-widest text-fl-accent mb-2">Payment</p>
          <p className="text-sm text-fl-subtle font-light leading-relaxed">
            Payment integration (Paystack / Flutterwave) arrives in v1.1.
            A payment invoice will be sent to your email after placing this order.
          </p>
        </div>

        {/* Phone & submit */}
        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <label className="block text-xs uppercase tracking-widest text-fl-subtle mb-3">
              Phone Number
            </label>
            <input
              type="tel"
              value={clientPhone}
              onChange={e => setClientPhone(e.target.value)}
              required
              className="input-field"
              placeholder="+234 800 000 0000"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs uppercase tracking-widest">{error}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full text-center">
            {loading ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  )
}
