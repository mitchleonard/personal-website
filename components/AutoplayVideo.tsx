'use client'

import { useRef, useState, useEffect } from 'react'

interface AutoplayVideoProps {
  src: string
  silent?: boolean   // true = video has no audio track, hide sound button entirely
  className?: string
}

export default function AutoplayVideo({ src, silent = false, className = '' }: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [activeSrc, setActiveSrc] = useState<string | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSrc(src)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [src])

  const unlock = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.loop = false
    v.currentTime = 0
    v.play()
    setUnlocked(true)
  }

  return (
    <div ref={containerRef} className={`relative group ${className}`}>
      <video
        ref={videoRef}
        src={activeSrc ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        controls={unlocked}
        className="w-full"
        onClick={!unlocked && !silent ? unlock : undefined}
        style={{ cursor: unlocked || silent ? 'default' : 'pointer' }}
      />
      {!silent && !unlocked && (
        <button
          onClick={unlock}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-near-black/60 rounded-full px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm"
          aria-label="Play with sound"
        >
          <svg className="w-3.5 h-3.5 text-off-white fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="font-sans text-xs text-off-white tracking-wide">Sound</span>
        </button>
      )}
    </div>
  )
}
