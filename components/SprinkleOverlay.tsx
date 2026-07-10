'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { BLIZZARD_EVENT, useIceCreamMode } from '@/lib/useIceCreamMode'

const CANDY_COLORS = [
  '#ff5fa2', // bubblegum pink
  '#ff8a3d', // orange sherbet
  '#86d97c', // pistachio
  '#5ec8f2', // blue moon
  '#b980ff', // ube
  '#ffe95c', // lemon sorbet
  '#ff6b6b', // strawberry
]

const TITLE_PREFIX = '🍦 '
const CONE_FAVICON = `data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍦</text></svg>"
)}`

type Sprinkle = {
  left: string
  fallDuration: string
  fallDelay: string
  swayDuration: string
  color: string
  isDot: boolean
  size: number
}

function makeSprinkles(count: number, minFall = 4, fallRange = 5): Sprinkle[] {
  return Array.from({ length: count }, () => {
    const fall = minFall + Math.random() * fallRange
    return {
      left: `${Math.random() * 100}%`,
      fallDuration: `${fall.toFixed(2)}s`,
      // Negative delay pre-fills the sky the moment the mode flips on
      fallDelay: `-${(Math.random() * fall).toFixed(2)}s`,
      swayDuration: `${(1.6 + Math.random() * 1.6).toFixed(2)}s`,
      color: CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)],
      isDot: Math.random() < 0.25,
      size: 0.7 + Math.random() * 0.6,
    }
  })
}

type BurstPiece = {
  dx: string
  dy: string
  rot: string
  color: string
  width: number
  height: number
}

type Burst = { id: number; x: number; y: number; pieces: BurstPiece[] }

let nextBurstId = 1

function makeBurst(x: number, y: number): Burst {
  const pieces = Array.from({ length: 10 }, (): BurstPiece => {
    const angle = Math.random() * 2 * Math.PI
    const distance = 30 + Math.random() * 60
    const isDot = Math.random() < 0.3
    return {
      dx: `${(Math.cos(angle) * distance).toFixed(0)}px`,
      dy: `${(Math.sin(angle) * distance - 15).toFixed(0)}px`,
      rot: `${(Math.random() * 540 - 270).toFixed(0)}deg`,
      color: CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)],
      width: isDot ? 6 : 4,
      height: isDot ? 6 : 11,
    }
  })
  return { id: nextBurstId++, x, y, pieces }
}

function SprinkleField({ sprinkles, className = '' }: { sprinkles: Sprinkle[]; className?: string }) {
  return (
    <div className={`sprinkle-field ${className}`}>
      {sprinkles.map((s, i) => (
        <div
          key={i}
          className="sprinkle"
          style={{
            left: s.left,
            animationDuration: s.fallDuration,
            animationDelay: s.fallDelay,
          }}
        >
          <span
            className={`sprinkle-piece ${s.isDot ? 'sprinkle-dot' : ''}`}
            style={{
              backgroundColor: s.color,
              animationDuration: s.swayDuration,
              width: `${((s.isDot ? 7 : 5) * s.size).toFixed(1)}px`,
              height: `${((s.isDot ? 7 : 15) * s.size).toFixed(1)}px`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default function SprinkleOverlay() {
  const [on] = useIceCreamMode()
  const [bursts, setBursts] = useState<Burst[]>([])
  const [blizzard, setBlizzard] = useState(false)

  // Only generated client-side after toggle-on, so Math.random() never
  // participates in hydration. Counts/durations are sized for the oversized
  // .sprinkle-tilt layer (~2x the fall distance of the bare viewport).
  const sprinkles = useMemo(() => makeSprinkles(60, 5.5, 6.5), [])
  const blizzardSprinkles = useMemo(() => (blizzard ? makeSprinkles(170, 2, 2) : []), [blizzard])

  // Click bursts — a pop of mini sprinkles wherever the pointer goes down
  const burstTimeouts = useRef<ReturnType<typeof setTimeout>[]>([])
  useEffect(() => {
    if (!on) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timeouts = burstTimeouts.current
    const onPointerDown = (e: PointerEvent) => {
      const burst = makeBurst(e.clientX, e.clientY)
      setBursts((bs) => [...bs, burst])
      timeouts.push(
        setTimeout(() => setBursts((bs) => bs.filter((b) => b.id !== burst.id)), 800)
      )
    }
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      timeouts.forEach(clearTimeout)
      timeouts.length = 0
      setBursts([])
    }
  }, [on])

  // Brain freeze — 3 rapid toggles (see lib/useIceCreamMode.ts) rain 130
  // extra fast sprinkles for 5 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined
    const onBlizzard = () => {
      setBlizzard(true)
      clearTimeout(timeout)
      timeout = setTimeout(() => setBlizzard(false), 5000)
    }
    window.addEventListener(BLIZZARD_EVENT, onBlizzard)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener(BLIZZARD_EVENT, onBlizzard)
    }
  }, [])

  // Gyro tilt — rotate the sprinkle field opposite the phone's left/right
  // tilt (gamma) so sprinkles fall toward the low side. Desktop never fires
  // deviceorientation, so the transform stays identity there. iOS motion
  // permission is requested from the toggle tap (see lib/useIceCreamMode.ts).
  const tiltRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!on) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || !tiltRef.current) return
      const gamma = Math.max(-28, Math.min(28, e.gamma))
      tiltRef.current.style.transform = `rotate(${(-gamma).toFixed(1)}deg)`
    }
    window.addEventListener('deviceorientation', onOrientation)
    return () => window.removeEventListener('deviceorientation', onOrientation)
  }, [on])

  // Tab chrome — 🍦 title prefix + cone favicon while the mode is on.
  // Next.js rewrites <title> (and may re-render head links) on navigation,
  // so a MutationObserver re-applies both; the guards make re-runs no-ops.
  useEffect(() => {
    if (!on) return
    const savedIcons = new Map<HTMLLinkElement, string>()
    const apply = () => {
      if (!document.title.startsWith(TITLE_PREFIX)) {
        document.title = TITLE_PREFIX + document.title
      }
      document.querySelectorAll<HTMLLinkElement>('link[rel="icon"]').forEach((link) => {
        if (link.getAttribute('href') === CONE_FAVICON) return
        savedIcons.set(link, link.getAttribute('href') ?? '')
        link.setAttribute('href', CONE_FAVICON)
      })
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.head, { subtree: true, childList: true, characterData: true })
    return () => {
      observer.disconnect()
      if (document.title.startsWith(TITLE_PREFIX)) {
        document.title = document.title.slice(TITLE_PREFIX.length)
      }
      savedIcons.forEach((href, link) => {
        if (link.isConnected) link.setAttribute('href', href)
      })
    }
  }, [on])

  if (!on) return null

  return (
    <div className="sprinkle-overlay" aria-hidden>
      <div className="sprinkle-tilt" ref={tiltRef}>
        <SprinkleField sprinkles={sprinkles} />
        {blizzard && <SprinkleField sprinkles={blizzardSprinkles} className="sprinkle-blizzard" />}
      </div>
      {bursts.map((burst) =>
        burst.pieces.map((p, i) => (
          <span
            key={`${burst.id}-${i}`}
            className="sprinkle-burst-piece"
            style={
              {
                left: burst.x,
                top: burst.y,
                backgroundColor: p.color,
                width: p.width,
                height: p.height,
                '--dx': p.dx,
                '--dy': p.dy,
                '--rot': p.rot,
              } as React.CSSProperties
            }
          />
        ))
      )}
    </div>
  )
}
