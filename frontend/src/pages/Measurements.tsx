import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { measurementsApi } from '@/services/api'
import type { Measurement } from '@/types'

type FormData = Omit<Measurement, 'id' | 'submittedAt'>

const initialForm: FormData = {
  clientName: '', clientEmail: '',
  chest: 0, waist: 0, hips: 0,
  shoulderWidth: 0, sleeveLength: 0, inseamLength: 0, height: 0,
  notes: '',
}

const measurementFields: { key: keyof FormData; label: string }[] = [
  { key: 'chest', label: 'Chest (cm)' },
  { key: 'waist', label: 'Waist (cm)' },
  { key: 'hips', label: 'Hips (cm)' },
  { key: 'shoulderWidth', label: 'Shoulder Width (cm)' },
  { key: 'sleeveLength', label: 'Sleeve Length (cm)' },
  { key: 'inseamLength', label: 'Inseam Length (cm)' },
  { key: 'height', label: 'Height (cm)' },
]

export default function Measurements() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: e.target.type === 'number' ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const measurement = await measurementsApi.submit(form)
      sessionStorage.setItem('measurementId', String(measurement.id))
      navigate('/checkout')
    } catch {
      setError('Failed to submit measurements. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Your Measurements</h1>
      <p className="text-stone-500 mb-8">Provide your measurements in centimetres for a perfectly tailored fit.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Full Name</label>
            <input name="clientName" value={form.clientName} onChange={handleChange} required className="input-field" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email Address</label>
            <input name="clientEmail" type="email" value={form.clientEmail} onChange={handleChange} required className="input-field" placeholder="john@example.com" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {measurementFields.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
              <input
                name={key}
                type="number"
                min="0"
                step="0.5"
                value={form[key] as number || ''}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Additional Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="input-field resize-none"
            placeholder="Any special requirements or preferences..."
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Saving...' : 'Continue to Checkout →'}
        </button>
      </form>
    </div>
  )
}
