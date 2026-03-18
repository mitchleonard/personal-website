import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { projects, getProject } from '@/data/projects'
import Link from 'next/link'

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug)
  if (!project) return {}
  return {
    title: `${project.name} — Mitch Leonard`,
    description: project.description,
  }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug)
  if (!project) notFound()

  return (
    <main className="bg-near-black text-off-white min-h-screen">
      <Nav />
      <article className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/projects"
            className="font-sans text-sm text-off-white/40 hover:text-off-white transition-colors inline-flex items-center gap-2 mb-12"
          >
            ← Projects
          </Link>

          <h1 className="font-serif text-5xl md:text-6xl text-off-white leading-tight mb-4">
            {project.name}
          </h1>
          <a
            href={project.url}
            className="font-sans text-sm text-accent hover:text-off-white transition-colors mb-8 block"
          >
            {project.url} ↗
          </a>

          <div className="flex flex-wrap gap-2 mb-10">
            {project.tags.map((tag: string) => (
              <span key={tag} className="font-sans text-xs text-off-white/40 border border-off-white/15 px-2 py-0.5 rounded-sm">
                {tag}
              </span>
            ))}
          </div>

          <p className="font-sans text-lg text-off-white/70 leading-relaxed mb-16">
            {project.description}
          </p>

          {/* Placeholder content blocks */}
          {/* TODO: Replace with real content */}
          <div className="space-y-8">
            <div className="border-2 border-dashed border-off-white/15 rounded-sm p-10 text-center">
              <p className="font-sans text-sm text-off-white/30 italic">
                [ Screenshots / demo recording — add assets here ]
              </p>
            </div>
            <div className="border-2 border-dashed border-off-white/15 rounded-sm p-10 text-center">
              <p className="font-sans text-sm text-off-white/30 italic">
                [ GitHub link + tech stack breakdown — coming soon ]
              </p>
            </div>
            <div className="border-2 border-dashed border-off-white/15 rounded-sm p-10 text-center">
              <p className="font-sans text-sm text-off-white/30 italic">
                [ Build notes: what worked, what didn&apos;t, what&apos;s next — coming soon ]
              </p>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}
