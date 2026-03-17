import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// V4 — V1 + V2 blend with new brand palette
// Split hero (V1 structure) + statement text with highlights (V2 weight) + new colors

export default function AboutV4() {
  return (
    <main className="bg-off-white">
      <Nav />

      {/* ── HERO — split layout (V1) with V2-level headline weight ── */}
      <section className="pt-28 pb-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-cornflower mb-6">About</p>
            <h1 className="font-serif text-5xl md:text-7xl text-near-black leading-[1.05] mb-6">
              Curious<br />about me?
            </h1>
            <p className="font-sans text-xl md:text-2xl leading-relaxed" style={{ color: '#444' }}>
              I&apos;m a strategist, communicator, builder, and{' '}
              <span className="italic" style={{ color: '#f56e3d' }}>ice cream aficionado.</span>
            </p>
          </div>

          {/* Right — hero photo */}
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch-RaganHeadshot.jpg"
              alt="Mitch Leonard"
              className="w-full rounded-sm object-cover object-top max-h-80 md:max-h-none"
            />
          </div>
        </div>
      </section>

      {/* ── STORY — V2 big body text with phrase highlights ── */}
      <section className="py-12 px-6 border-t border-near-black/8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* Sticky label column */}
          <div className="md:col-span-3">
            <p className="font-sans text-xs uppercase tracking-widest text-near-black/30 md:sticky md:top-32">
              The story
            </p>
          </div>

          {/* Text column */}
          <div className="md:col-span-8 space-y-8">
            <p className="font-serif text-2xl md:text-3xl text-near-black leading-relaxed">
              Since I was a kid, I&apos;ve loved{' '}
              <span className="relative inline-block">
                <span className="relative z-10">telling stories.</span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-banana/60 z-0 rounded-sm" />
              </span>{' '}
              Stories from the playground, stories on-stage, and now, stories about brands who are making a difference in the world.
            </p>

            <p className="font-sans text-lg md:text-xl text-near-black/75 leading-relaxed">
              With over a decade of experience leading social media and integrated campaigns, I turn{' '}
              <span className="border-b-2 border-tangerine pb-0.5 font-medium text-near-black">complexity into clarity</span>{' '}
              and ideas into action. Currently, I lead AI-powered marketing transformation at the world&apos;s largest aerospace and defense company, driving GenAI innovation for content creation and cross-functional campaign management to increase digital performance and improve operational efficiency across global teams.
            </p>

            <p className="font-sans text-lg md:text-xl text-near-black/75 leading-relaxed">
              I thrive in fast-moving environments where{' '}
              <span className="bg-frozen-lake/40 px-1.5 py-0.5 rounded text-near-black font-medium">strategy meets creativity.</span>{' '}
              At the end of the day, I&apos;m looking to empower teams to move quickly, think boldly, and deliver work that makes a measurable impact.
            </p>
          </div>
        </div>
      </section>

      {/* ── OFF THE CLOCK — V1 chips + photo grid ── */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* Left: text + chips */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-near-black/30 mb-6">Off the clock</p>
            <p className="font-sans text-lg md:text-xl text-near-black/75 leading-relaxed mb-10">
              When I&apos;m not heads deep in my work, you can find me adding ratings to my list of more than{' '}
              <span className="font-medium text-near-black">145 ice cream delicacies</span>, running around the Twin Cities, or putting together a puzzle or LEGO model.
            </p>

            {/* Chips — banana background with colored emoji highlight */}
            <div className="flex flex-wrap gap-3">
              {[
                { emoji: '🍦', label: '145+ ice creams rated', color: 'bg-banana/50 border-banana' },
                { emoji: '🏃', label: 'Twin Cities runner', color: 'bg-yellow-green/20 border-yellow-green/40' },
                { emoji: '🧩', label: 'Puzzle builder', color: 'bg-frozen-lake/30 border-frozen-lake/60' },
                { emoji: '🧱', label: 'LEGO collector', color: 'bg-tangerine/15 border-tangerine/40' },
                { emoji: '✈️', label: 'Aerospace nerd', color: 'bg-cornflower/10 border-cornflower/30' },
                { emoji: '📍', label: 'Minneapolis, MN', color: 'bg-near-black/6 border-near-black/15' },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className={`font-sans text-sm text-near-black border px-4 py-2 rounded-full inline-flex items-center gap-2 ${chip.color}`}
                >
                  <span>{chip.emoji}</span>
                  <span>{chip.label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right: staggered photo grid — natural ratios, no crop */}
          <div className="grid grid-cols-2 gap-4 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch-BallPit.JPG"
              alt="Mitch in a ball pit"
              className="w-full rounded-sm"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch-Helicopter.JPG"
              alt="Mitch in a helicopter"
              className="w-full rounded-sm mt-10"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch-Magnolia.jpg"
              alt="Mitch at Magnolia"
              className="w-full rounded-sm"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/photos-mitch/Mitch.Leonard.jpeg"
              alt="Mitch Leonard"
              className="w-full rounded-sm mt-10"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
