import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// V3 — "Structured Modern" (fiordaliso.io inspired)
// Interest chips at top, clean two-column layout, stat callouts, photo collage feel

export default function AboutV3() {
  const interests = [
    { emoji: '🍦', label: '145+ ice creams rated' },
    { emoji: '🏃', label: 'Twin Cities runner' },
    { emoji: '🧩', label: 'Puzzle builder' },
    { emoji: '🧱', label: 'LEGO collector' },
    { emoji: '✈️', label: 'Aerospace nerd' },
    { emoji: '📍', label: 'Minneapolis, MN' },
  ]

  return (
    <main className="bg-off-white">
      <Nav />

      {/* Header row */}
      <section className="pt-28 pb-12 px-6 border-b border-near-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-near-black/40 mb-3">About</p>
              <h1 className="font-serif text-5xl md:text-6xl text-near-black leading-tight">
                Curious about me?
              </h1>
            </div>
            <p className="font-sans text-lg text-near-black/50 italic max-w-xs md:text-right leading-relaxed">
              Strategist. Communicator. Builder.<br />Ice cream aficionado.
            </p>
          </div>

          {/* Interest chips */}
          <div className="flex flex-wrap gap-2">
            {interests.map((i) => (
              <span
                key={i.label}
                className="font-sans text-sm text-near-black bg-near-black/6 px-4 py-2 rounded-full inline-flex items-center gap-2"
              >
                <span>{i.emoji}</span>
                <span>{i.label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main content — two column */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">

          {/* Left column: photo stack */}
          <div className="md:col-span-4 space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch-RaganHeadshot.jpg"
              alt="Mitch Leonard"
              className="w-full object-cover object-top rounded-sm"
              style={{ height: '380px' }}
            />
            <div className="grid grid-cols-2 gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos-mitch/Mitch-BallPit.JPG" alt="" className="w-full aspect-square object-cover rounded-sm" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/photos-mitch/Mitch-Helicopter.JPG" alt="" className="w-full aspect-square object-cover rounded-sm" />
            </div>
          </div>

          {/* Right column: bio + callouts */}
          <div className="md:col-span-8 space-y-10">

            {/* Callout stat row */}
            <div className="grid grid-cols-3 gap-6 pb-10 border-b border-near-black/10">
              {[
                { value: '10+', label: 'Years leading strategy' },
                { value: '145+', label: 'Ice creams rated' },
                { value: '100+', label: 'Communicators trained' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-4xl text-near-black mb-1">{s.value}</p>
                  <p className="font-sans text-xs text-near-black/40 uppercase tracking-widest leading-snug">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Bio sections */}
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-near-black/30 mb-4">Origin</p>
              <p className="font-sans text-lg text-near-black/80 leading-relaxed">
                Since I was a kid, I&apos;ve loved telling stories. Stories from the playground, stories on-stage, and now, stories about brands who are making a difference in the world.
              </p>
            </div>

            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-near-black/30 mb-4">What I do</p>
              <p className="font-sans text-lg text-near-black/80 leading-relaxed mb-4">
                With over a decade of experience leading social media and integrated campaigns, I turn complexity into clarity and ideas into action. Currently, I lead AI-powered marketing transformation at the world&apos;s largest aerospace and defense company.
              </p>
              <p className="font-sans text-lg text-near-black/80 leading-relaxed">
                I thrive in fast-moving environments where strategy meets creativity — empowering teams to move quickly, think boldly, and deliver work that makes a measurable impact.
              </p>
            </div>

            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-near-black/30 mb-4">Off the clock</p>
              <p className="font-sans text-lg text-near-black/80 leading-relaxed">
                When I&apos;m not heads deep in my work, you can find me adding ratings to my list of more than 145 ice cream delicacies, running around the Twin Cities, or putting together a puzzle or LEGO model.
              </p>
            </div>

            {/* Bottom photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch-Magnolia.jpg"
              alt="Mitch at Magnolia"
              className="w-full object-cover rounded-sm"
              style={{ height: '300px', objectPosition: 'top' }}
            />
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
