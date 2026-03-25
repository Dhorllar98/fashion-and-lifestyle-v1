import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function OrderConfirmation() {
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    const num = sessionStorage.getItem('orderNumber') ?? ''
    setOrderNumber(num)
    sessionStorage.removeItem('orderNumber')
  }, [])

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-stone-800 mb-3">Order Placed!</h1>
      <p className="text-stone-500 mb-6">
        Thank you for your order. Our team will begin production and you'll receive updates along the way.
      </p>
      {orderNumber && (
        <div className="bg-stone-100 rounded-xl px-6 py-4 mb-8 inline-block">
          <p className="text-sm text-stone-500 mb-1">Your Order Number</p>
          <p className="text-2xl font-bold text-brand-700 tracking-widest">{orderNumber}</p>
          <p className="text-xs text-stone-400 mt-1">Save this to track your order</p>
        </div>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/track" className="btn-primary">
          Track My Order
        </Link>
        <Link to="/catalogue" className="btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
