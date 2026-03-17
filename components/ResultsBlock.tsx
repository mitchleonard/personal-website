'use client'

import { useRef, useEffect, useState } from 'react'

interface Result {
  value: string
  label: string
}

function parseResultValue(value: string) {
  const match = value.match(/^([+]?)([\d,]+(?:\.\d+)?)(.*?)$/)
  if (!match) return { prefix: '', num: 0, suffix: value, decimals: 0, hasCommas: false }
  const [, prefix, rawNum, suffix] = match
  const hasCommas = rawNum.includes(',')
  const cleaned = rawNum.replace(/,/g, '')
  const num = parseFloat(cleaned)
  const decimals = cleaned.includes('.') ? cleaned.split('.')[1].length : 0
  return { prefix, num, suffix, decimals, hasCommas }
}

function formatNum(current: number, decimals: number, hasCommas: boolean): string {
  if (decimals > 0) return current.toFixed(decimals)
  const rounded = Math.round(current)
  if (hasCommas) return rounded.toLocaleString()
  return String(rounded)
}

function AnimatedNumber({ value, delay, active }: { value: string; delay: number; active: boolean }) {
  const { prefix, num, suffix, decimals, hasCommas } = parseResultValue(value)
  const [current, setCurrent] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) return
    const timeout = setTimeout(() => {
      const duration = 1600
      const start = performance.now()
      const tick = (now: number) => {
        const elapsed = now - start
        const t = Math.min(elapsed / duration, 1)
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        setCurrent(num * eased)
        if (t < 1) rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timeout)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [active, num, delay])

  return <span>{prefix}{formatNum(current, decimals, hasCommas)}{suffix}</span>
}

// Cycles through brand palette underlines
const UNDERLINE_COLORS = [
  'border-cornflower',
  'border-tangerine',
  'border-banana',
  'border-yellow-green',
]

export default function ResultsBlock({ results }: { results: Result[] }) {
  if (!results || results.length === 0) return null

  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-wrap gap-x-12 gap-y-8">
      {results.map((result, i) => {
        const underline = UNDERLINE_COLORS[i % UNDERLINE_COLORS.length]
        return (
          <div key={i} className="min-w-[100px]">
            <div
              className={`font-serif text-near-black leading-none tabular-nums border-b-4 ${underline} pb-2 inline-block`}
              style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}
            >
              <AnimatedNumber value={result.value} delay={i * 120} active={active} />
            </div>
            <div className="font-sans text-xs text-near-black/40 uppercase tracking-widest mt-3">
              {result.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
