import Link from 'next/link'
import Footer from '@/components/Footer'

const featuredWork = [
  {
    slug: 'ai-at-rtx',
    company: 'RTX',
    title: 'Building the AI Operating Model for Global Communications',
    subtitle: 'Turned early experimentation into a structured adoption model for a global communications function.',
    results: ['+153% AI adoption', '100+ trained', '+80% working group growth'],
    tags: ['AI Enablement', 'Change Leadership', 'Enterprise Strategy'],
  },
  {
    slug: 'eat-it-like-you-own-it',
    company: "Land O'Lakes",
    title: 'Eat It Like You Own It',
    subtitle: 'Gave people permission to indulge, knowing every bite supports farmer-owners.',
    results: ['+3.9% sales lift', '+26% purchase intent', '+4% farmer-ownership association'],
    tags: ['Brand Campaign', 'Social Strategy', 'Paid & Organic'],
  },
  {
    slug: 'farnborough',
    company: 'RTX',
    title: 'Farnborough Airshow',
    subtitle: "Brought the RTX brand to life on aerospace's biggest global stage.",
    results: ['9.8M impressions', '723K engagements', '18% site traffic from social'],
    tags: ['Integrated Campaign', 'Event Marketing', 'Social Strategy'],
  },
]

const skills = [
  'AI Enablement & Adoption Strategy',
  'Integrated Communications Strategy',
  'Brand Campaign Development',
  'Social Media Strategy (Paid & Organic)',
  'Executive Communications',
  'Content Strategy & Editorial Systems',
  'Cross-Functional Program Leadership',
  'Change Management',
]

const personalProjects = [
  {
    name: 'Daily',
    description: 'A full-stack habit tracking app with auth and a database backend — built because existing apps were too bloated.',
    tags: ['Full Stack', 'Product Design', 'Firebase'],
    url: 'https://daily.mitchleonard.com',
  },
  {
    name: 'Pebble Path',
    description: 'A lightweight health tracker with a mobile-first interface — no calorie obsession, just sustainable habits.',
    tags: ['Mobile-First', 'Health Tech', 'UX'],
    url: 'https://pebble-path-app.web.app',
  },
]

export const metadata = {
  title: 'Hire Mitch Leonard — Communications & AI Strategy',
  description: 'Mitch Leonard is a communications strategist and AI adoption leader based in Minneapolis. Currently open to new opportunities.',
}

export default function HirePage() {
  return (
    <main className="bg-[#f7f5f2] text-[#1a0533] min-h-screen">
      {/* Nav */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="font-serif text-xl text-[#1a0533] hover:text-[#6001d2] transition-colors">
          Mitch Leonard
        </Link>
        <Link
          href="/contact"
          className="font-sans text-sm uppercase tracking-widest px-5 py-2.5 bg-[#6001d2] text-white hover:bg-[#4a00a8] transition-colors rounded-sm"
        >
          Get in touch
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-20">
        <div className="inline-flex items-center gap-2 bg-[#6001d2]/10 border border-[#6001d2]/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#6001d2] animate-pulse" />
          <span className="font-sans text-xs text-[#6001d2] tracking-wider uppercase">Open to new opportunities</span>
        </div>
        <h1 className="font-serif text-5xl md:text-7xl text-[#1a0533] leading-tight mb-6">
          The communicator who makes AI work for your team.
        </h1>
        <p className="font-sans text-xl md:text-2xl text-[#1a0533]/60 leading-relaxed max-w-2xl mb-10">
          I&apos;m Mitch Leonard — a communications strategist and AI adoption leader based in Minneapolis. I build the operating models, programs, and campaigns that help modern organizations show up smarter.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="font-sans text-sm uppercase tracking-widest px-7 py-4 bg-[#6001d2] text-white hover:bg-[#4a00a8] transition-colors rounded-sm"
          >
            Let&apos;s talk
          </Link>
          <Link
            href="/cv"
            className="font-sans text-sm uppercase tracking-widest px-7 py-4 border border-[#1a0533]/20 hover:border-[#6001d2] hover:text-[#6001d2] transition-colors rounded-sm"
          >
            View full CV
          </Link>
        </div>
      </section>

      {/* What I bring */}
      <section className="bg-[#1a0533] text-[#f7f5f2] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-sans text-xs uppercase tracking-widest text-[#f7f5f2]/40 mb-6">What I bring</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#f7f5f2] mb-12 leading-snug max-w-2xl">
            Communications strategy meets AI — with the proof of work to back it up.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#6001d2]" />
                <span className="font-sans text-base text-[#f7f5f2]/80">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured work */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <p className="font-sans text-xs uppercase tracking-widest text-[#1a0533]/40 mb-6">Selected work</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#1a0533] mb-12">
          Campaigns and programs with real results.
        </h2>
        <div className="space-y-8">
          {featuredWork.map((cs) => (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className="group block border border-[#1a0533]/10 hover:border-[#6001d2]/40 rounded-lg p-6 md:p-8 transition-colors"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="font-sans text-xs uppercase tracking-widest text-[#6001d2]">{cs.company}</span>
                {cs.tags.map((tag) => (
                  <span key={tag} className="font-sans text-xs text-[#1a0533]/40 border border-[#1a0533]/15 px-2 py-0.5 rounded-sm">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#1a0533] group-hover:text-[#6001d2] transition-colors leading-snug mb-2">
                {cs.title}
              </h3>
              <p className="font-sans text-base text-[#1a0533]/60 mb-5">{cs.subtitle}</p>
              <div className="flex flex-wrap gap-4">
                {cs.results.map((r) => (
                  <span key={r} className="font-sans text-sm font-medium text-[#6001d2] bg-[#6001d2]/8 px-3 py-1 rounded-full">
                    {r}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/#work"
            className="font-sans text-sm text-[#1a0533]/50 hover:text-[#6001d2] transition-colors"
          >
            See all case studies →
          </Link>
        </div>
      </section>

      {/* Personal projects — proof of initiative */}
      <section className="bg-[#1a0533]/5 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-sans text-xs uppercase tracking-widest text-[#1a0533]/40 mb-3">Personal projects</p>
          <h2 className="font-serif text-3xl md:text-4xl text-[#1a0533] mb-3 leading-snug">
            I don&apos;t just talk about building — I build.
          </h2>
          <p className="font-sans text-base text-[#1a0533]/60 mb-10 max-w-xl">
            In my own time, I ship full-stack products from scratch. It&apos;s how I stay sharp, develop product intuition, and understand what I&apos;m asking engineering teams to do — and it&apos;s exactly the kind of initiative I&apos;d bring to your team.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {personalProjects.map((p) => (
              <a
                key={p.name}
                href={p.url}
                className="group block bg-white border border-[#1a0533]/10 hover:border-[#6001d2]/40 rounded-lg p-6 transition-colors"
              >
                <h3 className="font-serif text-xl text-[#1a0533] group-hover:text-[#6001d2] transition-colors mb-2">
                  {p.name} ↗
                </h3>
                <p className="font-sans text-sm text-[#1a0533]/60 mb-4 leading-relaxed">{p.description}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="font-sans text-xs text-[#1a0533]/40 border border-[#1a0533]/15 px-2 py-0.5 rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/projects" className="font-sans text-sm text-[#1a0533]/50 hover:text-[#6001d2] transition-colors">
              See all personal projects →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#6001d2] py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-5">
            Ready to talk?
          </h2>
          <p className="font-sans text-lg text-white/70 mb-10">
            I&apos;m currently exploring leadership opportunities in communications, AI strategy, and brand. Let&apos;s find out if we&apos;re the right fit.
          </p>
          <Link
            href="/contact"
            className="inline-block font-sans text-sm uppercase tracking-widest px-8 py-4 bg-white text-[#6001d2] hover:bg-white/90 transition-colors rounded-sm"
          >
            Send me a message
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
