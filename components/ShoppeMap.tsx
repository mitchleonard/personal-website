'use client'

import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import type { IceCreamRating } from '@/data/iceCream'
import storefrontLocations from '@/data/iceCream.mapLocations.json'

type MapPoint = {
  id: string
  label: string
  address: string
  latitude: number
  longitude: number
  ratings: IceCreamRating[]
}

type StorefrontLocation = Omit<MapPoint, 'ratings'> & { source: 'location-research' }

const storefronts = storefrontLocations as Record<string, StorefrontLocation>

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}

function mapPoints(ratings: IceCreamRating[]) {
  const groups = new Map<string, { location: StorefrontLocation, ratings: IceCreamRating[] }>()

  for (const rating of ratings) {
    const location = storefronts[rating.id] ?? (
      rating.location.latitude !== undefined && rating.location.longitude !== undefined
        ? {
            id: rating.location.label,
            label: rating.location.label,
            address: rating.location.address || [rating.location.city, rating.location.region].filter(Boolean).join(', '),
            latitude: rating.location.latitude,
            longitude: rating.location.longitude,
            source: 'location-research' as const,
          }
        : undefined
    )
    if (!location) continue
    const group = groups.get(location.id) ?? { location, ratings: [] }
    group.ratings.push(rating)
    groups.set(location.id, group)
  }

  return Array.from(groups.values(), ({ location, ratings: groupedRatings }) => ({ ...location, ratings: groupedRatings }))
    .sort((a, b) => b.ratings.length - a.ratings.length || a.label.localeCompare(b.label))
}

function pointSummary(point: MapPoint) {
  const latest = [...point.ratings].sort((a, b) => b.triedAt.localeCompare(a.triedAt))[0]
  const average = point.ratings.reduce((sum, rating) => sum + rating.score, 0) / point.ratings.length
  const flavors = [...point.ratings]
    .sort((a, b) => b.score - a.score || b.triedAt.localeCompare(a.triedAt))
    .slice(0, 3)
    .map((rating) => rating.flavor)

  return { latest, average, flavors }
}

export default function ShoppeMap({ ratings }: { ratings: IceCreamRating[] }) {
  const points = useMemo(() => mapPoints(ratings), [ratings])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = points.find((point) => point.id === selectedId)

  return (
    <div className="shoppe-map-shell">
      <div className="shoppe-map__toolbar">
        <p><strong>{ratings.length}</strong> ratings across {points.length} shop locations</p>
        <p>Every rating is included. Tap a cherry to see what I ordered.</p>
      </div>
      <div className="shoppe-map" aria-label={`Interactive map with ${ratings.length} ice cream ratings across ${points.length} destinations.`}>
        <MapContainer center={[39.4, -96.2]} zoom={4} minZoom={3} maxZoom={18} zoomSnap={0.25} zoomDelta={0.5} scrollWheelZoom touchZoom="center" doubleClickZoom className="shoppe-leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((point) => {
            const { average, flavors, latest } = pointSummary(point)
            const isSelected = point.id === selectedId
            return (
              <CircleMarker
                key={point.id}
                center={[point.latitude, point.longitude]}
                radius={isSelected ? 10 : Math.min(9, 5 + Math.log2(point.ratings.length))}
                pathOptions={{ color: '#fff8ef', fillColor: '#d84e72', fillOpacity: 1, weight: isSelected ? 4 : 2 }}
                eventHandlers={{ click: () => setSelectedId(point.id) }}
              >
                <Popup>
                  <article className="shoppe-map-popup">
                    <p className="shoppe-map-popup__eyebrow">{point.ratings.length} {point.ratings.length === 1 ? 'rating' : 'ratings'} · {average.toFixed(1)}/10</p>
                    <h3>{point.label}</h3>
                    <p>{flavors.join(' · ')}</p>
                    <p className="shoppe-map-popup__address">{point.address}</p>
                    <div className="shoppe-map-popup__footer">
                      <span>Latest: {formatDate(latest.triedAt)}</span>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(point.address)}`} target="_blank" rel="noreferrer">Directions ↗</a>
                    </div>
                  </article>
                </Popup>
              </CircleMarker>
            )
          })}
        </MapContainer>
      </div>
      {selected && (
        <p className="shoppe-map__selection" aria-live="polite">
          <strong>{selected.label}</strong> has {selected.ratings.length} {selected.ratings.length === 1 ? 'rating' : 'ratings'} in the archive.
        </p>
      )}
    </div>
  )
}
