import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { caseStudies } from '@/data/caseStudies'
import { projects } from '@/data/projects'

const currentRole = {
  company: 'RTX',
  title: 'Integrated Communications & AI Lead',
  dates: 'Aug 2022 – Present',
  prose: "Currently, I'm focused on blending integrated communications campaigns with AI-powered transformation — leading a 300+ person global communications function to move faster, think smarter, and deliver sharper stories at enterprise scale.",
  wins: [
    '+153% AI adoption in 8 months',
    'Trained 100+ communicators across 7 Centers of Excellence',
    'Led $400K+ integrated enterprise campaigns',
    'Co-lead of bi-weekly AI Labs community of practice',
  ],
}

const pastRoles = [
  {
    company: "Land O'Lakes",
    title: 'Social Media Associate',
    dates: 'Apr 2021 – Jul 2022',
    description: 'Led social strategy and creator partnerships across consumer and agribusiness brands. Spearheaded TikTok rollout, drove 30% YoY inbound growth, and delivered campaigns that set brand organic reach records.',
    color: 'bg-banana/40 border-banana/60 text-near-black',
  },
  {
    company: 'Colle McVoy & Exponent PR',
    title: 'Account Executive',
    dates: 'Jan 2019 – Apr 2021',
    description: 'Managed integrated communications programs for agricultural and consumer brands at a leading Minneapolis agency. Promoted twice. Contributed to $650K in sales tied directly to social efforts.',
    color: 'bg-frozen-lake/30 border-frozen-lake/60 text-cornflower',
  },
]

// Combine case studies and projects into one feed
const allWork = [
  ...caseStudies.map((cs) => ({
    type: 'case-study' as const,
    slug: cs.slug,
    title: cs.title,
    subtitle: cs.subtitle,
    company: cs.company,
    tags: cs.tags,
    href: `/work/${cs.slug}`,
  })),
  ...projects.map((p) => ({
    type: 'project' as const,
    slug: p.slug,
    title: p.name,
    subtitle: p.description,
    company: null,
    tags: p.tags,
    href: p.url,
  })),
]

export default function HomePage() {
  return (
    <main className="bg-off-white">
      <Nav />

      {/* ── HERO ── */}
      <section className="px-6 pt-32 pb-20 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl text-near-black leading-tight mb-7">
          Hey, I&apos;m Mitch.
        </h1>

        {/* Tagline with highlights */}
        <p className="font-sans text-xl md:text-2xl text-near-black/70 leading-relaxed font-light max-w-2xl mb-10">
          A communications strategist leading{' '}
          <span className="relative inline-block font-medium text-near-black">
            <span className="relative z-10">AI-powered transformation</span>
            <span className="absolute bottom-0.5 left-0 right-0 h-3 bg-frozen-lake/50 z-0 rounded-sm" />
          </span>{' '}
          to help global teams tell{' '}
          <span className="border-b-2 border-tangerine pb-0.5 font-medium text-near-black">
            sharper, smarter,
          </span>{' '}
          insight-driven stories.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/work"
            className="font-sans text-sm font-medium bg-near-black text-off-white px-6 py-3 rounded-full hover:bg-near-black/80 transition-colors"
          >
            View my work →
          </Link>
          <Link
            href="/cv"
            className="font-sans text-sm font-medium text-near-black border border-near-black/25 px-6 py-3 rounded-full hover:border-near-black/50 transition-colors"
          >
            Full CV
          </Link>
          <a
            href="/MitchLeonard_Resume_Feb2026.pdf"
            download
            className="font-sans text-sm font-medium text-near-black/60 border border-near-black/15 px-6 py-3 rounded-full hover:border-near-black/30 hover:text-near-black transition-colors"
          >
            Download PDF ↓
          </a>
        </div>
      </section>

      {/* ── CURRENTLY ── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-near-black/10 p-8 md:p-10 shadow-sm">

          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-6">
            <div>
              {/* Label */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">📍</span>
                <span className="font-sans text-xs uppercase tracking-widest text-cornflower font-medium">Currently</span>
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-green animate-pulse" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-near-black leading-snug">{currentRole.title}</h2>
              <p className="font-sans text-sm text-near-black/50 mt-1">{currentRole.company} · {currentRole.dates}</p>
            </div>
            <Link
              href="/cv"
              className="font-sans text-sm font-medium text-near-black/50 hover:text-near-black transition-colors underline underline-offset-4 shrink-0 mt-1"
            >
              Full CV →
            </Link>
          </div>

          {/* Prose */}
          <p className="font-sans text-base text-near-black/70 leading-relaxed mb-8 max-w-2xl">
            {currentRole.prose}
          </p>

          {/* Recent wins */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-near-black/30 mb-4">Recent wins</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {currentRole.wins.map((w) => (
                <li key={w} className="flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 text-sm font-bold text-yellow-green">✓</span>
                  <span className="font-sans text-sm text-near-black/70">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── PAST ROLES ── */}
      <section className="px-6 pb-20 border-t border-near-black/8 pt-16 max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-near-black">Past Experience</h2>
          <Link href="/cv" className="font-sans text-sm font-medium text-near-black/50 hover:text-near-black transition-colors underline underline-offset-4">
            See full experience →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pastRoles.map((role) => (
            <div key={role.company} className="bg-white rounded-xl border border-near-black/10 p-7 hover:shadow-sm hover:border-near-black/20 transition-all">
              <span className={`font-sans text-xs font-medium border px-3 py-1 rounded-full inline-block mb-4 ${role.color}`}>
                {role.company}
              </span>
              <h3 className="font-serif text-xl text-near-black mb-1 leading-snug">{role.title}</h3>
              <p className="font-sans text-xs text-near-black/40 mb-4">{role.dates}</p>
              <p className="font-sans text-sm text-near-black/65 leading-relaxed">{role.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WORK ── */}
      <section className="px-6 pb-24 border-t border-near-black/8 pt-16 max-w-4xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-near-black mb-8">Work &amp; Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allWork.map((item) => {
            const isExternal = item.type === 'project'
            const cardContent = (
              <div className="bg-white rounded-xl border border-near-black/10 p-5 hover:shadow-sm hover:border-near-black/20 transition-all h-full flex flex-col group">
                {/* Type badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-sans text-xs font-medium px-3 py-1 rounded-full ${
                      item.type === 'case-study'
                        ? 'bg-frozen-lake/40 text-cornflower'
                        : 'bg-banana/50 text-near-black/70'
                    }`}
                  >
                    {item.type === 'case-study' ? 'Case Study' : 'Project'}
                  </span>
                  {item.company && (
                    <span className="font-sans text-xs text-near-black/40">{item.company}</span>
                  )}
                </div>

                <h3 className="font-serif text-lg text-near-black leading-snug mb-2 group-hover:text-cornflower transition-colors">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-near-black/55 leading-relaxed mb-4 flex-1">
                  {item.subtitle}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {item.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="font-sans text-xs text-near-black/40 border border-near-black/10 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )

            return isExternal ? (
              <a
                key={item.slug}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {cardContent}
              </a>
            ) : (
              <Link key={item.slug} href={item.href} className="block">
                {cardContent}
              </Link>
            )
          })}
        </div>
      </section>

      <Footer />
    </main>
  )
}
