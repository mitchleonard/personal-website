'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { TagPill } from './TagPill'

export type WorkItem = {
  type: 'case-study' | 'project'
  slug: string
  title: string
  subtitle: string
  company: string | null
  tags: string[]
  href: string
}

export function FilterableWorkGrid({ items }: { items: WorkItem[] }) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    items.forEach((it) => it.tags?.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [items])

  const visible = useMemo(
    () => (activeTag ? items.filter((it) => it.tags?.includes(activeTag)) : items),
    [items, activeTag],
  )

  const toggle = (tag: string) => setActiveTag((cur) => (cur === tag ? null : tag))

  return (
    <>
      {/* Filter bar */}
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

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((item) => {
          const isExternal = item.type === 'project' && /^https?:/.test(item.href)
          const cardContent = (
            <div className="bg-white rounded-xl border border-near-black/8 p-5 hover:border-near-black/20 transition-all h-full flex flex-col group">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
                <span
                  className={`font-sans text-xs font-medium px-3 py-1 rounded-full ${
                    item.type === 'case-study'
                      ? 'bg-frozen-lake/40 text-cornflower'
                      : 'bg-banana/50 text-near-black/70'
                  }`}
                >
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
                  {item.tags.slice(0, 3).map((tag) => (
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
          )

          return isExternal ? (
            <a key={item.slug} href={item.href} className="block">
              {cardContent}
            </a>
          ) : (
            <Link key={item.slug} href={item.href} className="block">
              {cardContent}
            </Link>
          )
        })}
      </div>
    </>
  )
}
