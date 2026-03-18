import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import Link from 'next/link'
import { caseStudies } from '@/data/caseStudies'

export const metadata = {
  title: 'Projects — Mitch Leonard',
  description: 'Personal projects built outside of work — habit trackers, games, microsites, and health apps.',
}

const PERSONAL_SLUGS = ['daily', 'pebble-path', 'astro-jump', 'baking-day']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const personalProjects: any[] = PERSONAL_SLUGS.flatMap((slug) => {
  const cs = caseStudies.find((c: any) => c.slug === slug)
  return cs ? [cs] : []
})

export default function ProjectsPage() {
  return (
    <main className="bg-off-white">
      <Nav />

      {/* Hero */}
      <section className="px-6 pt-32 pb-16 max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl md:text-7xl text-near-black leading-tight mb-6">
          Things I Build
        </h1>
        <p className="font-sans text-xl md:text-2xl text-near-black/65 leading-relaxed font-light max-w-2xl">
          The most relevant work I do can't leave the building. These are the problems I solve on my own time — same instincts as the day job: find a real problem, design a practical solution, ship something that works.
        </p>
      </section>

      {/* Projects grid */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {personalProjects.map((cs) => (
            <Link key={cs.slug} href={`/work/${cs.slug}`} className="block">
              <div className="bg-white rounded-xl border border-near-black/8 p-5 hover:border-near-black/20 transition-all h-full flex flex-col group">
                <div className="mb-3">
                  <span className="font-sans text-xs font-medium px-3 py-1 rounded-full bg-banana/50 text-near-black/70">
                    Project
                  </span>
                </div>
                <h3 className="font-serif text-xl text-near-black leading-snug mb-2 group-hover:text-cornflower transition-colors">
                  {cs.title}
                </h3>
                <p className="font-sans text-sm text-near-black/55 leading-relaxed mb-4 flex-1">
                  {cs.description}
                </p>
                {cs.tags && cs.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {cs.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="font-sans text-xs text-near-black/40 border border-near-black/10 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  )
}
