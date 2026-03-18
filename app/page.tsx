import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { caseStudies } from '@/data/caseStudies'
import { projects } from '@/data/projects'

const currentRole = {
  company: 'RTX',
  title: 'Integrated Communications & AI Lead',
  dates: 'Aug 2022 – Present',
  blurb: 'Leading AI-powered transformation for a 300+ person global communications function — from adoption strategy to enterprise-scale training, governance, and tool deployment.',
  bullets: [
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
  },
  {
    company: 'Colle McVoy & Exponent PR',
    title: 'Account Executive',
    dates: 'Jan 2019 – Apr 2021',
    description: 'Managed integrated communications programs for agricultural and consumer brands at a leading Minneapolis agency. Promoted twice. Contributed to $650K in sales tied directly to social efforts.',
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
    <main>
      <Nav />

      {/* Hero — compact */}
      <section className="px-6 pt-32 pb-16 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl text-near-black leading-tight mb-5">
          Hey, I&apos;m Mitch.
        </h1>
        <p className="font-sans text-xl md:text-2xl text-near-black/60 leading-relaxed font-light max-w-2xl">
          Communications strategist helping global teams tell sharper, smarter, insight-driven stories — powered by AI.
        </p>
      </section>

      {/* Currently */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <div className="border border-near-black/15 p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-6">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-accent mb-2">Currently</p>
              <h2 className="font-serif text-2xl md:text-3xl text-near-black leading-snug">{currentRole.title}</h2>
              <p className="font-sans text-sm text-near-black/50 mt-1">{currentRole.company} · {currentRole.dates}</p>
            </div>
            <Link
              href="/cv"
              className="font-sans text-sm font-medium text-near-black/60 hover:text-near-black transition-colors underline underline-offset-4 shrink-0 mt-1"
            >
              Full CV →
            </Link>
          </div>
          <p className="font-sans text-base text-near-black/70 leading-relaxed mb-6 max-w-2xl">
            {currentRole.blurb}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {currentRole.bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <span className="text-yellow-green font-bold mt-0.5 shrink-0">–</span>
                <span className="font-sans text-sm text-near-black/70">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Past Roles */}
      <section className="px-6 pb-20 border-t border-near-black/10 pt-16 max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-near-black">Past Experience</h2>
          <Link href="/cv" className="font-sans text-sm font-medium text-near-black/50 hover:text-near-black transition-colors underline underline-offset-4">
            See full experience →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pastRoles.map((role) => (
            <div key={role.company} className="border border-near-black/15 p-7 hover:border-near-black/30 transition-colors">
              <p className="font-sans text-xs uppercase tracking-widest text-accent mb-3">{role.company}</p>
              <h3 className="font-serif text-xl text-near-black mb-1 leading-snug">{role.title}</h3>
              <p className="font-sans text-xs text-near-black/40 mb-4">{role.dates}</p>
              <p className="font-sans text-sm text-near-black/65 leading-relaxed">{role.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Work — case studies + projects combined */}
      <section className="px-6 pb-24 border-t border-near-black/10 pt-16 max-w-4xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl text-near-black mb-8">Work &amp; Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allWork.map((item) => {
            const isExternal = item.type === 'project'
            const cardContent = (
              <div className="border border-near-black/15 p-5 hover:border-near-black/30 transition-colors h-full flex flex-col group">
                {/* Type badge */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-sans text-xs uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                      item.type === 'case-study'
                        ? 'bg-frozen-lake/30 text-cornflower'
                        : 'bg-banana/40 text-near-black/70'
                    }`}
                  >
                    {item.type === 'case-study' ? 'Case Study' : 'Project'}
                  </span>
                  {item.company && (
                    <span className="font-sans text-xs text-near-black/40">{item.company}</span>
                  )}
                </div>

                <h3 className="font-serif text-lg text-near-black leading-snug mb-2 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-near-black/55 leading-relaxed mb-4 flex-1">
                  {item.subtitle}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {item.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="font-sans text-xs text-near-black/40 border border-near-black/10 px-1.5 py-0.5 rounded-sm">
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
