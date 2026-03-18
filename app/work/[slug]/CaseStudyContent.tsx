'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import AutoplayVideo from '@/components/AutoplayVideo'
import ResultsBlock from '@/components/ResultsBlock'
import { RandomHoverButton } from '@/components/BrandAccent'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type Visual = {
  type: 'video' | 'image' | 'gif'
  src: string
  caption?: string
  description?: string
  featured?: boolean
  portrait?: boolean
  annotated?: boolean
  silent?: boolean
  tall?: boolean
  section?: string
}

type VisualGroup =
  | { kind: 'full'; item: Visual }
  | { kind: 'masonry'; items: Visual[] }
  | { kind: 'split'; item: Visual; index: number }

// ─────────────────────────────────────────────────────────────
// Color maps
// ─────────────────────────────────────────────────────────────
const SECTION_ACCENT: Record<string, string> = {
  Context:   'bg-frozen-lake',
  Challenge: 'bg-tangerine',
  Insight:   'bg-banana',
  Role:      'bg-yellow-green',
  Execution: 'bg-cornflower',
  Impact:    'bg-yellow-green',
}

const TAG_COLORS = [
  'bg-near-black/5 border-near-black/10 text-near-black/50',
  'bg-near-black/5 border-near-black/10 text-near-black/50',
  'bg-near-black/5 border-near-black/10 text-near-black/50',
  'bg-near-black/5 border-near-black/10 text-near-black/50',
]

// ─────────────────────────────────────────────────────────────
// useInView
// ─────────────────────────────────────────────────────────────
function useInView(threshold = 0.06) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView] as const
}

// ─────────────────────────────────────────────────────────────
// AnimateIn — snappy spring ease, 56px offset
// ─────────────────────────────────────────────────────────────
function AnimateIn({
  children,
  delay = 0,
  className = '',
  distance = 56,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  distance?: number
}) {
  const [ref, inView] = useInView()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) scale(1)' : `translateY(${distance}px) scale(0.98)`,
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// parseInline — ==text== → banana highlight
// ─────────────────────────────────────────────────────────────
function parseInline(text: string) {
  const parts = text.split(/(==.*?==)/)
  return parts.map((part, i) => {
    if (part.startsWith('==') && part.endsWith('==')) {
      return (
        <mark key={i} className="bg-banana/70 px-0.5 rounded-sm not-italic">
          {part.slice(2, -2)}
        </mark>
      )
    }
    return <span key={i}>{part}</span>
  })
}

// ─────────────────────────────────────────────────────────────
// BodyText
// ─────────────────────────────────────────────────────────────
function BodyText({ text }: { text: string }) {
  const paragraphs = text.split('\n\n').filter(Boolean)
  return (
    <div className="space-y-5">
      {paragraphs.map((p, i) => (
        <p key={i} className="font-sans text-lg md:text-xl text-near-black/80 leading-[1.85]">
          {parseInline(p)}
        </p>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SectionRow — colored accent dot + label + sticky on desktop
// ─────────────────────────────────────────────────────────────
function SectionRow({
  label,
  children,
  delay = 0,
}: {
  label: string
  children: React.ReactNode
  delay?: number
}) {
  const accentColor = SECTION_ACCENT[label] ?? 'bg-cornflower'
  return (
    <AnimateIn delay={delay}>
      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-x-10 gap-y-3">
        <div className="md:sticky md:top-28 pt-0.5">
          <div className="flex items-center gap-2">
            <span className={`shrink-0 w-1.5 h-4 rounded-full ${accentColor}`} />
            <p className="font-sans text-xs uppercase tracking-[0.15em] text-near-black/50">
              {label}
            </p>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </AnimateIn>
  )
}

// ─────────────────────────────────────────────────────────────
// VisualMedia — no caption text rendered
// ─────────────────────────────────────────────────────────────
function VisualMedia({ item, className = '' }: { item: Visual; className?: string }) {
  if (item.type === 'video') {
    return <AutoplayVideo src={item.src} silent={item.silent} className={className} />
  }
  return (
    <div className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt={item.caption || ''} className="w-full" loading="lazy" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SplitMedia — portrait screenshot on one side, short descriptor on the other
// Alternates image-left / image-right based on index
// ─────────────────────────────────────────────────────────────
function SplitMedia({ item, index }: { item: Visual; index: number }) {
  const imageRight = index % 2 !== 0
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
      {imageRight && (
        <p className="font-sans text-lg text-near-black/65 leading-relaxed hidden md:block">
          {item.description}
        </p>
      )}
      <div className="max-w-xs mx-auto md:mx-0">
        <VisualMedia item={item} />
      </div>
      {!imageRight && (
        <p className="font-sans text-lg text-near-black/65 leading-relaxed">
          {item.description}
        </p>
      )}
      {imageRight && (
        <p className="font-sans text-lg text-near-black/65 leading-relaxed md:hidden">
          {item.description}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// groupItems — all consecutive portrait items form one masonry block,
// regardless of media type, so no gap appears between videos and images
// ─────────────────────────────────────────────────────────────
function groupItems(items: Visual[]): VisualGroup[] {
  const groups: VisualGroup[] = []
  let i = 0
  let splitCount = 0
  while (i < items.length) {
    if (items[i].annotated) {
      groups.push({ kind: 'split', item: items[i], index: splitCount++ })
      i++
    } else if (!items[i].portrait) {
      groups.push({ kind: 'full', item: items[i] })
      i++
    } else {
      const portraitItems: Visual[] = []
      while (i < items.length && items[i].portrait && !items[i].annotated) {
        portraitItems.push(items[i])
        i++
      }
      groups.push({ kind: 'masonry', items: portraitItems })
    }
  }
  return groups
}

// ─────────────────────────────────────────────────────────────
// MasonryGrid — CSS columns waterfall
// cols=2: always 2-col (used for portrait video groups)
// cols=3: 2-col mobile → 3-col desktop (used for image/gif groups)
// ─────────────────────────────────────────────────────────────
function MasonryGrid({ items }: { items: Visual[] }) {
  if (items.length === 1) {
    return (
      <div className="max-w-[280px] sm:max-w-xs">
        <VisualMedia item={items[0]} />
      </div>
    )
  }
  // tall: true items → always 2-col (LinkedIn full-post recordings etc.)
  // fewer than 3 items → 2-col (avoids empty columns in a 3-col layout)
  // everything else → 2-col mobile, 3-col desktop
  const isTall = items.some(i => i.tall)
  const colClass = (isTall || items.length < 3)
    ? 'columns-2'
    : 'columns-2 md:columns-3'
  // Odd item count → last item would sit alone in an empty column on mobile.
  // Hide it on mobile, show on desktop (where 3-col fills cleanly or the gap is minor).
  const hideLastOnMobile = items.length % 2 !== 0
  return (
    <div className={colClass} style={{ columnGap: '0.5rem' }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <div
            key={i}
            className={`break-inside-avoid mb-2${hideLastOnMobile && isLast ? ' hidden md:block' : ''}`}
          >
            <VisualMedia item={item} />
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// VisualsGallery
// ─────────────────────────────────────────────────────────────
function VisualsGallery({ visuals }: { visuals: Visual[] }) {
  const featured = visuals.find(v => v.featured)
  const rest = visuals.filter(v => !v.featured)

  const sectionMap = new Map<string, Visual[]>()
  for (const v of rest) {
    const key = v.section ?? '__main__'
    if (!sectionMap.has(key)) sectionMap.set(key, [])
    sectionMap.get(key)!.push(v)
  }

  const sections = Array.from(sectionMap.entries()).map(([key, items]) => ({ key, items }))

  return (
    <div className="mt-20">
      <AnimateIn>
        <div className="flex items-center gap-2 mb-8">
          <span className="shrink-0 w-1.5 h-4 rounded-full bg-cornflower" />
          <p className="font-sans text-xs uppercase tracking-[0.15em] text-near-black/50">Work</p>
        </div>
      </AnimateIn>

      {featured && (
        <AnimateIn delay={80}>
          <div className="mb-4">
            <VisualMedia item={featured} />
          </div>
        </AnimateIn>
      )}

      {sections.map(({ key, items }) => {
        const groups = groupItems(items)
        return (
          <div key={key}>
            {!key.startsWith('__') && (
              <AnimateIn>
                <div className="flex items-center gap-2 mt-12 mb-4">
                  <span className="shrink-0 w-1.5 h-4 rounded-full bg-tangerine" />
                  <p className="font-sans text-xs uppercase tracking-[0.15em] text-near-black/50">{key}</p>
                </div>
              </AnimateIn>
            )}
            <div className="space-y-10">
              {groups.map((group, idx) => (
                <AnimateIn key={idx} delay={30}>
                  {group.kind === 'split' ? (
                    <SplitMedia item={group.item} index={group.index} />
                  ) : group.kind === 'masonry' ? (
                    <MasonryGrid items={group.items} />
                  ) : (
                    <VisualMedia item={group.item} />
                  )}
                </AnimateIn>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Per-section hover colors matching the accent dot colors
const PILL_HOVER: Record<string, { border: string; color: string; bg: string }> = {
  Context:   { border: '#85d4ff', color: '#0f0f0f', bg: 'rgba(133,212,255,0.22)' },
  Challenge: { border: '#f56e3d', color: '#f56e3d', bg: 'rgba(245,110,61,0.10)' },
  Insight:   { border: '#fde74c', color: '#0f0f0f', bg: 'rgba(253,231,76,0.40)' },
  Role:      { border: '#9bc53d', color: '#0f0f0f', bg: 'rgba(155,197,61,0.18)' },
}

// ─────────────────────────────────────────────────────────────
// QuickReadCollapsed — clickable pills with per-section hover color
// ─────────────────────────────────────────────────────────────
function QuickReadCollapsed({
  sections,
  onRestore,
}: {
  sections: string[]
  onRestore: (label: string) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <span className="font-sans text-xs text-near-black/30 mr-1">Hidden:</span>
      {sections.map(s => {
        const h = PILL_HOVER[s]
        const isHovered = hovered === s
        return (
          <button
            key={s}
            onClick={() => onRestore(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(null)}
            style={{
              borderColor: isHovered && h ? h.border : undefined,
              color:       isHovered && h ? h.color : undefined,
              backgroundColor: isHovered && h ? h.bg : undefined,
              transition: 'border-color 0.15s, color 0.15s, background-color 0.15s',
            }}
            className="font-sans text-xs uppercase tracking-[0.12em] text-near-black/40 border border-near-black/15 px-2.5 py-1 rounded-full"
            title={`Tap to read ${s}`}
          >
            {s} +
          </button>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CaseStudyContent — main export
// ─────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CaseStudyContent({ cs, next }: { cs: any; next: any }) {
  const [quickRead, setQuickRead] = useState(false)
  // Track which hidden sections have been individually restored
  const [restoredSections, setRestoredSections] = useState<Set<string>>(new Set())

  const toggleQuickRead = () => {
    setQuickRead(q => !q)
    setRestoredSections(new Set()) // reset restores when toggling back to full
  }

  const restoreSection = (label: string) => {
    setRestoredSections(prev => new Set(Array.from(prev).concat(label)))
  }

  const narrativeSections = [
    { label: 'Context', content: cs.context },
    { label: 'Challenge', content: cs.challenge },
    { label: 'Insight', content: cs.insight },
    { label: 'Role', content: cs.role },
  ].filter(s => s.content)

  // In quick read, hidden = those not yet individually restored
  const hiddenLabels = quickRead
    ? narrativeSections.map(s => s.label).filter(l => !restoredSections.has(l))
    : []

  return (
    <article className="pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <AnimateIn>
          <Link
            href="/#work"
            className="font-sans text-sm text-near-black/40 hover:text-near-black transition-colors inline-flex items-center gap-2 mb-14"
          >
            ← Work
          </Link>
        </AnimateIn>

        {/* Header */}
        <div className="mb-12">
          <AnimateIn delay={60}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
              <span className="font-sans text-xs uppercase tracking-widest text-accent">{cs.company}</span>
              {cs.client && (
                <>
                  <span className="text-near-black/20">·</span>
                  <span className="font-sans text-xs uppercase tracking-widest text-near-black/50">
                    Client: {cs.client}
                  </span>
                </>
              )}
              {/* Colored tag chips */}
              {cs.tags.map((tag: string, i: number) => (
                <span
                  key={tag}
                  className={`font-sans text-xs px-2.5 py-0.5 rounded-full border ${TAG_COLORS[i % TAG_COLORS.length]}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </AnimateIn>

          <AnimateIn delay={130}>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-near-black leading-tight mb-5">
              {cs.title}
            </h1>
          </AnimateIn>

          <AnimateIn delay={180}>
            <p className="font-sans text-xl text-near-black/60 italic">{cs.subtitle}</p>
          </AnimateIn>

          {cs.url && (
            <AnimateIn delay={210}>
              <div className="mt-6">
                <RandomHoverButton
                  href={cs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm font-medium bg-near-black text-off-white px-5 py-2.5 rounded-full border border-near-black transition-colors inline-flex items-center gap-2"
                >
                  Visit live site →
                </RandomHoverButton>
              </div>
            </AnimateIn>
          )}
        </div>

        {/* Results */}
        {cs.results && cs.results.length > 0 && (
          <AnimateIn delay={240} className="mb-16">
            <ResultsBlock results={cs.results} />
          </AnimateIn>
        )}

        {/* Divider + Quick Read toggle */}
        <AnimateIn delay={240}>
          <div className="flex items-center gap-5 mb-14">
            <div className="flex-1 h-px bg-near-black/10" />
            <button
              onClick={toggleQuickRead}
              className={`font-sans text-xs uppercase tracking-[0.15em] px-4 py-1.5 rounded-full border transition-all duration-300 ${
                quickRead
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-near-black/20 text-near-black/40 hover:border-near-black/40 hover:text-near-black/60'
              }`}
            >
              {quickRead ? '← Full story' : 'Quick read'}
            </button>
          </div>
        </AnimateIn>

        {/* Body */}
        <div className="space-y-14">

          {quickRead ? (
            // Quick read: collapsed pills + individually restored sections
            <>
              {hiddenLabels.length > 0 && (
                <AnimateIn>
                  <QuickReadCollapsed sections={hiddenLabels} onRestore={restoreSection} />
                </AnimateIn>
              )}
              {/* Show any individually restored sections */}
              {narrativeSections
                .filter(s => restoredSections.has(s.label))
                .map((section, i) => (
                  <SectionRow key={section.label} label={section.label} delay={i * 70}>
                    <BodyText text={section.content!} />
                  </SectionRow>
                ))}
            </>
          ) : (
            narrativeSections.map((section, i) => (
              <SectionRow key={section.label} label={section.label} delay={i * 70}>
                <BodyText text={section.content!} />
              </SectionRow>
            ))
          )}

          {/* Execution — always visible */}
          {cs.execution && cs.execution.length > 0 && (
            <SectionRow label="Execution" delay={quickRead ? 80 : narrativeSections.length * 70}>
              <ul className="space-y-5">
                {cs.execution.map((item: string, i: number) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-5 h-5 mt-1.5 rounded-full border border-accent flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </span>
                    <p className="font-sans text-base md:text-lg text-near-black/80 leading-relaxed">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </SectionRow>
          )}

          {/* Impact — always visible */}
          {cs.impact && (
            <SectionRow label="Impact" delay={quickRead ? 140 : (narrativeSections.length + 1) * 70}>
              <BodyText text={cs.impact} />
            </SectionRow>
          )}

        </div>

        {/* Visuals gallery */}
        {cs.visuals && cs.visuals.length > 0 && (
          <VisualsGallery visuals={cs.visuals} />
        )}

        {/* Media links hidden — shown only when explicitly enabled */}

        {/* Next case study */}
        {next && (
          <AnimateIn>
            <div className="mt-20 pt-10 border-t border-near-black/10">
              <p className="font-sans text-xs uppercase tracking-[0.15em] text-near-black/30 mb-4">
                Next case study
              </p>
              <Link href={`/work/${next.slug}`} className="group block">
                <span className="font-sans text-xs uppercase tracking-widest text-accent block mb-2">
                  {next.company}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-near-black group-hover:text-accent transition-colors leading-snug">
                  {next.title} →
                </h2>
              </Link>
            </div>
          </AnimateIn>
        )}

      </div>
    </article>
  )
}
