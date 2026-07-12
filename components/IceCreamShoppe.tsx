'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { HomemadePint, IceCreamRating } from '@/data/iceCream'
import { useIceCreamMode } from '@/lib/useIceCreamMode'

type SortMode = 'recent' | 'top' | 'shop'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}

function formatLocation(rating: IceCreamRating) {
  const place = [rating.location.city, rating.location.region].filter(Boolean).join(', ')
  return place || (rating.location.latitude != null ? 'GPS-tagged tasting' : 'Location pending')
}

function RatingCard({ rating, rank }: { rating: IceCreamRating; rank?: number }) {
  return (
    <article className="scoop-card">
      <div className="scoop-card__visual" aria-hidden="true">
        {rating.image ? <Image src={rating.image.src} alt="" fill unoptimized sizes="(max-width: 700px) 100vw, 24vw" className="scoop-card__image" /> : <span>{rating.flavor.slice(0, 1)}</span>}
        {rank && <strong>#{rank}</strong>}
      </div>
      <div className="scoop-card__body">
        <div className="scoop-card__meta">
          <span>{formatDate(rating.triedAt)}</span>
          <span>{formatLocation(rating)}</span>
        </div>
        <h3>{rating.flavor}</h3>
        <p className="scoop-card__shop">{rating.shop}</p>
        {rating.notes && <p className="scoop-card__notes">“{rating.notes}”</p>}
        <div className="scoop-card__score"><strong>{rating.score.toFixed(1)}</strong><span>/10</span></div>
      </div>
    </article>
  )
}

function LocationPlot({ ratings }: { ratings: IceCreamRating[] }) {
  const points = ratings.filter((rating) => rating.location.latitude != null && rating.location.longitude != null)
  const lats = points.map((rating) => rating.location.latitude as number)
  const lons = points.map((rating) => rating.location.longitude as number)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLon = Math.min(...lons)
  const maxLon = Math.max(...lons)
  const positionFor = (rating: IceCreamRating) => ({
    left: `${12 + (((rating.location.longitude as number) - minLon) / (maxLon - minLon || 1)) * 76}%`,
    top: `${12 + ((maxLat - (rating.location.latitude as number)) / (maxLat - minLat || 1)) * 76}%`,
  })
  return (
    <div className="shoppe-map" role="img" aria-label={`Map field showing ${points.length} GPS-tagged ice cream ratings.`}>
      <div className="shoppe-map__grid" />
      {points.map((rating) => <span key={rating.id} className="shoppe-map__pin" style={positionFor(rating)} title={rating.location.label}><i>•</i></span>)}
    </div>
  )
}

export default function IceCreamShoppe({ ratings, homemade, expectedRatings, isDemo }: {
  ratings: IceCreamRating[]
  homemade: HomemadePint[]
  expectedRatings: number
  isDemo: boolean
}) {
  const [sort, setSort] = useState<SortMode>('recent')
  const [isIceCreamMode, toggleIceCreamMode] = useIceCreamMode()
  const geotagged = ratings.filter((rating) => rating.location.latitude != null && rating.location.longitude != null)
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
          <p className="shoppe-lede">A very serious archive about a very joyful subject: every scoop I’ve rated around the country, plus the pints coming out of my own kitchen.</p>
          <div className="shoppe-hero__actions">
            <a href="#the-case" className="shoppe-button">Browse the case</a>
            {!isIceCreamMode && <button type="button" className="shoppe-text-button" onClick={toggleIceCreamMode}>Keep Ice Cream Mode on everywhere</button>}
            {isIceCreamMode && <span className="shoppe-mode-confirmation">🍦 Ice Cream Mode travels with you</span>}
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
          {sorted.map((rating, index) => <RatingCard key={rating.id} rating={rating} rank={sort === 'top' ? index + 1 : undefined} />)}
        </div>
      </section>

      <section className="shoppe-section shoppe-map-section">
        <div className="shoppe-section__heading">
          <div><p className="shoppe-kicker">The scoop map</p><h2>Worth the trip.</h2></div>
          <p>Every point comes from the original photo metadata. The field follows the collection from Minneapolis to the road-trip scoops in between.</p>
        </div>
        <LocationPlot ratings={ratings} />
        <ul className="location-list" aria-label="GPS-tagged shops">
          {Array.from(new Set(geotagged.map((rating) => rating.location.label))).slice(0, 12).map((location) => <li key={location}>{location}</li>)}
          {geotagged.length > 12 && <li>+ {geotagged.length - 12} more</li>}
        </ul>
      </section>

      <section className="shoppe-section homemade-section">
        <div className="shoppe-section__heading">
          <div><p className="shoppe-kicker">Made by Mitch</p><h2>From the pint lab.</h2></div>
          <p>Separate from the rankings, because making ice cream is its own kind of experiment.</p>
        </div>
        <div className="pint-grid">
          {homemade.map((pint, index) => (
            <article className="pint-card" key={pint.id}>
              <div className={`pint-lid pint-lid--${index % 3}`}><span>Batch<br />{String(index + 1).padStart(2, '0')}</span></div>
              <div><p>{formatDate(pint.madeAt)}</p><h3>{pint.name}</h3><span>{pint.base} · {pint.mixIns.join(' + ')}</span><p>{pint.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <footer className="shoppe-footer">
        <p>One scoop at a time since 2020.</p>
        <Link href="/">Return to the portfolio →</Link>
      </footer>
    </main>
  )
}
