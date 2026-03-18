'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// Same brand colors as HighlightLink in BrandAccent.tsx
const HIGHLIGHT_COLORS = [
  { rgba: 'rgba(253,231,76,0.80)',  hex: '#fde74c' },  // banana
  { rgba: 'rgba(133,212,255,0.70)', hex: '#85d4ff' },  // frozen-lake
  { rgba: 'rgba(245,110,61,0.35)',  hex: '#f56e3d' },  // tangerine
  { rgba: 'rgba(155,197,61,0.55)',  hex: '#9bc53d' },  // yellow-green
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function isActive(href: string, pathname: string): boolean {
  if (href === '/#work') return pathname === '/' || pathname.startsWith('/work')
  if (href === '/about') return pathname === '/about'
  if (href === '/projects') return pathname === '/projects' || pathname.startsWith('/projects/')
  return pathname === href
}

// Desktop: minimal underline that uses a random brand color when active or hovered
function DesktopNavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  const colorRef = useRef(pickRandom(HIGHLIGHT_COLORS))
  const [hovered, setHovered] = useState(false)
  const showColor = active || hovered

  return (
    <Link
      href={href}
      className={`font-sans text-sm font-medium tracking-wide pb-0.5 border-b-2 transition-colors duration-150 ${
        showColor ? 'text-near-black' : 'text-near-black/60 hover:text-near-black'
      }`}
      style={{ borderColor: showColor ? colorRef.current.hex : 'transparent' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </Link>
  )
}

// Mobile: same highlighter marker as HighlightLink, applied on pointer down
function MobileNavLink({ href, label, active, onClose }: {
  href: string
  label: string
  active: boolean
  onClose: () => void
}) {
  const colorRef = useRef(pickRandom(HIGHLIGHT_COLORS))
  const [pressed, setPressed] = useState(false)

  const highlightStyle: React.CSSProperties = pressed ? {
    backgroundImage: `linear-gradient(transparent 62%, ${colorRef.current.rgba} 62%)`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
  } : {}

  return (
    <Link
      href={href}
      onClick={onClose}
      className={`flex items-center gap-4 py-4 px-4 rounded-xl transition-transform duration-100 select-none active:scale-[0.97] ${
        active ? 'bg-near-black/5' : ''
      }`}
      style={highlightStyle}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <span className={`font-serif text-4xl leading-none ${active ? 'text-near-black' : 'text-near-black/70'}`}>
        {label}
      </span>
      <span className="ml-auto font-sans text-sm text-near-black/20">→</span>
    </Link>
  )
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const links = [
    { href: '/#work', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/cv', label: 'CV' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          menuOpen ? 'z-[101]' : 'z-50'
        } ${
          scrolled || menuOpen
            ? 'bg-off-white/95 backdrop-blur-md border-b border-near-black/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-near-black hover:text-accent transition-colors">
            Mitch Leonard
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <DesktopNavLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={isActive(link.href, pathname)}
              />
            ))}
          </nav>

          {/* Mobile hamburger — morphs to ✕ */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden p-2"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="relative w-6 h-5">
              <span className={`absolute block w-6 h-0.5 bg-near-black origin-center transition-all duration-300 ease-in-out ${menuOpen ? 'top-[9px] rotate-45' : 'top-0'}`} />
              <span className={`absolute block w-6 h-0.5 bg-near-black top-[9px] transition-all duration-300 ease-in-out ${menuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'}`} />
              <span className={`absolute block h-0.5 bg-near-black origin-center transition-all duration-300 ease-in-out ${menuOpen ? 'w-6 top-[9px] -rotate-45' : 'w-4 top-[18px]'}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile overlay — slides in from right */}
      <div
        className={`fixed inset-0 z-[100] bg-off-white flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="h-[60px] shrink-0" />
        <nav className="flex flex-col justify-center flex-1 px-6 gap-1 pb-16">
          {links.map((link) => (
            <MobileNavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={isActive(link.href, pathname)}
              onClose={() => setMenuOpen(false)}
            />
          ))}
        </nav>
      </div>
    </>
  )
}
