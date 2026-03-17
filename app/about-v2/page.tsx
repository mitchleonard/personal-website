'use client'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

// V2 — "Statement" (Aaron James inspired)
// Body text is king — bigger than labels. Key phrases highlighted in accent.
// Full-width photo breaks. Text feels weighted and important.

export default function AboutV2() {
  return (
    <main className="bg-off-white">
      <Nav />

      {/* Headline — full bleed, bold */}
      <section className="pt-28 pb-16 px-6 border-b border-near-black/10">
        <div className="max-w-4xl mx-auto">
          <p className="font-sans text-xs uppercase tracking-widest text-near-black/40 mb-8">About</p>
          <h1 className="font-serif text-6xl md:text-8xl text-near-black leading-[1.0] mb-8">
            Curious<br />about me?
          </h1>
          <p className="font-sans text-2xl md:text-3xl text-near-black/50 leading-relaxed max-w-2xl">
            I&apos;m a strategist, communicator, builder, and{' '}
            <span className="text-accent italic">ice cream aficionado.</span>
          </p>
        </div>
      </section>

      {/* Full-width photo */}
      <div className="w-full overflow-hidden" style={{ maxHeight: '500px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos-mitch/Mitch-RaganHeadshot.jpg"
          alt="Mitch Leonard"
          className="w-full object-cover object-center"
          style={{ height: '500px' }}
        />
      </div>

      {/* First paragraph — BIG text */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="font-sans text-xs uppercase tracking-widest text-near-black/30 mb-8">Origin story</p>
          <p className="font-serif text-2xl md:text-3xl text-near-black leading-relaxed">
            Since I was a kid, I&apos;ve loved{' '}
            <span className="text-accent">telling stories.</span>{' '}
            Stories from the playground, stories on-stage, and now, stories about brands who are making a difference in the world.
          </p>
        </div>
      </section>

      {/* Second paragraph — body size, side photo */}
      <section className="py-8 px-6 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <p className="font-sans text-xs uppercase tracking-widest text-near-black/30 mb-8">What I do</p>
            <p className="font-sans text-xl text-near-black/80 leading-relaxed">
              With over a decade of experience leading social media and integrated campaigns, I turn{' '}
              <span className="border-b-2 border-accent pb-0.5">complexity into clarity</span>{' '}
              and ideas into action.
            </p>
            <p className="font-sans text-xl text-near-black/80 leading-relaxed">
              Currently, I lead AI-powered marketing transformation at the world&apos;s largest aerospace and defense company, driving GenAI innovation for content creation and cross-functional campaign management to increase digital performance and improve operational efficiency across global teams.
            </p>
            <p className="font-sans text-xl text-near-black/80 leading-relaxed">
              I thrive in fast-moving environments where{' '}
              <span className="bg-accent/15 px-1 rounded">strategy meets creativity.</span>{' '}
              At the end of the day, I&apos;m looking to empower teams to move quickly, think boldly, and deliver work that makes a measurable impact.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/photos-mitch/Mitch-Magnolia.jpg"
            alt="Mitch at Magnolia"
            className="w-full object-cover rounded-sm"
            style={{ height: '460px', objectPosition: 'top' }}
          />
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-near-black py-14 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '10+', label: 'Years of experience' },
            { value: '145+', label: 'Ice creams rated' },
            { value: '6', label: 'Major campaigns led' },
            { value: '100+', label: 'Communicators trained' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-4xl md:text-5xl text-off-white mb-2">{stat.value}</p>
              <p className="font-sans text-xs uppercase tracking-widest text-off-white/40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Off-duty */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-near-black/30 mb-8">Off the clock</p>
            <p className="font-sans text-xl text-near-black/80 leading-relaxed">
              When I&apos;m not heads deep in my work, you can find me adding ratings to my list of more than{' '}
              <span className="font-medium text-near-black">145 ice cream delicacies</span>, running around the Twin Cities, or putting together a puzzle or LEGO model.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos-mitch/Mitch-BallPit.JPG" alt="" className="w-full aspect-square object-cover rounded-sm" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/photos-mitch/Mitch-Helicopter.JPG" alt="" className="w-full aspect-square object-cover rounded-sm mt-6" />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
