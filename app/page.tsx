import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'
import { caseStudies } from '@/data/caseStudies'
import { projects } from '@/data/projects'

const roles = [
  {
    company: 'RTX',
    title: 'Integrated Communications & AI Lead',
    dates: 'Aug 2022 – Present',
    description: 'Leading AI-powered transformation across global communications, from adoption strategy to enterprise-scale training and tool deployment.',
  },
  {
    company: 'Land O\'Lakes',
    title: 'Social Media Associate',
    dates: 'Apr 2021 – Jul 2022',
    description: 'Led social strategy and creator partnerships across consumer and agribusiness brands, including campaigns that set brand organic reach records.',
  },
  {
    company: 'Colle McVoy & Exponent PR',
    title: 'Account Executive',
    dates: 'Jan 2019 – Apr 2021',
    description: 'Managed integrated communications programs for agricultural and consumer brands at a leading Minneapolis agency.',
  },
  {
    company: 'University of Northern Iowa',
    title: 'Student Website Designer',
    dates: 'May 2015 – Dec 2018',
    description: 'Designed and maintained department websites for UNI administrative and academic units.',
  },
]

const awards = [
  '32 Under 32 — AdFed, 2025',
  'MN PRSA Classics — 2020',
  'Eagle Scout',
]

const featuredWork = caseStudies.filter(cs =>
  ['ai-at-rtx', 'farnborough', 'eat-it-like-you-own-it', 'lawnual-report', 'rtx-rebrand', 'global-aerospace-summit'].includes(cs.slug)
)

export default function HomePage() {
  return (
    <main>
      <Nav />

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-near-black leading-tight mb-8">
            Hey, it&apos;s Mitch!
          </h1>
          <p className="font-sans text-xl md:text-2xl text-near-black/70 leading-relaxed font-light max-w-2xl">
            I&apos;m a communications strategist leading AI-powered transformation to help global teams tell sharper, smarter, insight-driven stories.
          </p>
        </div>
      </section>

      {/* Role Cards / Experience Strip */}
      <section className="px-6 py-20 border-t border-near-black/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-serif text-3xl md:text-4xl text-near-black">Experience</h2>
            <Link href="/cv" className="font-sans text-sm font-medium text-near-black/60 hover:text-near-black transition-colors underline underline-offset-4">
              Full CV →
            </Link>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="flex gap-5 overflow-x-auto pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
            {roles.map((role, i) => (
              <div key={i} className="snap-start shrink-0 w-72 border border-near-black/15 p-6 bg-off-white">
                <p className="font-sans text-xs uppercase tracking-widest text-accent mb-3">{role.company}</p>
                <h3 className="font-serif text-lg text-near-black mb-1 leading-snug">{role.title}</h3>
                <p className="font-sans text-xs text-near-black/50 mb-4">{role.dates}</p>
                <p className="font-sans text-sm text-near-black/70 leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>

          {/* Desktop: 2-column grid */}
          <div className="hidden md:grid grid-cols-2 gap-5">
            {roles.map((role, i) => (
              <div key={i} className="border border-near-black/15 p-8 hover:border-near-black/30 transition-colors">
                <p className="font-sans text-xs uppercase tracking-widest text-accent mb-3">{role.company}</p>
                <h3 className="font-serif text-xl text-near-black mb-1">{role.title}</h3>
                <p className="font-sans text-xs text-near-black/50 mb-4">{role.dates}</p>
                <p className="font-sans text-sm text-near-black/70 leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Work */}
      <section id="work" className="px-6 py-20 border-t border-near-black/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-near-black mb-12">Selected Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredWork.map((cs) => (
              <Link
                key={cs.slug}
                href={`/work/${cs.slug}`}
                className="group relative block border border-near-black/15 hover:border-near-black/30 transition-colors overflow-hidden"
              >
                {/* Aspect ratio image area — replace bg with actual image when assets are ready */}
                <div className="bg-near-black/5 aspect-[16/9] relative overflow-hidden">
                  <div className="absolute inset-0 bg-near-black/0 group-hover:bg-near-black/5 transition-colors duration-300" />
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-sans text-xs uppercase tracking-widest text-accent">{cs.company}</span>
                    {cs.client && (
                      <span className="font-sans text-xs text-near-black/40">· {cs.client}</span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl text-near-black mb-2 leading-snug">{cs.title}</h3>
                  <p className="font-sans text-sm text-near-black/60">{cs.subtitle}</p>

                  {cs.tags && cs.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {cs.tags.map((tag: string) => (
                        <span key={tag} className="font-sans text-xs text-near-black/50 border border-near-black/15 px-2 py-0.5 rounded-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Projects Teaser */}
      <section className="bg-near-black text-off-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-14">
            <h2 className="font-serif text-3xl md:text-5xl text-off-white mb-6 leading-tight">
              Built with AI.<br />In my free time.
            </h2>
            <p className="font-sans text-base text-off-white/60 leading-relaxed">
              These aren&apos;t side projects. They&apos;re proof that the skills I bring to enterprise work translate directly into shipping real products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} dark={true} />
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/projects"
              className="font-sans text-sm font-medium text-off-white/60 hover:text-off-white transition-colors underline underline-offset-4"
            >
              View all projects →
            </Link>
          </div>
        </div>
      </section>

      {/* Awards Bar */}
      <section className="border-t border-near-black/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
          <span className="font-sans text-xs uppercase tracking-widest text-near-black/40">Recognition</span>
          <div className="flex flex-wrap gap-6">
            {awards.map((award) => (
              <span key={award} className="font-sans text-sm text-near-black/60">{award}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
