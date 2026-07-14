'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export type LightboxImage = {
  src: string
  alt: string
}

export default function IceCreamImageLightbox({ images, initialIndex, title, onClose }: {
  images: LightboxImage[]
  initialIndex: number
  title: string
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const image = images[index]
  const hasGallery = images.length > 1

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (hasGallery && event.key === 'ArrowRight') setIndex((current) => (current + 1) % images.length)
      if (hasGallery && event.key === 'ArrowLeft') setIndex((current) => (current - 1 + images.length) % images.length)
    }
    document.addEventListener('keydown', onKeyDown)
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
    }
  }, [hasGallery, images.length, onClose])

  return (
    <div className="ice-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="ice-lightbox__dialog" role="dialog" aria-modal="true" aria-label={`${title} image viewer`}>
        <button type="button" className="ice-lightbox__close" onClick={onClose} aria-label="Close image viewer">×</button>
        <div className="ice-lightbox__image-wrap">
          <Image src={image.src} alt={image.alt} width={1600} height={1600} unoptimized className="ice-lightbox__image" sizes="(max-width: 900px) 94vw, 78vw" />
        </div>
        <div className="ice-lightbox__footer">
          <div><p>{title}</p>{hasGallery && <span>{index + 1} of {images.length}</span>}</div>
          {hasGallery && <div className="ice-lightbox__controls">
            <button type="button" onClick={() => setIndex((current) => (current - 1 + images.length) % images.length)} aria-label="Previous photo">←</button>
            <button type="button" onClick={() => setIndex((current) => (current + 1) % images.length)} aria-label="Next photo">→</button>
          </div>}
        </div>
      </section>
    </div>
  )
}
