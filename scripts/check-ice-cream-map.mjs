import archive from '../data/iceCream.imported.json' with { type: 'json' }
import locationAliases from '../data/iceCream.mapAliases.json' with { type: 'json' }

const EXPECTED_RATINGS = 155
const ratings = archive.ratings
const canonicalLabel = (label) => locationAliases[label] ?? label
const fail = (message) => {
  throw new Error(`Ice Cream Shoppe map check failed: ${message}`)
}

if (ratings.length !== EXPECTED_RATINGS) fail(`expected ${EXPECTED_RATINGS} ratings, received ${ratings.length}`)
if (new Set(ratings.map((rating) => rating.id)).size !== ratings.length) fail('rating IDs must be unique')

const points = new Map()
for (const rating of ratings) {
  const { latitude, longitude } = rating.location
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) fail(`${rating.id} has no map coordinates`)
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) fail(`${rating.id} has invalid map coordinates`)

  const label = canonicalLabel(rating.location.label)
  const key = `${label}:${latitude.toFixed(3)}:${longitude.toFixed(3)}`
  points.set(key, [...(points.get(key) ?? []), rating])
}

const groupedRatings = [...points.values()].flat().length
if (groupedRatings !== EXPECTED_RATINGS) fail(`map groups contain ${groupedRatings} ratings instead of ${EXPECTED_RATINGS}`)

const destinationCount = (label) => [...points.entries()]
  .filter(([key]) => key.startsWith(`${label}:`))
  .reduce((sum, [, entries]) => sum + entries.length, 0)

if (destinationCount('4 Queens Dairy Treat') !== 3) fail('4 Queens Dairy Treat should contain 3 ratings')
if (destinationCount('Honey & Mackie’s') !== 7) fail('Honey & Mackie’s should contain 7 ratings')
if (destinationCount('Deadwood Ice Cream Company') !== 1) fail('Deadwood Ice Cream Company should contain 1 rating')

console.log(`Map QA passed: ${ratings.length} ratings across ${points.size} map destinations.`)
