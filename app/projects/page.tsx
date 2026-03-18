import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/data/projects'

export const metadata = {
  title: 'Projects — Mitch Leonard',
  description: 'Four apps. Real databases. Actual game theory. Built because the problems were interesting.',
}

export default function ProjectsPage() {
  return (
    <main>
      <Nav />

      <div className="bg-near-black text-off-white min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto max-w-3xl">
            <h1 className="font-serif text-5xl md:text-7xl text-off-white leading-tight mb-6">
              Built with AI.<br />In my free time.
            </h1>
            <p className="font-sans text-lg text-off-white/60 leading-relaxed">
              Four apps. Real databases. Actual game theory. Built because the problems were interesting.
            </p>
          </div>
        </section>

        {/* Projects grid */}
        <section className="px-6 pb-24">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} dark={true} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
      <ScrollToTop />
    </main>
  )
}
