'use client'

import { useMemo, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import type { IceCreamRating } from '@/data/iceCream'
import locationAliases from '@/data/iceCream.mapAliases.json'

type MapPoint = {
  id: string
  label: string
  latitude: number
  longitude: number
  ratings: IceCreamRating[]
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
}

function mapPoints(ratings: IceCreamRating[]) {
  const groups = new Map<string, IceCreamRating[]>()

  for (const rating of ratings) {
    const { latitude, longitude } = rating.location
    if (latitude == null || longitude == null) continue

    // A photo can be taken a few feet from the counter on each visit. Rounding
    // keeps repeated visits at the same shop as one useful map destination.
    const label = locationAliases[rating.location.label as keyof typeof locationAliases] ?? rating.location.label
    const key = `${label}:${latitude.toFixed(3)}:${longitude.toFixed(3)}`
    groups.set(key, [...(groups.get(key) ?? []), rating])
  }

  return Array.from(groups, ([id, groupedRatings]) => {
    const latitude = groupedRatings.reduce((sum, rating) => sum + (rating.location.latitude ?? 0), 0) / groupedRatings.length
    const longitude = groupedRatings.reduce((sum, rating) => sum + (rating.location.longitude ?? 0), 0) / groupedRatings.length
    const sourceLabel = groupedRatings[0].location.label
    const label = locationAliases[sourceLabel as keyof typeof locationAliases] ?? sourceLabel
    return { id, label, latitude, longitude, ratings: groupedRatings }
  }).sort((a, b) => b.ratings.length - a.ratings.length || a.label.localeCompare(b.label))
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
        <p><strong>{ratings.length}</strong> ratings across {points.length} places</p>
        <p>Every rating is included. Tap a cherry to see what I ordered.</p>
      </div>
      <div className="shoppe-map" aria-label={`Interactive map with ${ratings.length} ice cream ratings across ${points.length} destinations.`}>
        <MapContainer center={[39.4, -96.2]} zoom={4} minZoom={3} maxZoom={18} scrollWheelZoom={false} className="shoppe-leaflet-map">
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
                    <div className="shoppe-map-popup__footer">
                      <span>Latest: {formatDate(latest.triedAt)}</span>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${point.latitude},${point.longitude}`} target="_blank" rel="noreferrer">Directions ↗</a>
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
