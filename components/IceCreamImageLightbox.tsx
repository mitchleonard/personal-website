'use client'

import { useEffect, useState } from 'react'

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
          <img src={image.src} alt={image.alt} className="ice-lightbox__image" />
          {hasGallery && <div className="ice-lightbox__controls" aria-label={`${title} photo navigation`}>
            <button type="button" onClick={() => setIndex((current) => (current - 1 + images.length) % images.length)} aria-label="Previous photo">←</button>
            <button type="button" onClick={() => setIndex((current) => (current + 1) % images.length)} aria-label="Next photo">→</button>
          </div>}
        </div>
      </section>
    </div>
  )
}
