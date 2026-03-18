'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

const HIGHLIGHT_COLORS = [
  { rgba: 'rgba(253,231,76,0.80)',  hex: '#fde74c' },
  { rgba: 'rgba(133,212,255,0.70)', hex: '#85d4ff' },
  { rgba: 'rgba(245,110,61,0.35)',  hex: '#f56e3d' },
  { rgba: 'rgba(155,197,61,0.55)',  hex: '#9bc53d' },
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const colorRef = useRef(pickRandom(HIGHLIGHT_COLORS))
  const [hovered, setHovered] = useState(false)

  const style: React.CSSProperties = {
    borderColor: hovered ? colorRef.current.hex : 'transparent',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    paddingBottom: '2px',
  }

  const className = `font-sans text-sm transition-colors duration-150 ${
    hovered ? 'text-near-black' : 'text-near-black/50'
  }`

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style} {...handlers}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className} style={style} {...handlers}>
      {label}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="bg-off-white border-t border-near-black/8 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <Link href="/" className="font-serif text-2xl text-near-black hover:text-accent transition-colors">
            Mitch Leonard
          </Link>
          <nav className="flex flex-wrap gap-6">
            <FooterLink href="/#work" label="Work" />
            <FooterLink href="/about" label="About" />
            <FooterLink href="/projects" label="Projects" />
            <FooterLink href="/cv" label="CV" />
            <FooterLink href="https://www.linkedin.com/in/mitchleonard/" label="LinkedIn" external />
            <FooterLink href="/contact" label="Contact" />
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-near-black/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="font-sans text-sm font-medium text-near-black inline-flex items-center gap-1.5 bg-cornflower/15 border border-cornflower/30 px-3 py-1.5 rounded-full w-fit">
            📍 Minneapolis
          </span>
          <span className="font-sans text-sm font-medium text-near-black inline-flex items-center gap-1.5 bg-banana/50 border border-banana px-3 py-1.5 rounded-full w-fit">
            Powered by 🍦
          </span>
        </div>
      </div>
    </footer>
  )
}
