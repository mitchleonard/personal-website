'use client'

import Link from 'next/link'
import { TagPill } from './TagPill'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Project = any

export function FilterableProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((cs) => (
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
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
