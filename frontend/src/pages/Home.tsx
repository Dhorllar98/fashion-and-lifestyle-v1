import { Link } from 'react-router-dom'

const steps = [
  { step: '01', title: 'Browse Catalogue', desc: 'Explore our curated collection of designs and pick your style.' },
  { step: '02', title: 'Submit Measurements', desc: 'Enter your exact measurements for a perfect, tailored fit.' },
  { step: '03', title: 'Place & Pay', desc: 'Complete your order securely and we get straight to work.' },
  { step: '04', title: 'Track in Real Time', desc: 'Follow your order from production to your doorstep.' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 text-white py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-200 text-sm font-medium uppercase tracking-widest mb-4">
            Bespoke. Tailored. Yours.
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Fashion Crafted<br />Just for You
          </h1>
          <p className="text-brand-100 text-lg max-w-xl mx-auto mb-10">
            Browse exclusive designs, submit your measurements, and receive
            custom-made clothing delivered right to your door.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalogue" className="bg-white text-brand-700 hover:bg-brand-50 font-semibold px-8 py-4 rounded-lg transition-colors">
              Browse Catalogue
            </Link>
            <Link to="/track" className="border border-white text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-lg transition-colors">
              Track My Order
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-stone-800 mb-2">How It Works</h2>
          <p className="text-center text-stone-500 mb-12">From browsing to delivery in four simple steps.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map(s => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{s.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-stone-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-800 mb-4">Ready to wear something truly yours?</h2>
          <p className="text-stone-600 mb-8">Start with our catalogue and build your perfect outfit today.</p>
          <Link to="/catalogue" className="btn-primary inline-block">
            Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  )
}
