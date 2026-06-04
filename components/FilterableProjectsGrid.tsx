'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { TagPill } from './TagPill'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Project = any

export function FilterableProjectsGrid({ projects }: { projects: Project[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => (p.tags || []).forEach((t: string) => set.add(t)))
    return Array.from(set).sort()
  }, [projects])

  const visible = useMemo(
    () => (activeTag ? projects.filter((p) => (p.tags || []).includes(activeTag)) : projects),
    [projects, activeTag],
  )

  const toggle = (tag: string) => setActiveTag((cur) => (cur === tag ? null : tag))

  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5 mb-6">
        <span className="font-sans text-xs uppercase tracking-widest text-near-black/30 mr-2">
          Filter
        </span>
        {allTags.map((tag) => (
          <TagPill key={tag} tag={tag} active={activeTag === tag} onClick={toggle} />
        ))}
        {activeTag && (
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className="font-sans text-xs text-near-black/50 underline underline-offset-2 ml-2"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visible.map((cs) => (
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
                    <TagPill
                      key={tag}
                      tag={tag}
                      active={activeTag === tag}
                      onClick={toggle}
                    />
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
