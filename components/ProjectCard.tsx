'use client'

import Link from 'next/link'

interface Project {
  slug: string
  name: string
  url: string
  description: string
  tags: string[]
}

interface ProjectCardProps {
  project: Project
  dark?: boolean
}

export default function ProjectCard({ project, dark = false }: ProjectCardProps) {
  const textBase = dark ? 'text-off-white' : 'text-near-black'
  const textMuted = dark ? 'text-off-white/60' : 'text-near-black/60'
  const textFaint = dark ? 'text-off-white/40' : 'text-near-black/40'
  const border = dark ? 'border-off-white/10 hover:border-off-white/25' : 'border-near-black/15 hover:border-near-black/30'
  const tagBorder = dark ? 'border-off-white/15' : 'border-near-black/15'
  const tagText = dark ? 'text-off-white/40' : 'text-near-black/40'

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group border ${border} p-8 transition-colors block`}
    >
      <h3 className={`font-serif text-2xl ${textBase} mb-2 group-hover:text-accent transition-colors`}>
        {project.name}
      </h3>
      <span
        className={`font-sans text-xs ${textFaint} hover:text-accent transition-colors mb-4 block`}
        onClick={(e) => {
          e.preventDefault()
          window.open(project.url, '_blank', 'noopener,noreferrer')
        }}
      >
        {project.url}
      </span>
      <p className={`font-sans text-sm ${textMuted} leading-relaxed mb-5`}>
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className={`font-sans text-xs ${tagText} border ${tagBorder} px-2 py-0.5 rounded-sm`}>
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}
