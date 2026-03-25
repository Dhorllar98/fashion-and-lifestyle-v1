import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ordersApi } from '@/services/api'
import type { Design } from '@/types'

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount)
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
        clientName: '',   // will be filled from measurement in v2
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Order Summary</h1>
      <p className="text-stone-500 mb-8">Review your order before placing it.</p>

      <div className="card p-6 mb-8 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-stone-800">{design.name}</p>
            <p className="text-sm text-stone-500">{design.selectedColor} · {design.selectedFabric}</p>
          </div>
          <p className="font-bold text-stone-800">{formatPrice(design.price)}</p>
        </div>
        <hr className="border-stone-100" />
        <div className="flex justify-between">
          <span className="font-semibold text-stone-700">Total</span>
          <span className="font-bold text-xl text-stone-800">{formatPrice(design.price)}</span>
        </div>
      </div>

      {/* Payment — placeholder for v1 */}
      <div className="card p-6 mb-8">
        <h2 className="font-semibold text-stone-800 mb-1">Payment</h2>
        <p className="text-sm text-stone-500 mb-4">
          Payment integration (Paystack / Flutterwave) will be wired in v2. For now, orders are placed and payment is collected manually.
        </p>
        <div className="bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 text-sm text-brand-800">
          You will receive a payment invoice via email after placing your order.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
          <input
            type="tel"
            value={clientPhone}
            onChange={e => setClientPhone(e.target.value)}
            required
            className="input-field"
            placeholder="+234 800 000 0000"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
