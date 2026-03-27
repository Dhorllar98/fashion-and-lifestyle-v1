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
    <div className="bg-fl-base min-h-screen flex items-center justify-center px-6 py-28">
      <div className="max-w-lg w-full text-center">
        {/* Check mark */}
        <div className="w-16 h-16 border border-fl-accent flex items-center justify-center mx-auto mb-10">
          <svg className="w-7 h-7 text-fl-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-5">
          Confirmed
        </p>
        <h1 className="font-serif text-5xl font-semibold text-fl-text mb-6">
          Order Placed
        </h1>
        <p className="text-sm text-fl-subtle font-light leading-relaxed mb-12 max-w-sm mx-auto">
          Thank you. Our team will begin production shortly and you'll receive
          status updates at every stage.
        </p>

        {orderNumber && (
          <div className="bg-fl-muted px-8 py-6 mb-12 inline-block">
            <p className="text-xs uppercase tracking-widest text-fl-subtle mb-3">
              Your Order Number
            </p>
            <p className="font-serif text-3xl font-semibold text-fl-dark tracking-widest">
              {orderNumber}
            </p>
            <p className="text-xs text-fl-subtle/60 mt-3 font-light">
              Save this to track your order
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/track" className="btn-primary">
            Track My Order
          </Link>
          <Link to="/catalogue" className="btn-dark">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
