import { Link } from 'react-router-dom'

const lifestyles = [
  {
    id: 1,
    tag: "Men's Traditional",
    title: 'Agbada & Cap',
    desc: 'Regal ceremonial wear reimagined for the modern man — rich fabric, impeccable drape.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b3681?w=700&h=960&fit=crop&q=80',
  },
  {
    id: 2,
    tag: "Women's Wear",
    title: 'Gown & Corporate',
    desc: 'From flowing evening silhouettes to sharp boardroom elegance — dressed for every occasion.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&h=960&fit=crop&q=80',
  },
  {
    id: 3,
    tag: 'Street Style',
    title: 'Casual Together',
    desc: 'Effortless couple fits — leather jackets, relaxed denim, and the kind of cool you just have.',
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=700&h=960&fit=crop&q=80',
  },
]

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

      {/* ── Lifestyle Section ── */}
      <section className="section bg-fl-base">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-5">
              The Collection
            </p>
            <h2
              className="font-serif font-semibold text-fl-text leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
            >
              Styled for{' '}
              <em className="italic font-light">Every Story</em>
            </h2>
          </div>

          {/* 3-column model grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {lifestyles.map(item => (
              <div key={item.id} className="group flex flex-col">

                {/* Image — tall portrait */}
                <div
                  className="w-full overflow-hidden mb-8"
                  style={{ aspectRatio: '3 / 4' }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>

                {/* Tag */}
                <p className="text-xs font-semibold uppercase tracking-widest text-fl-accent mb-3">
                  {item.tag}
                </p>

                {/* Title */}
                <h3 className="font-serif text-2xl font-semibold text-fl-text mb-3 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-fl-subtle leading-relaxed font-light">
                  {item.desc}
                </p>

              </div>
            ))}
          </div>

          {/* Subtle CTA below grid */}
          <div className="mt-16 pt-12 border-t border-fl-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="font-serif text-xl text-fl-text font-light italic">
              Find your perfect style in our catalogue.
            </p>
            <Link to="/catalogue" className="btn-dark shrink-0">
              View All Designs
            </Link>
          </div>

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
