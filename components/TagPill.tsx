'use client'

import { useState } from 'react'
import { colorKeyForTag } from '@/data/tags'

// Full literal class strings so Tailwind's JIT picks them up.
const ACTIVE_CLASSES: Record<string, string> = {
  'banana':       'bg-banana/50 border-banana text-near-black',
  'frozen-lake':  'bg-frozen-lake/40 border-frozen-lake text-near-black',
  'tangerine':    'bg-tangerine/25 border-tangerine/60 text-near-black',
  'yellow-green': 'bg-yellow-green/30 border-yellow-green/60 text-near-black',
  'cornflower':   'bg-cornflower/15 border-cornflower/50 text-near-black',
  'neutral':      'bg-near-black/8 border-near-black/25 text-near-black',
}

const REST_CLASSES = 'bg-transparent border-near-black/10 text-near-black/45'

type Size = 'sm' | 'xs'

export function TagPill({
  tag,
  active = false,
  onClick,
  size = 'xs',
}: {
  tag: string
  active?: boolean
  onClick?: (tag: string) => void
  size?: Size
}) {
  const [hovered, setHovered] = useState(false)
  const key = colorKeyForTag(tag)
  const activeCls = ACTIVE_CLASSES[key] ?? ACTIVE_CLASSES.neutral
  const lit = active || hovered

  const sizeCls = size === 'sm' ? 'text-sm px-4 py-1.5' : 'text-xs px-2.5 py-0.5'
  const base =
    'font-sans border rounded-full inline-flex items-center transition-colors duration-150 ' + sizeCls
  const state = lit ? activeCls : REST_CLASSES

  if (!onClick) {
    return <span className={`${base} ${state}`}>{tag}</span>
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick(tag)
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-pressed={active}
      className={`${base} ${state} cursor-pointer`}
    >
      {tag}
    </button>
  )
}
