'use client'

import { useRef, useState } from 'react'

// Brand highlight colors (semi-transparent, readable over white/off-white)
const HIGHLIGHT_COLORS = [
  'rgba(253,231,76,0.75)',   // banana
  'rgba(133,212,255,0.65)',  // frozen-lake
  'rgba(245,110,61,0.30)',   // tangerine (lighter so text stays readable)
  'rgba(155,197,61,0.45)',   // yellow-green
]

// Solid fill colors for button hover — with matching text color
const FILL_COLORS = [
  { bg: '#fde74c', border: '#fde74c', text: '#0f0f0f' },  // banana
  { bg: '#85d4ff', border: '#85d4ff', text: '#0f0f0f' },  // frozen-lake
  { bg: '#f56e3d', border: '#f56e3d', text: '#f7f5f2' },  // tangerine
  { bg: '#9bc53d', border: '#9bc53d', text: '#0f0f0f' },  // yellow-green
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ── Anchor / section link — underline by default, random highlighter on hover ─
export function HighlightLink({ href, children }: { href: string; children: React.ReactNode }) {
  const colorRef = useRef(pickRandom(HIGHLIGHT_COLORS))
  const [hovered, setHovered] = useState(false)

  const style = hovered
    ? {
        backgroundImage: `linear-gradient(transparent 55%, ${colorRef.current} 55%)`,
        backgroundRepeat: 'no-repeat' as const,
        backgroundSize: '100% 100%',
        textDecoration: 'none',
      }
    : {}

  return (
    <a
      href={href}
      className="font-medium text-near-black/70 underline underline-offset-2 decoration-near-black/25 transition-colors"
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  )
}

// ── Button / pill that fills with a random brand color on hover ──────────────
export function RandomHoverButton({
  href,
  children,
  className,
  download,
  target,
  rel,
}: {
  href: string
  children: React.ReactNode
  className: string
  download?: boolean
  target?: string
  rel?: string
}) {
  const colorRef = useRef(pickRandom(FILL_COLORS))
  const [hovered, setHovered] = useState(false)

  const style = hovered
    ? {
        backgroundColor: colorRef.current.bg,
        borderColor: colorRef.current.border,
        color: colorRef.current.text,
      }
    : {}

  return (
    <a
      href={href}
      download={download}
      target={target}
      rel={rel}
      className={className}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  )
}
