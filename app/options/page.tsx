'use client'

import { useRef, useEffect, useState } from 'react'
import Nav from '@/components/Nav'

// ─────────────────────────────────────────────────────────────
// Shared counter hook (for animated results)
// ─────────────────────────────────────────────────────────────
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
function formatNum(n: number, decimals: number, hasCommas: boolean) {
  if (decimals > 0) return n.toFixed(decimals)
  const r = Math.round(n)
  return hasCommas ? r.toLocaleString() : String(r)
}
function AnimatedNum({ value, delay, active }: { value: string; delay: number; active: boolean }) {
  const { prefix, num, suffix, decimals, hasCommas } = parseResultValue(value)
  const [cur, setCur] = useState(0)
  useEffect(() => {
    if (!active) return
    const t = setTimeout(() => {
      const dur = 1600
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1)
        const e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
        setCur(num * e)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, delay)
    return () => clearTimeout(t)
  }, [active, num, delay])
  return <span>{prefix}{formatNum(cur, decimals, hasCommas)}{suffix}</span>
}

const RESULTS = [
  { value: '+3.9%', label: 'Campaign-period sales lift' },
  { value: '+26%', label: 'Younger audience purchase intent' },
  { value: '+4%', label: 'Farmer-ownership association' },
  { value: '30%', label: 'YoY inbound message growth' },
]

// Eating It assets for screenshot comparison
const PORTRAIT_SHOTS = [
  '/eat-it-like-you-own-it/LOL_PaidStory_GoAheadEatTheCookies.jpg',
  '/eat-it-like-you-own-it/LOL_PaidStory_OwnYourLoveOfButter.jpg',
  '/farnborough/RTXFarnborough_TweetAirNiuginiA220GTF.png',
  '/farnborough/RTXFarnborough_TweetC390MillenniumAustria.png',
  '/farnborough/RTXFarnborough_TweetF100EnginePoland.png',
  '/eat-it-like-you-own-it/LOL_FamilyBaking_UGCPost.png',
  '/eat-it-like-you-own-it/LOL_ValentinesDay_ButterHearts_FacebookPost.png',
]

// ─────────────────────────────────────────────────────────────
// Section wrapper
// ─────────────────────────────────────────────────────────────
function CompareSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-16 px-6 border-t border-near-black/10">
      <div className="max-w-5xl mx-auto">
        <p className="font-sans text-xs uppercase tracking-[0.18em] text-near-black/30 mb-2">{title}</p>
        <div className="w-8 h-px bg-tangerine mb-10" />
        {children}
      </div>
    </section>
  )
}

function OptionLabel({ letter, name }: { letter: string; name: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="font-serif text-3xl text-near-black/20 leading-none">{letter}</span>
      <span className="font-sans text-sm text-near-black/50">{name}</span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// RESULTS BLOCK — three options
// ─────────────────────────────────────────────────────────────

// Option A: Colorful stat cards
function ResultsA() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const colors = [
    { bg: 'bg-cornflower/10', border: 'border-cornflower/20', num: 'text-cornflower' },
    { bg: 'bg-tangerine/10', border: 'border-tangerine/20', num: 'text-tangerine' },
    { bg: 'bg-banana/30', border: 'border-banana/50', num: 'text-near-black' },
    { bg: 'bg-yellow-green/15', border: 'border-yellow-green/30', num: 'text-near-black' },
  ]
  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {RESULTS.map((r, i) => (
        <div key={i} className={`${colors[i].bg} border ${colors[i].border} rounded-sm px-5 py-6`}>
          <div className={`font-serif ${colors[i].num} leading-none tabular-nums`} style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            <AnimatedNum value={r.value} delay={i * 120} active={active} />
          </div>
          <div className="font-sans text-xs text-near-black/50 uppercase tracking-widest mt-2">{r.label}</div>
        </div>
      ))}
    </div>
  )
}

// Option B: Borderless floating stats
function ResultsB() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const underlines = ['border-cornflower', 'border-tangerine', 'border-banana', 'border-yellow-green']
  return (
    <div ref={ref} className="flex flex-wrap gap-x-14 gap-y-8">
      {RESULTS.map((r, i) => (
        <div key={i} className="min-w-[100px]">
          <div className={`font-serif text-near-black leading-none tabular-nums border-b-4 ${underlines[i]} pb-2 inline-block`} style={{ fontSize: 'clamp(40px, 5vw, 68px)' }}>
            <AnimatedNum value={r.value} delay={i * 120} active={active} />
          </div>
          <div className="font-sans text-xs text-near-black/40 uppercase tracking-widest mt-3">{r.label}</div>
        </div>
      ))}
    </div>
  )
}

// Option C: Color-pop dark (keep dark bg, colorful numbers)
function ResultsC() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  const numColors = ['text-frozen-lake', 'text-tangerine', 'text-banana', 'text-yellow-green']
  return (
    <div ref={ref} className="bg-near-black rounded-sm px-8 py-10 md:py-14">
      <div className="flex flex-wrap gap-x-12 gap-y-10 justify-center md:justify-start">
        {RESULTS.map((r, i) => (
          <div key={i} className="text-center md:text-left min-w-[120px]">
            <div className={`font-serif ${numColors[i]} leading-none tabular-nums`} style={{ fontSize: 'clamp(48px, 6vw, 80px)' }}>
              <AnimatedNum value={r.value} delay={i * 120} active={active} />
            </div>
            <div className="font-sans text-xs text-off-white/50 uppercase tracking-widest mt-2">{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// SCREENSHOT LAYOUT — three options
// ─────────────────────────────────────────────────────────────

// Option A: Horizontal swipe strip
function ScreenshotsA() {
  return (
    <div
      className="flex gap-3 overflow-x-auto pb-3"
      style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
    >
      {PORTRAIT_SHOTS.map((src, i) => (
        <div
          key={i}
          className="shrink-0"
          style={{ scrollSnapAlign: 'start', width: '52vw', maxWidth: '260px' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="w-full h-auto" />
        </div>
      ))}
    </div>
  )
}

// Option B: 3-column micro grid
function ScreenshotsB() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {PORTRAIT_SHOTS.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={src} alt="" className="w-full h-auto" />
      ))}
    </div>
  )
}

// Option C: Max-height preview windows (inner scroll)
function ScreenshotsC() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {PORTRAIT_SHOTS.map((src, i) => (
        <div key={i} className="overflow-y-auto rounded-sm" style={{ maxHeight: '340px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="w-full h-auto" />
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// BODY COLOR — three options using real copy
// ─────────────────────────────────────────────────────────────

const SECTION_LABEL_COLORS: Record<string, string> = {
  Context: 'bg-cornflower',
  Challenge: 'bg-tangerine',
  Insight: 'bg-banana',
  Role: 'bg-yellow-green',
  Execution: 'bg-frozen-lake',
  Impact: 'bg-cornflower',
}

const BODY_COPY = `The campaign helped Land O'Lakes modernize its brand expression while strengthening the connection between indulgence and its farmer-owned identity. During the live campaign period, the work contributed to a 3.9% sales lift across product lines, a 26% lift in purchase intent among younger audiences, and a 4% increase in association with farmer-ownership.

Social also helped extend the campaign beyond its hero assets, generating 2.6 million GIPHY views and creating more opportunities for consumers to engage with the brand in everyday moments.`

// Option A: Inline phrase highlights only
function BodyA() {
  return (
    <div className="space-y-14">
      {[
        { label: 'Context', text: `Timed to Land O'Lakes' 100th anniversary, "Eat It Like You Own It" introduced a bolder brand platform rooted in the company's farmer-owned co-op model. The campaign reframed indulgence as something consumers could feel good about, because every purchase supports more than 1,000 independent farmers and their communities.` },
        { label: 'Impact', text: BODY_COPY },
      ].map(({ label, text }) => (
        <div key={label} className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-x-10 gap-y-3">
          <p className="font-sans text-xs uppercase tracking-[0.15em] text-near-black/30 md:sticky md:top-28 pt-0.5">
            {label}
          </p>
          <div className="space-y-5">
            {label === 'Context' && (
              <p className="font-sans text-lg md:text-xl text-near-black/80 leading-[1.85]">
                Timed to Land O&apos;Lakes&apos; 100th anniversary,{' '}
                <mark className="bg-banana/70 px-0.5 rounded-sm not-italic">&quot;Eat It Like You Own It&quot;</mark>{' '}
                introduced a{' '}
                <span className="border-b-2 border-tangerine">bolder brand platform</span>{' '}
                rooted in the company&apos;s farmer-owned co-op model. The campaign reframed indulgence as something consumers could feel good about, because every purchase supports more than{' '}
                <mark className="bg-banana/70 px-0.5 rounded-sm not-italic">1,000 independent farmers</mark>{' '}
                and their communities.
              </p>
            )}
            {label === 'Impact' && (
              <>
                <p className="font-sans text-lg md:text-xl text-near-black/80 leading-[1.85]">
                  The campaign helped Land O&apos;Lakes modernize its brand expression while strengthening the connection between{' '}
                  <mark className="bg-banana/70 px-0.5 rounded-sm not-italic">indulgence and its farmer-owned identity.</mark>{' '}
                  During the live campaign period, the work contributed to a{' '}
                  <span className="border-b-2 border-tangerine font-medium">3.9% sales lift</span>{' '}
                  across product lines, a{' '}
                  <span className="bg-frozen-lake/40 px-1 rounded-sm font-medium">26% lift in purchase intent</span>{' '}
                  among younger audiences, and a 4% increase in association with farmer-ownership.
                </p>
                <p className="font-sans text-lg md:text-xl text-near-black/80 leading-[1.85]">
                  Social also helped extend the campaign beyond its hero assets, generating{' '}
                  <mark className="bg-banana/70 px-0.5 rounded-sm not-italic">2.6 million GIPHY views</mark>{' '}
                  and creating more opportunities for consumers to engage with the brand in everyday moments.
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// Option B: Structural color accents on section labels, tags as colored chips
function BodyB() {
  return (
    <div className="space-y-14">
      {/* Tags row — colored chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Brand Campaign', color: 'bg-cornflower/10 border-cornflower/30 text-cornflower' },
          { label: 'Social Media Strategy', color: 'bg-tangerine/10 border-tangerine/30 text-tangerine' },
          { label: 'Paid & Organic', color: 'bg-banana/40 border-banana text-near-black' },
        ].map(({ label, color }) => (
          <span key={label} className={`font-sans text-xs px-3 py-1 rounded-full border ${color}`}>{label}</span>
        ))}
      </div>

      {[
        { label: 'Context', text: `Timed to Land O'Lakes' 100th anniversary, "Eat It Like You Own It" introduced a bolder brand platform rooted in the company's farmer-owned co-op model.` },
        { label: 'Impact', text: BODY_COPY },
      ].map(({ label, text }) => (
        <div key={label} className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-x-10 gap-y-3">
          <div className="flex items-start gap-2 md:sticky md:top-28 pt-0.5">
            <span className={`shrink-0 w-1 h-4 rounded-full mt-0.5 ${SECTION_LABEL_COLORS[label]}`} />
            <p className="font-sans text-xs uppercase tracking-[0.15em] text-near-black/50">{label}</p>
          </div>
          <div className="space-y-5">
            {text.split('\n\n').map((p, i) => (
              <p key={i} className="font-sans text-lg md:text-xl text-near-black/80 leading-[1.85]">{p}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Option A+B: Both highlights + colored structural accents
function BodyAB() {
  return (
    <div className="space-y-14">
      {/* Tags as colored chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Brand Campaign', color: 'bg-cornflower/10 border-cornflower/30 text-cornflower' },
          { label: 'Social Media Strategy', color: 'bg-tangerine/10 border-tangerine/30 text-tangerine' },
          { label: 'Paid & Organic', color: 'bg-banana/40 border-banana text-near-black' },
        ].map(({ label, color }) => (
          <span key={label} className={`font-sans text-xs px-3 py-1 rounded-full border ${color}`}>{label}</span>
        ))}
      </div>

      {[
        { label: 'Context', isContext: true },
        { label: 'Impact', isContext: false },
      ].map(({ label, isContext }) => (
        <div key={label} className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-x-10 gap-y-3">
          <div className="flex items-start gap-2 md:sticky md:top-28 pt-0.5">
            <span className={`shrink-0 w-1 h-4 rounded-full mt-0.5 ${SECTION_LABEL_COLORS[label]}`} />
            <p className="font-sans text-xs uppercase tracking-[0.15em] text-near-black/50">{label}</p>
          </div>
          <div className="space-y-5">
            {isContext ? (
              <p className="font-sans text-lg md:text-xl text-near-black/80 leading-[1.85]">
                Timed to Land O&apos;Lakes&apos; 100th anniversary,{' '}
                <mark className="bg-banana/70 px-0.5 rounded-sm not-italic">&quot;Eat It Like You Own It&quot;</mark>{' '}
                introduced a{' '}
                <span className="border-b-2 border-tangerine">bolder brand platform</span>{' '}
                rooted in the company&apos;s farmer-owned co-op model. The campaign reframed indulgence as something consumers could feel good about, because every purchase supports more than{' '}
                <mark className="bg-banana/70 px-0.5 rounded-sm not-italic">1,000 independent farmers</mark>{' '}
                and their communities.
              </p>
            ) : (
              <>
                <p className="font-sans text-lg md:text-xl text-near-black/80 leading-[1.85]">
                  The campaign helped Land O&apos;Lakes modernize its brand expression while strengthening the connection between{' '}
                  <mark className="bg-banana/70 px-0.5 rounded-sm not-italic">indulgence and its farmer-owned identity.</mark>{' '}
                  During the live campaign period, the work contributed to a{' '}
                  <span className="border-b-2 border-tangerine font-medium">3.9% sales lift</span>{' '}
                  across product lines, a{' '}
                  <span className="bg-frozen-lake/40 px-1 rounded-sm font-medium">26% lift in purchase intent</span>{' '}
                  among younger audiences, and a 4% increase in association with farmer-ownership.
                </p>
                <p className="font-sans text-lg md:text-xl text-near-black/80 leading-[1.85]">
                  Social also helped extend the campaign beyond its hero assets, generating{' '}
                  <mark className="bg-banana/70 px-0.5 rounded-sm not-italic">2.6 million GIPHY views</mark>{' '}
                  and creating more opportunities for consumers to engage with the brand in everyday moments.
                </p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FARNBOROUGH PORTRAIT GRID — three options
// ─────────────────────────────────────────────────────────────

const FARN_VIDEOS = [
  '/farnborough/RTXFarnborough_LinkedInFarnboroughRecap.mp4',
  '/farnborough/RTXFarnborough_LinkedInGTF950Orders.mp4',
  '/farnborough/RTXFarnborough_LinkedInNewsDay2.mp4',
]
const FARN_IMAGES = [
  '/farnborough/RTXFarnborough_LinkedInCTONonCO2Emissions.png',
  '/farnborough/RTXFarnborough_LinkedInCollinsNP2000Propeller.png',
  '/farnborough/RTXFarnborough_TweetAirNiuginiA220GTF.png',
  '/farnborough/RTXFarnborough_TweetC390MillenniumAustria.png',
  '/farnborough/RTXFarnborough_TweetF100EnginePoland.png',
]

function FarnVideo({ src }: { src: string }) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-auto block"
    />
  )
}

// Option A: 2-col videos + 3-col images (Mitch's proposal)
function FarnA() {
  return (
    <div className="space-y-3">
      <p className="font-sans text-xs text-near-black/30 uppercase tracking-widest mb-2">Screen recordings — 2 col</p>
      <div className="columns-2 md:columns-3" style={{ columnGap: '0.5rem' }}>
        {FARN_VIDEOS.map((src, i) => (
          <div key={i} className="break-inside-avoid mb-2"><FarnVideo src={src} /></div>
        ))}
      </div>
      <p className="font-sans text-xs text-near-black/30 uppercase tracking-widest mt-6 mb-2">Screenshots — 3 col</p>
      <div className="columns-2 md:columns-3" style={{ columnGap: '0.5rem' }}>
        {FARN_IMAGES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={i} className="break-inside-avoid mb-2"><img src={src} alt="" className="w-full h-auto" /></div>
        ))}
      </div>
    </div>
  )
}

// Option B: 2-col videos + 4-col images (more compact screenshots)
function FarnB() {
  return (
    <div className="space-y-3">
      <p className="font-sans text-xs text-near-black/30 uppercase tracking-widest mb-2">Screen recordings — 2 col</p>
      <div className="grid grid-cols-2 gap-2">
        {FARN_VIDEOS.map((src, i) => <FarnVideo key={i} src={src} />)}
      </div>
      <p className="font-sans text-xs text-near-black/30 uppercase tracking-widest mt-6 mb-2">Screenshots — 4 col</p>
      <div className="columns-2 md:columns-4" style={{ columnGap: '0.5rem' }}>
        {FARN_IMAGES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={i} className="break-inside-avoid mb-2"><img src={src} alt="" className="w-full h-auto" /></div>
        ))}
      </div>
    </div>
  )
}

// Option C: Uniform 3-col masonry for everything
function FarnC() {
  return (
    <div className="space-y-3">
      <p className="font-sans text-xs text-near-black/30 uppercase tracking-widest mb-2">Everything — uniform 3 col masonry</p>
      <div className="columns-2 md:columns-3" style={{ columnGap: '0.5rem' }}>
        {FARN_VIDEOS.map((src, i) => (
          <div key={`v${i}`} className="break-inside-avoid mb-2"><FarnVideo src={src} /></div>
        ))}
        {FARN_IMAGES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <div key={`img${i}`} className="break-inside-avoid mb-2"><img src={src} alt="" className="w-full h-auto" /></div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function OptionsPage() {
  return (
    <main className="bg-off-white min-h-screen">
      <Nav />

      {/* Page header */}
      <div className="pt-28 pb-6 px-6 border-b border-near-black/10">
        <div className="max-w-5xl mx-auto">
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-near-black/30 mb-3">Design review</p>
          <h1 className="font-serif text-4xl md:text-5xl text-near-black mb-3">Options</h1>
          <p className="font-sans text-base text-near-black/50">Pick one from each section. Real content, real assets.</p>
          {/* Jump nav */}
          <div className="flex flex-wrap gap-3 mt-6">
            {['Farnborough portrait grid', 'Results block', 'Screenshot layout', 'Body color'].map((label, i) => (
              <a
                key={label}
                href={`#section-${i}`}
                className="font-sans text-xs uppercase tracking-[0.12em] text-near-black/40 border border-near-black/15 px-3 py-1.5 rounded-full hover:border-near-black/40 hover:text-near-black/70 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── SECTION 0: Farnborough portrait grid ── */}
      <CompareSection id="section-0" title="00 — Farnborough portrait grid">
        <p className="font-sans text-sm text-near-black/40 mb-10 max-w-lg">
          Real LinkedIn screen recordings + tweet/LinkedIn screenshots. All three options collapse to 2-col on mobile.
        </p>
        <div className="space-y-14">
          <div>
            <OptionLabel letter="A" name="2-col videos · 3-col images — your proposal" />
            <FarnA />
          </div>
          <div className="pt-10 border-t border-near-black/8">
            <OptionLabel letter="B" name="2-col videos · 4-col images — more compact screenshots" />
            <FarnB />
          </div>
          <div className="pt-10 border-t border-near-black/8">
            <OptionLabel letter="C" name="Uniform 3-col masonry — same grid for everything" />
            <FarnC />
          </div>
        </div>
      </CompareSection>

      {/* ── SECTION 1: Results Block ── */}
      <CompareSection id="section-1" title="01 — Results block">
        <p className="font-sans text-sm text-near-black/40 mb-10 max-w-lg">
          Showing real metrics from Eat It Like You Own It. All three use the counting animation.
        </p>
        <div className="space-y-14">
          <div>
            <OptionLabel letter="A" name="Colorful stat cards — each metric its own brand-color card" />
            <ResultsA />
          </div>
          <div className="pt-10 border-t border-near-black/8">
            <OptionLabel letter="B" name="Borderless floating — no box, colored underlines per metric" />
            <ResultsB />
          </div>
          <div className="pt-10 border-t border-near-black/8">
            <OptionLabel letter="C" name="Color-pop dark — keep black block, numbers in brand colors" />
            <ResultsC />
          </div>
        </div>
      </CompareSection>

      {/* ── SECTION 2: Screenshot Layout ── */}
      <CompareSection id="section-2" title="02 — Screenshot / screen recording layout">
        <p className="font-sans text-sm text-near-black/40 mb-10 max-w-lg">
          Using real paid story + tweet screenshots from Eat It and Farnborough. This controls how much vertical scroll they consume.
        </p>
        <div className="space-y-14">
          <div>
            <OptionLabel letter="A" name="Horizontal swipe strip — scroll sideways, compact vertically" />
            <ScreenshotsA />
          </div>
          <div className="pt-10 border-t border-near-black/8">
            <OptionLabel letter="B" name="3-column micro grid — dense, gallery-like, minimal scroll" />
            <ScreenshotsB />
          </div>
          <div className="pt-10 border-t border-near-black/8">
            <OptionLabel letter="C" name="Max-height window — fixed container, scroll within each post" />
            <ScreenshotsC />
          </div>
        </div>
      </CompareSection>

      {/* ── SECTION 3: Body Color ── */}
      <CompareSection id="section-3" title="03 — Body text color + playfulness">
        <p className="font-sans text-sm text-near-black/40 mb-10 max-w-lg">
          Using real copy from Eat It Like You Own It (Context + Impact sections).
        </p>
        <div className="space-y-14">
          <div>
            <OptionLabel letter="A" name="Inline highlights — banana marker, tangerine underlines, frozen-lake chips on key phrases" />
            <BodyA />
          </div>
          <div className="pt-10 border-t border-near-black/8">
            <OptionLabel letter="B" name="Structural color — colored dot per section label, tags as colored pills" />
            <BodyB />
          </div>
          <div className="pt-10 border-t border-near-black/8">
            <OptionLabel letter="A+B" name="Both — colored structural accents + inline phrase highlights" />
            <BodyAB />
          </div>
        </div>
      </CompareSection>

      <div className="h-20" />
    </main>
  )
}
