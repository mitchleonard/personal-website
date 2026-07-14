import archive from '../data/iceCream.imported.json' with { type: 'json' }
import storefrontLocations from '../data/iceCream.mapLocations.json' with { type: 'json' }

const EXPECTED_RATINGS = 155
const ratings = archive.ratings
const fail = (message) => {
  throw new Error(`Ice Cream Shoppe map check failed: ${message}`)
}

if (ratings.length !== EXPECTED_RATINGS) fail(`expected ${EXPECTED_RATINGS} ratings, received ${ratings.length}`)
if (new Set(ratings.map((rating) => rating.id)).size !== ratings.length) fail('rating IDs must be unique')

const mappingIds = Object.keys(storefrontLocations)
if (mappingIds.length !== EXPECTED_RATINGS) fail(`expected ${EXPECTED_RATINGS} storefront mappings, received ${mappingIds.length}`)

const points = new Map()
for (const rating of ratings) {
  const location = storefrontLocations[rating.id]
  if (!location) fail(`${rating.id} has no researched storefront location`)
  const { id, label, address, latitude, longitude, source } = location
  if (!id || !label || !address || source !== 'location-research') fail(`${rating.id} has an incomplete storefront mapping`)
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) fail(`${rating.id} has invalid storefront coordinates`)
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) fail(`${rating.id} has out-of-range storefront coordinates`)
  points.set(id, [...(points.get(id) ?? []), rating])
}

const groupedRatings = [...points.values()].flat().length
if (groupedRatings !== EXPECTED_RATINGS) fail(`map groups contain ${groupedRatings} ratings instead of ${EXPECTED_RATINGS}`)

const destinationCount = (label) => [...points.entries()]
  .filter(([id]) => id.startsWith(`${label}|`))
  .reduce((sum, [, entries]) => sum + entries.length, 0)

if (destinationCount('4 Queens Dairy Cream') !== 3) fail('4 Queens Dairy Cream should contain 3 ratings')
if (destinationCount("Honey & Mackie's") !== 7) fail("Honey & Mackie's should contain 7 ratings")
if (destinationCount('Deadwood Ice Cream Company') !== 1) fail('Deadwood Ice Cream Company should contain 1 rating')
if (destinationCount('A to Z Creamery — Hopkins') !== 29) fail('A to Z Creamery — Hopkins should contain 29 ratings')
if (destinationCount('A to Z Creamery — Minnesota State Fair') !== 1) fail('A to Z Creamery — Minnesota State Fair should contain 1 rating')
if (destinationCount('MN Nice Cream — Northeast') !== 4) fail('MN Nice Cream — Northeast should contain 4 ratings')
if (destinationCount('Bebe Zito — Uptown') !== 2) fail('Bebe Zito — Uptown should contain 2 ratings')
if (destinationCount('Bebe Zito — Malcolm Yards') !== 1) fail('Bebe Zito — Malcolm Yards should contain 1 rating')

console.log(`Map QA passed: ${ratings.length} ratings across ${points.size} researched storefront destinations.`)
