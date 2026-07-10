'use client'

import { useMemo } from 'react'
import { useIceCreamMode } from '@/lib/useIceCreamMode'

const CANDY_COLORS = [
  '#ff5fa2', // bubblegum pink
  '#ff8a3d', // orange sherbet
  '#86d97c', // pistachio
  '#5ec8f2', // blue moon
  '#b980ff', // ube
  '#ffe95c', // lemon sorbet
  '#ff6b6b', // strawberry
]

type Sprinkle = {
  left: string
  fallDuration: string
  fallDelay: string
  swayDuration: string
  color: string
  isDot: boolean
  size: number
}

function makeSprinkles(count: number): Sprinkle[] {
  return Array.from({ length: count }, () => {
    const fall = 4 + Math.random() * 5 // 4–9s
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

export default function SprinkleOverlay() {
  const [on] = useIceCreamMode()

  // Only generated client-side after toggle-on, so Math.random() never
  // participates in hydration.
  const sprinkles = useMemo(() => makeSprinkles(36), [])

  if (!on) return null

  return (
    <div className="sprinkle-overlay" aria-hidden>
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
