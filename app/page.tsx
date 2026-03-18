import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { HighlightLink, RandomHoverButton } from '@/components/BrandAccent'
import Link from 'next/link'
import { caseStudies } from '@/data/caseStudies'
import { projects } from '@/data/projects'

const currentRole = {
  company: 'RTX',
  title: 'Integrated Communications & AI Lead',
  dates: 'Dec 2025 – Present',
  prose: "I'm focused on blending integrated communications campaigns with AI-powered transformation — leading a 300+ person global communications function to move faster, think smarter, and deliver sharper stories at enterprise scale.",
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
    title: 'Digital Engagement & Content Operations',
    dates: 'Apr 2021 – Jul 2022',
    description: 'Led social strategy and creator partnerships across consumer and agribusiness brands. Spearheaded TikTok rollout, drove 30% YoY inbound growth, and delivered campaigns that set brand organic reach records.',
    highlight: 'banana' as const,
  },
  {
    company: 'Colle McVoy & Exponent PR',
    title: 'Account Management',
    dates: 'Jan 2019 – Apr 2021',
    description: 'Managed integrated communications programs for agricultural and consumer brands at a leading Minneapolis agency. Promoted twice. Contributed to $650K in sales tied directly to social efforts.',
    highlight: 'frozen-lake' as const,
  },
]

// Highlight stripe (matches CV OrgHighlight logic)
const highlightClass: Record<'banana' | 'frozen-lake', string> = {
  'banana':      'bg-banana/65',
  'frozen-lake': 'bg-frozen-lake/55',
}

// Ordered, published-only work feed
const WORK_ORDER = [
  'ai-at-rtx',
  'daily',
  'pebble-path',
  'farnborough',
  'astro-jump',
  'lawnual-report',
  'eat-it-like-you-own-it',
  'baking-day',
]

const csBySlug = Object.fromEntries(
  caseStudies.filter((cs) => cs.published !== false).map((cs) => [cs.slug, cs])
)
const projBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]))

type WorkItem = {
  type: 'case-study' | 'project'
  slug: string
  title: string
  subtitle: string
  company: string | null
  tags: string[]
  href: string
}

const allWork: WorkItem[] = WORK_ORDER.flatMap((slug): WorkItem[] => {
  if (csBySlug[slug]) {
    const cs = csBySlug[slug]
    return [{ type: 'case-study', slug: cs.slug, title: cs.title, subtitle: cs.subtitle, company: cs.company, tags: cs.tags, href: `/work/${cs.slug}` }]
  }
  if (projBySlug[slug]) {
    const p = projBySlug[slug]
    return [{ type: 'project', slug: p.slug, title: p.name, subtitle: p.description, company: null, tags: p.tags, href: p.url }]
  }
  return []
})

export default function HomePage() {
  return (
    <main className="bg-off-white">
      <Nav />

      {/* ── HERO ── */}
      <section className="px-6 pt-32 pb-20 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl text-near-black leading-tight mb-7">
          Hey, I&apos;m Mitch!
        </h1>

        <p className="font-sans text-xl md:text-2xl text-near-black/70 leading-relaxed font-light mb-10">
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

        <div className="flex flex-wrap gap-3">
          <RandomHoverButton
            href="/#work"
            className="font-sans text-sm font-medium bg-near-black text-off-white px-6 py-3 rounded-full border border-near-black transition-colors"
          >
            View my work →
          </RandomHoverButton>
        </div>
      </section>

      {/* ── CURRENTLY ── */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border border-near-black/8 p-6 hover:border-near-black/15 transition-colors">

          {/* Label row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">📍</span>
              <span className="font-sans text-xs uppercase tracking-widest text-near-black/40 font-medium">Currently</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-green animate-pulse" />
            </div>
            <HighlightLink href="/cv">Full CV →</HighlightLink>
          </div>

          {/* Title + company + date — same structure as CV RoleCard */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-sans text-lg font-semibold text-near-black mb-1.5">{currentRole.title}</h2>
              <span className="font-sans text-sm font-normal text-near-black relative inline-block">
                <span className="relative z-10">{currentRole.company}</span>
                <span className="absolute bottom-0 left-0 right-0 h-2.5 bg-banana/65 z-0 rounded-sm" />
              </span>
            </div>
            <span className="font-sans text-xs text-near-black/40 bg-near-black/5 px-3 py-1 rounded-full shrink-0">{currentRole.dates}</span>
          </div>

          {/* Prose */}
          <p className="font-sans text-sm text-near-black/65 leading-relaxed mb-6">
            {currentRole.prose}
          </p>

          {/* Recent wins */}
          <div>
            <p className="font-sans text-xs uppercase tracking-widest text-near-black/30 mb-3">Recent wins</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {currentRole.wins.map((w) => (
                <li key={w} className="flex items-start gap-3">
                  <span className="shrink-0 w-1 h-1 rounded-full bg-tangerine mt-2 block" />
                  <span className="font-sans text-sm text-near-black/65">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── PAST ROLES ── */}
      <section id="experience" className="px-6 pb-20 border-t border-near-black/8 pt-16 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-near-black">Past Experience</h2>
          <HighlightLink href="/cv">See full experience →</HighlightLink>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pastRoles.map((role) => (
            <div key={role.company} className="bg-white rounded-xl border border-near-black/8 p-6 hover:border-near-black/15 transition-colors">
              <h3 className="font-sans text-lg font-semibold text-near-black mb-1.5">{role.title}</h3>
              <span className="font-sans text-sm font-normal text-near-black relative inline-block mb-3">
                <span className="relative z-10">{role.company}</span>
                <span className={`absolute bottom-0 left-0 right-0 h-2.5 z-0 rounded-sm ${highlightClass[role.highlight]}`} />
              </span>
              <p className="font-sans text-xs text-near-black/40 mb-4">{role.dates}</p>
              <p className="font-sans text-sm text-near-black/65 leading-relaxed">{role.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WORK ── */}
      <section id="work" className="px-6 pb-24 border-t border-near-black/8 pt-16 max-w-4xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-near-black mb-8">Work &amp; Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allWork.map((item) => {
            const isExternal = item.type === 'project'
            const cardContent = (
              <div className="bg-white rounded-xl border border-near-black/8 p-5 hover:border-near-black/20 transition-all h-full flex flex-col group">
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-sans text-xs font-medium px-3 py-1 rounded-full ${
                    item.type === 'case-study'
                      ? 'bg-frozen-lake/40 text-cornflower'
                      : 'bg-banana/50 text-near-black/70'
                  }`}>
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
              <a key={item.slug} href={item.href} target="_blank" rel="noopener noreferrer" className="block">
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
      <ScrollToTop />
    </main>
  )
}
