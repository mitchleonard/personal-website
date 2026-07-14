import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { FilterableProjectsGrid } from '@/components/FilterableProjectsGrid'
import { caseStudies } from '@/data/caseStudies'

export const metadata = {
  title: 'Projects — Mitch Leonard',
  description: 'Personal projects built outside of work — habit trackers, games, microsites, and health apps.',
}

const PERSONAL_SLUGS = ['ice-cream-mode', 'fever-hq', 'strava-dashboard', 'hackathon-skill', 'daily', 'pebble-path', 'astro-jump', 'baking-day']

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
        <FilterableProjectsGrid projects={personalProjects} />
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  )
}
