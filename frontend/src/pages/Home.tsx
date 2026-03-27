import { Link } from 'react-router-dom'

const steps = [
  { step: '01', title: 'Browse Catalogue', desc: 'Explore our curated collection of designs and pick your style.' },
  { step: '02', title: 'Submit Measurements', desc: 'Enter your exact body measurements for a flawless fit.' },
  { step: '03', title: 'Place & Pay', desc: 'Complete your order securely and we begin crafting immediately.' },
  { step: '04', title: 'Track in Real Time', desc: 'Follow every stage from production to your doorstep.' },
]

export default function Home() {
  return (
    <div className="bg-fl-base">
      {/* ── Full-bleed Hero ── */}
      <section
        className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ backgroundColor: '#F5F0EB', paddingTop: '80px' }}
      >
        {/* Content — vertically centred, cleared below navbar */}
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-fl-accent text-xs font-semibold uppercase tracking-widest mb-6">
              Bespoke &nbsp;·&nbsp; Tailored &nbsp;·&nbsp; Yours
            </p>
            <h1
              className="font-serif font-semibold leading-tight mb-6"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: '#2C2420' }}
            >
              Fashion{' '}
              <em className="italic font-light">Crafted</em>{' '}
              for You
            </h1>
            <p className="text-fl-subtle text-sm leading-relaxed max-w-sm mx-auto mb-10 font-light tracking-wide">
              Browse exclusive designs, submit your measurements, and receive
              custom-made clothing delivered right to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalogue" className="btn-primary">
                Browse Catalogue
              </Link>
              <Link
                to="/track"
                className="text-xs font-semibold uppercase tracking-widest text-fl-subtle transition-colors duration-300 flex items-center justify-center gap-2 px-8 py-4"
              >
                Track My Order <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll cue — pinned to bottom */}
        <div className="pb-10 flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest font-light text-fl-subtle">Scroll</span>
          <div className="w-px h-10" style={{ background: 'linear-gradient(to bottom, #8A7E74, transparent)' }} />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="section bg-fl-base">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-4">
              The Process
            </p>
            <h2 className="font-serif text-5xl md:text-6xl font-semibold text-fl-text">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-fl-muted">
            {steps.map(s => (
              <div key={s.step} className="bg-fl-base p-10 flex flex-col gap-6">
                <span className="font-serif text-5xl font-light text-fl-muted leading-none">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-serif text-xl font-semibold text-fl-text mb-3">
                    {s.title}
                  </h3>
                  <p className="text-sm text-fl-subtle leading-relaxed font-light">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Divider quote ── */}
      <section className="bg-fl-muted py-24 px-6 text-center">
        <blockquote className="font-serif text-3xl md:text-5xl font-light italic text-fl-text max-w-3xl mx-auto leading-snug">
          "Clothing is a form of self-expression —<br />
          <span className="font-semibold not-italic">wear it like it was made for you."</span>
        </blockquote>
      </section>

      {/* ── CTA ── */}
      <section className="section bg-fl-base text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-6">
            Ready to Begin?
          </p>
          <h2 className="font-serif text-5xl md:text-6xl font-semibold text-fl-text mb-8 leading-tight">
            Wear Something<br />Truly Yours
          </h2>
          <p className="text-sm text-fl-subtle mb-12 leading-relaxed font-light">
            Start with our catalogue and build your perfect outfit today.
          </p>
          <Link to="/catalogue" className="btn-dark">
            Shop the Collection
          </Link>
        </div>
      </section>
    </div>
  )
}
