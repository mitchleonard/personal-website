'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import type { HomemadePint, IceCreamRating } from '@/data/iceCream'
import { useIceCreamMode } from '@/lib/useIceCreamMode'
import IceCreamToggle from './IceCreamToggle'
import IceCreamImageLightbox, { type LightboxImage } from './IceCreamImageLightbox'

type SortMode = 'recent' | 'top' | 'shop'

const ShoppeMap = dynamic(() => import('./ShoppeMap'), {
  ssr: false,
  loading: () => <div className="shoppe-map shoppe-map--loading" aria-label="Loading the scoop map" />,
})

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}

function ratingDetails(notes?: string) {
  const parts = notes?.split(' · ') ?? []
  return {
    price: parts.find((part) => part.startsWith('$')),
    ranking: parts.find((part) => part.startsWith('Rating #')),
  }
}

function LocationIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14s4-3.6 4-7A4 4 0 1 0 4 7c0 3.4 4 7 4 7Z" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="8" cy="7" r="1.35" fill="currentColor" /></svg>
}

function PriceIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 3.5h7.1l3.9 3.9-6.1 6.1-4.9-4.9V3.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="5.8" cy="6.5" r=".9" fill="currentColor" /></svg>
}

function RatingCard({ rating, rank, onOpenImage }: { rating: IceCreamRating; rank?: number; onOpenImage: (images: LightboxImage[], title: string) => void }) {
  const { price, ranking } = ratingDetails(rating.notes)
  const ratingNumber = ranking?.replace('Rating ', '')
  return (
    <article className="scoop-card">
      <div className="scoop-card__visual">
        {rating.image ? <button type="button" className="scoop-card__image-button" onClick={() => onOpenImage([rating.image!], `${rating.flavor} at ${rating.shop}`)} aria-label={`View full photo of ${rating.flavor} at ${rating.shop}`}><Image src={rating.image.src} alt="" fill unoptimized sizes="(max-width: 700px) 50vw, 24vw" className="scoop-card__image" /></button> : <span aria-hidden="true">{rating.flavor.slice(0, 1)}</span>}
        {rank && <strong>#{rank}</strong>}
      </div>
      <div className="scoop-card__body">
        <div className="scoop-card__meta">
          <span>{formatDate(rating.triedAt)}</span>
          {ratingNumber && <span>{ratingNumber}</span>}
        </div>
        <h3>{rating.flavor}</h3>
        <div className="scoop-card__details" aria-label="Tasting details">
          <span><LocationIcon />{rating.shop}</span>
          {price && <span><PriceIcon />{price}</span>}
        </div>
        <div className="scoop-card__score"><strong>{rating.score.toFixed(1)}</strong><span>/10</span></div>
      </div>
    </article>
  )
}

export default function IceCreamShoppe({ ratings, homemade, expectedRatings, isDemo }: {
  ratings: IceCreamRating[]
  homemade: HomemadePint[]
  expectedRatings: number
  isDemo: boolean
}) {
  const [sort, setSort] = useState<SortMode>('recent')
  const [isIceCreamMode] = useIceCreamMode()
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; title: string; initialIndex: number } | null>(null)
  const openLightbox = (images: LightboxImage[], title: string, initialIndex = 0) => setLightbox({ images, title, initialIndex })
  const sorted = useMemo(() => [...ratings].sort((a, b) => {
    if (sort === 'top') return b.score - a.score || b.triedAt.localeCompare(a.triedAt)
    if (sort === 'shop') return a.shop.localeCompare(b.shop) || b.score - a.score
    return b.triedAt.localeCompare(a.triedAt)
  }), [ratings, sort])

  return (
    <main className="shoppe-page">
      <section className="shoppe-hero">
        <div className="shoppe-awning" aria-hidden="true" />
        <div className="shoppe-hero__inner">
          <Link href="/" className="shoppe-back">← Mitch Leonard</Link>
          <p className="shoppe-kicker">Est. 2020 · Minneapolis, Minnesota</p>
          <h1>Ice Cream<br /><em>Shoppe</em></h1>
          <p className="shoppe-lede">A very serious archive of every scoop I’ve rated around the country, plus the pints coming out of my own kitchen.</p>
          <div className="shoppe-hero__actions">
            <a href="#the-case" className="shoppe-button">Browse the case</a>
            <span className="ice-mode-control">
              <IceCreamToggle />
              <span className="shoppe-mode-confirmation">{isIceCreamMode ? 'Ice Cream Mode travels with you' : 'Flip on Ice Cream Mode'}</span>
            </span>
          </div>
          <div className="shoppe-stats" aria-label="Collection statistics">
            <div><strong>{isDemo ? `${expectedRatings}+` : ratings.length}</strong><span>scoops tracked</span></div>
            <div><strong>2020</strong><span>first rating</span></div>
            <div><strong>{homemade.length}</strong><span>pints in the lab</span></div>
          </div>
        </div>
      </section>

      {isDemo && (
        <aside className="data-notice">
          <span>Preview counter</span>
          <p>The shoppe is built; these clearly marked sample scoops prove the experience while Mitch’s Apple archive is prepared for import.</p>
        </aside>
      )}

      <section id="the-case" className="shoppe-section shoppe-case">
        <div className="shoppe-section__heading">
          <div><p className="shoppe-kicker">The case</p><h2>What’s scooping?</h2></div>
          <div className="sort-control" aria-label="Sort ratings">
            {([['recent', 'Most recent'], ['top', 'Top ranked'], ['shop', 'Shop A–Z']] as const).map(([value, label]) => (
              <button key={value} type="button" aria-pressed={sort === value} onClick={() => setSort(value)}>{label}</button>
            ))}
          </div>
        </div>
        <div className="scoop-grid">
          {sorted.map((rating, index) => <RatingCard key={rating.id} rating={rating} rank={sort === 'top' ? index + 1 : undefined} onOpenImage={openLightbox} />)}
        </div>
      </section>

      <section className="shoppe-section shoppe-map-section">
        <div className="shoppe-section__heading">
          <div><p className="shoppe-kicker">The scoop map</p><h2>Worth the trip.</h2></div>
          <p>Pan and zoom through every stop from the collection. Click a cherry for the shop, its score, and a direct route.</p>
        </div>
        <ShoppeMap ratings={ratings} />
      </section>

      <section className="shoppe-section homemade-section">
        <div className="shoppe-section__heading">
          <div><p className="shoppe-kicker">Made by Mitch</p><h2>From the pint lab.</h2></div>
          <p>Separate from the rankings, because making ice cream is its own kind of experiment.</p>
        </div>
        <div className="pint-grid">
          {homemade.map((pint, index) => (
            <article className="pint-card" key={pint.id}>
              <div className={`pint-lid pint-lid--${index % 3}`}>
                {pint.images?.[0] ? <button type="button" className="pint-image-button" onClick={() => openLightbox(pint.images!, pint.name)} aria-label={`View photos of ${pint.name}`}><Image src={pint.images[0].src} alt="" fill unoptimized sizes="128px" className="pint-lid__image" /></button> : <span>Batch<br />{String(index + 1).padStart(2, '0')}</span>}
              </div>
              <div><h3>{pint.name}</h3><p>{pint.description}</p>{pint.images && pint.images.length > 1 && <div className="pint-gallery" aria-label={`${pint.name} photo gallery`}>{pint.images.slice(1).map((image, imageIndex) => <button type="button" key={image.src} className="pint-gallery__button" onClick={() => openLightbox(pint.images!, pint.name, imageIndex + 1)} aria-label={`View photo ${imageIndex + 2} of ${pint.name}`}><Image src={image.src} alt="" width={52} height={52} unoptimized className="pint-gallery__image" /></button>)}</div>}</div>
            </article>
          ))}
        </div>
      </section>

      <footer className="shoppe-footer">
        <p>One scoop at a time since 2020.</p>
        <Link href="/">Return to the portfolio →</Link>
      </footer>
      {lightbox && <IceCreamImageLightbox images={lightbox.images} initialIndex={lightbox.initialIndex} title={lightbox.title} onClose={() => setLightbox(null)} />}
    </main>
  )
}
