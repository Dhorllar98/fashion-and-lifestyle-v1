import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '@/services/api'
import { clearAuth, getUser } from '@/lib/auth'
import { OrderStatus } from '@/types'
import type { Order } from '@/types'

const STATUS_OPTIONS = [
  { value: OrderStatus.InProduction, label: 'In Production' },
  { value: OrderStatus.Ready,        label: 'Ready' },
  { value: OrderStatus.Dispatched,   label: 'Dispatched' },
  { value: OrderStatus.InTransit,    label: 'In Transit' },
  { value: OrderStatus.Delivered,    label: 'Delivered' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function AdminDashboard() {
  const navigate        = useNavigate()
  const admin           = getUser()
  const [orders,   setOrders]   = useState<Order[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [updating, setUpdating] = useState<number | null>(null)
  const [saved,    setSaved]    = useState<number | null>(null)

  useEffect(() => {
    adminApi.getAllOrders()
      .then(setOrders)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSignOut = () => {
    clearAuth()
    navigate('/admin/login', { replace: true })
  }

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    setUpdating(orderId)
    setError('')
    try {
      await adminApi.updateStatus(orderId, { status: newStatus })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      setSaved(orderId)
      setTimeout(() => setSaved(null), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status.')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="bg-fl-base min-h-screen">

      {/* Admin header */}
      <div className="border-b border-fl-muted">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-1">
              Admin Panel
            </p>
            <h1 className="font-serif text-xl font-semibold text-fl-text">
              Fashion &amp; Lifestyle
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-fl-subtle hidden sm:block font-light">
              {admin?.fullName}
            </span>
            <button
              onClick={handleSignOut}
              className="text-xs font-semibold uppercase tracking-widest text-fl-subtle hover:text-fl-accent transition-colors duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">

        {/* Page title */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-3">
            Order Management
          </p>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold text-fl-text">
              All Orders
            </h2>
            {!loading && (
              <span className="text-xs text-fl-subtle font-light mb-1">
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="border-l-2 border-red-400 pl-4 py-2 mb-10">
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        {loading && (
          <p className="text-xs uppercase tracking-widest text-fl-subtle py-24 text-center">
            Loading orders…
          </p>
        )}

        {!loading && orders.length === 0 && !error && (
          <p className="text-sm text-fl-subtle font-light py-24 text-center">
            No orders have been placed yet.
          </p>
        )}

        {!loading && orders.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-fl-muted">
                  {['Order #', 'Client', 'Design', 'Status', 'Date'].map(h => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold uppercase tracking-widest text-fl-subtle pb-5 pr-8 last:pr-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr
                    key={order.id}
                    className="border-b border-fl-muted/40 hover:bg-fl-muted/20 transition-colors duration-150"
                  >
                    {/* Order number */}
                    <td className="py-5 pr-8">
                      <span className="font-mono text-xs font-semibold text-fl-dark">
                        {order.orderNumber}
                      </span>
                    </td>

                    {/* Client */}
                    <td className="py-5 pr-8">
                      <p className="text-sm text-fl-text font-light leading-snug">
                        {order.clientName}
                      </p>
                      <p className="text-xs text-fl-subtle/60 mt-0.5">
                        {order.clientEmail}
                      </p>
                    </td>

                    {/* Design */}
                    <td className="py-5 pr-8">
                      <p className="text-sm text-fl-text font-light leading-snug">
                        {order.design?.name ?? `Design #${order.designId}`}
                      </p>
                      <p className="text-xs text-fl-subtle/60 mt-0.5">
                        {order.selectedColor} · {order.selectedFabric}
                      </p>
                    </td>

                    {/* Status dropdown */}
                    <td className="py-5 pr-8">
                      <div className="flex items-center gap-3">
                        <select
                          value={order.status}
                          disabled={updating === order.id}
                          onChange={e =>
                            handleStatusChange(order.id, Number(e.target.value) as OrderStatus)
                          }
                          className="text-xs font-semibold uppercase tracking-widest bg-fl-base border border-fl-muted text-fl-text px-3 py-2 focus:outline-none focus:border-fl-accent transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                        >
                          {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {saved === order.id && (
                          <span className="text-xs text-fl-accent font-semibold uppercase tracking-widest">
                            Saved
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-5">
                      <span className="text-xs text-fl-subtle font-light">
                        {formatDate(order.orderDate)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
