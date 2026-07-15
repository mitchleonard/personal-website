import { NextResponse, type NextRequest } from 'next/server'
import { isConfiguredShoppeEditor, isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

type NominatimResult = {
  display_name?: string
  lat?: string
  lon?: string
  address?: Record<string, string | undefined>
}

function clean(value: unknown, limit = 180) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : ''
}

function displayAddress(result: NominatimResult) {
  const address = result.address ?? {}
  return [address.house_number, address.road, address.city ?? address.town ?? address.village, address.state, address.postcode, address.country]
    .filter(Boolean)
    .join(', ') || result.display_name || ''
}

async function requireEditor() {
  if (!isSupabaseConfigured()) return { error: NextResponse.json({ error: 'The private Shoppe Counter is not configured.' }, { status: 503 }) }
  const supabase = createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims
  if (!claims?.sub || !isConfiguredShoppeEditor(claims.email)) return { error: NextResponse.json({ error: 'Sign in with the approved Shoppe editor account first.' }, { status: 401 }) }
  return { supabase, userId: claims.sub }
}

export async function GET(request: NextRequest) {
  const auth = await requireEditor()
  if ('error' in auth) return auth.error

  const query = clean(request.nextUrl.searchParams.get('q'))
  if (query.length < 5) return NextResponse.json({ error: 'Enter a shop name and full address before looking it up.' }, { status: 400 })

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`, {
      headers: { 'User-Agent': 'MitchLeonardIceCreamShoppe/1.0 (+https://mitchleonard.com)' },
      next: { revalidate: 0 },
    })
    if (!response.ok) throw new Error('The map service is unavailable. Save a draft and try the lookup again later.')
    const data = await response.json() as NominatimResult[]
    const results = data.map((result) => ({
      displayName: clean(result.display_name, 240),
      address: displayAddress(result),
      latitude: Number(result.lat),
      longitude: Number(result.lon),
    })).filter((result) => result.displayName && result.address && Number.isFinite(result.latitude) && Number.isFinite(result.longitude))
    return NextResponse.json({ results })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to look up that storefront.' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireEditor()
  if ('error' in auth) return auth.error

  const body = await request.json().catch(() => ({}))
  const displayName = clean(body.displayName)
  const address = clean(body.address, 300)
  const latitude = Number(body.latitude)
  const longitude = Number(body.longitude)
  if (!displayName || !address || !Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: 'Choose a valid map result before confirming the storefront.' }, { status: 400 })
  }

  const id = `${displayName.replaceAll('|', ' ')}|${address.replaceAll('|', ' ')}`
  const normalizedName = displayName.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const { data: existing } = await auth.supabase.from('shoppe_locations').select('id, display_name, address').eq('id', id).maybeSingle()
  if (existing) return NextResponse.json({ location: existing })

  const { data: location, error } = await auth.supabase
    .from('shoppe_locations')
    .insert({ id, display_name: displayName, normalized_name: normalizedName, address, latitude, longitude, is_verified: true, created_by: auth.userId })
    .select('id, display_name, address')
    .single()
  if (error || !location) return NextResponse.json({ error: error?.message ?? 'Unable to save the confirmed storefront.' }, { status: 400 })
  return NextResponse.json({ location })
}
