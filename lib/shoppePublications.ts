import type { HomemadePint, IceCreamRating } from '@/data/iceCream'

type PublicationRow = {
  submission_id: string
  kind: 'rating' | 'pint'
  shop_display_name: string | null
  flavor_or_item: string | null
  score: number | string | null
  tasted_at: string | null
  price_amount: number | string | null
  price_currency: string | null
  pint_name: string | null
  made_at: string | null
  description: string | null
  notes: string | null
  image_urls: unknown
  location_label: string | null
  location_address: string | null
  location_city: string | null
  location_region: string | null
  latitude: number | string | null
  longitude: number | string | null
}

type LiveShoppeEntries = {
  ratings: IceCreamRating[]
  homemade: HomemadePint[]
}

const emptyEntries: LiveShoppeEntries = { ratings: [], homemade: [] }

function numberOrUndefined(value: number | string | null) {
  if (value === null) return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

function imageUrls(value: unknown) {
  return Array.isArray(value) ? value.filter((url): url is string => typeof url === 'string') : []
}

function priceNote(amount: number | undefined, currency: string | null) {
  if (amount === undefined) return null
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${currency || ''}`.trim()
  }
}

async function loadPublicationRows(): Promise<PublicationRow[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!baseUrl || !publishableKey) return []

  const endpoint = new URL('/rest/v1/shoppe_publications', baseUrl)
  endpoint.search = new URLSearchParams({
    select: 'submission_id, kind, shop_display_name, flavor_or_item, score, tasted_at, price_amount, price_currency, pint_name, made_at, description, notes, image_urls, location_label, location_address, location_city, location_region, latitude, longitude',
    order: 'published_at.desc',
  }).toString()

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${publishableKey}`,
      },
    })
    if (!response.ok) {
      console.error('Unable to load published Shoppe entries:', response.status, await response.text())
      return []
    }
    const data: unknown = await response.json()
    return Array.isArray(data) ? data as PublicationRow[] : []
  } catch (error) {
    console.error('Unable to load published Shoppe entries:', error)
    return []
  }
}

export async function getLiveShoppeEntries(): Promise<LiveShoppeEntries> {
  const rows = await loadPublicationRows()
  if (!rows.length) return emptyEntries
  const ratings: IceCreamRating[] = []
  const homemade: HomemadePint[] = []

  for (const row of rows) {
    const urls = imageUrls(row.image_urls)
    if (row.kind === 'rating') {
      const score = numberOrUndefined(row.score)
      if (!row.flavor_or_item || score === undefined || !row.tasted_at || !row.shop_display_name) continue
      const price = priceNote(numberOrUndefined(row.price_amount), row.price_currency)
      ratings.push({
        id: `live-${row.submission_id}`,
        slug: `live-${row.submission_id}`,
        shop: row.shop_display_name,
        flavor: row.flavor_or_item,
        score,
        scoreScale: 10,
        triedAt: row.tasted_at,
        notes: [price, row.notes].filter(Boolean).join(' · ') || undefined,
        image: urls[0] ? { src: urls[0], alt: `${row.flavor_or_item} at ${row.shop_display_name}` } : undefined,
        location: {
          label: row.location_label || row.shop_display_name,
          address: row.location_address || undefined,
          city: row.location_city || undefined,
          region: row.location_region || undefined,
          latitude: numberOrUndefined(row.latitude),
          longitude: numberOrUndefined(row.longitude),
        },
        status: 'published',
      })
      continue
    }

    if (!row.pint_name || !row.made_at || !row.description) continue
    homemade.push({
      id: `live-${row.submission_id}`,
      slug: `live-${row.submission_id}`,
      name: row.pint_name,
      madeAt: row.made_at,
      base: row.description,
      mixIns: [],
      description: row.description,
      wouldMakeAgain: true,
      images: urls.map((src, index) => ({ src, alt: `${row.pint_name}, photo ${index + 1}` })),
    })
  }

  return { ratings, homemade }
}
