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
  { key: 'chest', label: 'Chest' },
  { key: 'waist', label: 'Waist' },
  { key: 'hips', label: 'Hips' },
  { key: 'shoulderWidth', label: 'Shoulder Width' },
  { key: 'sleeveLength', label: 'Sleeve Length' },
  { key: 'inseamLength', label: 'Inseam Length' },
  { key: 'height', label: 'Height' },
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
    <div className="bg-fl-base min-h-screen pt-28">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 pb-28">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-4">
            Step 2 of 3
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-fl-text mb-5">
            Your Measurements
          </h1>
          <p className="text-sm text-fl-subtle font-light max-w-md leading-relaxed">
            All measurements are in centimetres. Take each measurement over fitted clothing
            for the most accurate result.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Client info */}
          <div className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-fl-text mb-10">
              Your Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
              <div>
                <label className="block text-xs uppercase tracking-widest text-fl-subtle mb-3">
                  Full Name
                </label>
                <input
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-fl-subtle mb-3">
                  Email Address
                </label>
                <input
                  name="clientEmail"
                  type="email"
                  value={form.clientEmail}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </div>

          {/* Measurement fields */}
          <div className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-fl-text mb-10">
              Body Measurements <span className="text-fl-subtle font-light normal-case tracking-normal ml-2">(cm)</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-10">
              {measurementFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs uppercase tracking-widest text-fl-subtle mb-3">
                    {label}
                  </label>
                  <input
                    name={key}
                    type="number"
                    min="0"
                    step="0.5"
                    value={(form[key] as number) || ''}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-16">
            <label className="block text-xs uppercase tracking-widest text-fl-subtle mb-3">
              Additional Notes <span className="normal-case tracking-normal text-fl-subtle/60 ml-1">(optional)</span>
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Any special requirements or preferences…"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs uppercase tracking-widest mb-8">{error}</p>
          )}

          <div className="flex items-center gap-8">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving…' : 'Continue to Checkout'}
            </button>
            <span className="text-xs text-fl-subtle font-light">Step 2 of 3</span>
          </div>
        </form>
      </div>
    </div>
  )
}
