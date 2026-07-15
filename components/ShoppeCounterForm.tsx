'use client'

import { upload } from '@vercel/blob/client'
import { FormEvent, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Location = { id: string; display_name: string; address: string }
type MapResult = { displayName: string; address: string; latitude: number; longitude: number }

const MAX_FILES = 4
const MAX_IMAGE_BYTES = 12 * 1024 * 1024
const fieldClass = 'w-full min-w-0 max-w-full rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal text-base'

function safeFilename(name: string) {
  const extension = name.split('.').pop()?.toLowerCase() || 'jpg'
  return `photo.${extension.replace(/[^a-z0-9]/g, '') || 'jpg'}`
}

export default function ShoppeCounterForm({ ownerId, locations }: { ownerId: string; locations: Location[] }) {
  const [kind, setKind] = useState<'rating' | 'pint'>('rating')
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [shopQuery, setShopQuery] = useState('')
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const [newShop, setNewShop] = useState(false)
  const [addressQuery, setAddressQuery] = useState('')
  const [mapResults, setMapResults] = useState<MapResult[]>([])
  const [selectedMapResult, setSelectedMapResult] = useState<MapResult | null>(null)
  const [locationConfirmed, setLocationConfirmed] = useState(false)
  const [searchingMap, setSearchingMap] = useState(false)
  const [savingLocation, setSavingLocation] = useState(false)
  const selectedLocation = useMemo(() => locations.find((location) => location.id === selectedLocationId), [locations, selectedLocationId])
  const matches = useMemo(() => {
    const query = shopQuery.trim().toLocaleLowerCase()
    if (!query || newShop) return []
    return locations.filter((location) => `${location.display_name} ${location.address}`.toLocaleLowerCase().includes(query)).slice(0, 5)
  }, [locations, newShop, shopQuery])

  async function submit(event: FormEvent<HTMLFormElement>, targetStatus: 'draft' | 'ready_for_review') {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSubmitting(true)
    setStatus('Creating a private draft…')

    const supabase = createClient()
    const common = { owner_id: ownerId, kind, status: 'draft' as const, notes: String(form.get('notes') || '').trim() || null, image_urls: [] }
    const isRating = kind === 'rating'
    const payload = {
      ...common,
      shop_display_name: isRating ? (selectedLocation?.display_name ?? (shopQuery.trim() || null)) : null,
      canonical_location_id: isRating ? selectedLocationId || null : null,
      flavor_or_item: isRating ? String(form.get('flavor_or_item') || '').trim() || null : null,
      score: isRating && form.get('score') ? Number(form.get('score')) : null,
      tasted_at: isRating ? String(form.get('tasted_at') || '').trim() || null : null,
      price_amount: isRating && form.get('price_amount') ? Number(form.get('price_amount')) : null,
      price_currency: isRating && form.get('price_amount') ? String(form.get('price_currency') || 'USD') : null,
      pint_name: isRating ? null : String(form.get('pint_name') || '').trim() || null,
      base_or_description: isRating ? null : String(form.get('base_or_description') || '').trim() || null,
      mix_ins: isRating ? [] : String(form.get('mix_ins') || '').split(',').map((value) => value.trim()).filter(Boolean),
    }
    const { data: draft, error: draftError } = await supabase.from('shoppe_submissions').insert(payload).select('id').single()
    if (draftError || !draft) { setStatus(draftError?.message ?? 'Unable to create a private draft.'); setSubmitting(false); return }

    try {
      const imageUrls = await Promise.all(files.map(async (file) => {
        const result = await upload(`ice-cream/counter/${draft.id}/${safeFilename(file.name)}`, file, { access: 'public', contentType: file.type, clientPayload: draft.id, handleUploadUrl: '/api/shoppe/upload' })
        return result.url
      }))
      setStatus(targetStatus === 'draft' ? 'Saving your draft…' : 'Checking the entry for review…')
      const { error: updateError } = await supabase.from('shoppe_submissions').update({ ...payload, image_urls: imageUrls, status: targetStatus }).eq('id', draft.id)
      if (updateError) throw updateError
      event.currentTarget.reset(); setFiles([]); resetRatingLocation()
      setStatus(targetStatus === 'draft' ? 'Draft saved. You can return to finish it later.' : 'Ready for review. It is not public yet.')
    } catch (error) {
      setStatus(error instanceof Error ? `Saved as a draft, but blocked: ${error.message}` : 'Saved as a draft, but the final check was blocked.')
    } finally { setSubmitting(false) }
  }

  function resetRatingLocation() {
    setShopQuery(''); setSelectedLocationId(''); setNewShop(false); setAddressQuery(''); setMapResults([]); setSelectedMapResult(null); setLocationConfirmed(false)
  }

  function chooseExisting(location: Location) {
    setSelectedLocationId(location.id); setShopQuery(location.display_name); setNewShop(false); setMapResults([]); setSelectedMapResult(null); setLocationConfirmed(false)
  }

  async function searchMap() {
    if (!shopQuery.trim() || !addressQuery.trim()) { setStatus('Enter the shop name and its full address first.'); return }
    setSearchingMap(true); setStatus('Looking up the storefront…'); setSelectedMapResult(null); setLocationConfirmed(false)
    try {
      const response = await fetch(`/api/shoppe/location-search?q=${encodeURIComponent(`${shopQuery} ${addressQuery}`)}`)
      const result = await response.json() as { results?: MapResult[]; error?: string }
      if (!response.ok) throw new Error(result.error || 'The map lookup did not return a result.')
      setMapResults(result.results ?? []); setStatus(result.results?.length ? 'Choose the storefront that matches your visit.' : 'No storefront found. Check the address, then save a draft rather than submitting for review.')
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to look up that address.') } finally { setSearchingMap(false) }
  }

  async function confirmNewLocation() {
    if (!selectedMapResult || !locationConfirmed) { setStatus('Choose the map result and confirm it before continuing.'); return }
    setSavingLocation(true); setStatus('Saving the confirmed storefront…')
    try {
      const response = await fetch('/api/shoppe/location-search', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...selectedMapResult, displayName: shopQuery.trim() }) })
      const result = await response.json() as { location?: Location; error?: string }
      if (!response.ok || !result.location) throw new Error(result.error || 'Unable to save the confirmed storefront.')
      chooseExisting(result.location); setStatus('Storefront confirmed. You can now submit this rating for review.')
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Unable to save the confirmed storefront.') } finally { setSavingLocation(false) }
  }

  function handleFiles(nextFiles: FileList | null) {
    const chosen = Array.from(nextFiles ?? [])
    const error = chosen.length > MAX_FILES ? `Choose up to ${MAX_FILES} photos.` : chosen.find((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) ? 'Use a JPEG, PNG, or WebP photo so the public lightbox can display it.' : chosen.find((file) => file.size > MAX_IMAGE_BYTES) ? 'Each photo must be 12 MB or smaller.' : ''
    setFiles(error ? [] : chosen); if (error) setStatus(error)
  }

  return (
    <form className="grid min-w-0 gap-6" onSubmit={(event) => { const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null; submit(event, submitter?.dataset.intent === 'draft' ? 'draft' : 'ready_for_review') }}>
      <fieldset className="grid min-w-0 grid-cols-2 gap-2 rounded-2xl bg-[#f8ecdf] p-1" aria-label="Entry type">
        {(['rating', 'pint'] as const).map((option) => <button key={option} type="button" onClick={() => { setKind(option); setStatus('') }} aria-pressed={kind === option} className={`min-w-0 rounded-xl px-3 py-3 text-sm font-bold ${kind === option ? 'bg-[#382721] text-white shadow-sm' : 'text-[#382721]/65'}`}>{option === 'rating' ? 'New rating' : 'Made by Mitch pint'}</button>)}
      </fieldset>

      <label className="grid min-w-0 gap-2 text-sm font-bold">Photos <span className="font-normal text-[#382721]/60">Up to four JPEG, PNG, or WebP photos.</span>
        <input className="w-full min-w-0 max-w-full rounded-xl border border-dashed border-[#382721]/30 bg-[#fffaf1] p-3 font-normal text-sm" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => handleFiles(event.target.files)} />
        {files.length > 0 && <span className="font-normal text-[#382721]/70">{files.length} photo{files.length === 1 ? '' : 's'} ready to upload.</span>}
      </label>

      {kind === 'rating' ? <div className="grid min-w-0 gap-4">
        <div className="grid min-w-0 gap-2 text-sm font-bold">
          <label htmlFor="shop-search">Ice cream shop</label>
          <input id="shop-search" value={shopQuery} onChange={(event) => { setShopQuery(event.target.value); setSelectedLocationId(''); setNewShop(false) }} className={fieldClass} placeholder="Start typing a shop name" autoComplete="off" />
          {selectedLocation && <div className="rounded-xl bg-[#e7f3eb] px-4 py-3 text-sm font-normal text-[#235437]"><strong>{selectedLocation.display_name}</strong><br />{selectedLocation.address}</div>}
          {!selectedLocation && matches.length > 0 && <div className="overflow-hidden rounded-xl border border-[#382721]/15 bg-white font-normal shadow-sm">{matches.map((location) => <button key={location.id} type="button" onClick={() => chooseExisting(location)} className="block w-full border-b border-[#382721]/10 px-4 py-3 text-left text-sm last:border-0 hover:bg-[#fff8e8]"><strong>{location.display_name}</strong><span className="mt-1 block text-[#382721]/65">{location.address}</span></button>)}</div>}
          {!selectedLocation && <button type="button" onClick={() => { setNewShop(true); setMapResults([]); setStatus('') }} className="w-fit text-sm font-bold text-[#d84e72] underline underline-offset-4">Can’t find it? Add a new storefront</button>}
        </div>

        {newShop && !selectedLocation && <div className="grid min-w-0 gap-3 rounded-2xl border border-[#d84e72]/25 bg-[#fff7f8] p-4">
          <p className="text-sm leading-6 text-[#382721]/75">Enter the full street address, then confirm the result shown on the map. This creates the Shoppe’s map pin—not the photo’s GPS location.</p>
          <label className="grid gap-2 text-sm font-bold">Full storefront address
            <input value={addressQuery} onChange={(event) => setAddressQuery(event.target.value)} className={fieldClass} placeholder="123 Main St, City, State" autoComplete="street-address" />
          </label>
          <button type="button" onClick={searchMap} disabled={searchingMap} className="w-full rounded-full border border-[#382721]/25 px-5 py-3 font-bold disabled:opacity-60">{searchingMap ? 'Looking up…' : 'Find it on the map'}</button>
          {mapResults.length > 0 && <div className="grid gap-2">{mapResults.map((result) => <button key={`${result.latitude}-${result.longitude}`} type="button" onClick={() => { setSelectedMapResult(result); setLocationConfirmed(false) }} className={`w-full rounded-xl border px-4 py-3 text-left text-sm ${selectedMapResult === result ? 'border-[#d84e72] bg-white' : 'border-[#382721]/15 bg-white'}`}><strong>{result.displayName}</strong><span className="mt-1 block text-[#382721]/65">{result.address}</span></button>)}</div>}
          {selectedMapResult && <><a className="w-fit text-sm font-bold text-[#d84e72] underline underline-offset-4" href={`https://www.google.com/maps/search/?api=1&query=${selectedMapResult.latitude},${selectedMapResult.longitude}`} target="_blank" rel="noreferrer">Open this pin in Maps ↗</a><label className="flex gap-3 text-sm font-normal leading-5"><input type="checkbox" checked={locationConfirmed} onChange={(event) => setLocationConfirmed(event.target.checked)} className="mt-1 size-4 shrink-0" />I confirmed this is the exact storefront I visited.</label><button type="button" onClick={confirmNewLocation} disabled={!locationConfirmed || savingLocation} className="w-full rounded-full bg-[#382721] px-5 py-3 font-bold text-white disabled:opacity-50">{savingLocation ? 'Saving storefront…' : 'Use confirmed storefront'}</button></>}
        </div>}

        <label className="grid gap-2 text-sm font-bold">What did you order?<input name="flavor_or_item" className={fieldClass} placeholder="Flavor, sundae, shake…" /></label>
        <div className="grid min-w-0 grid-cols-2 gap-3"><label className="grid min-w-0 gap-2 text-sm font-bold">Score<input name="score" type="number" min="0" max="10" step="0.1" className={fieldClass} placeholder="8.5" /></label><label className="grid min-w-0 gap-2 text-sm font-bold">Tasting date<input name="tasted_at" type="date" className={fieldClass} /></label></div>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_5.5rem] gap-3"><label className="grid min-w-0 gap-2 text-sm font-bold">Price <span className="font-normal text-[#382721]/60">Optional</span><input name="price_amount" type="number" min="0" step="0.01" className={fieldClass} placeholder="6.50" /></label><label className="grid min-w-0 gap-2 text-sm font-bold">Currency<select name="price_currency" defaultValue="USD" className={fieldClass}><option>USD</option><option>MXN</option></select></label></div>
      </div> : <div className="grid min-w-0 gap-4">
        <label className="grid gap-2 text-sm font-bold">Pint name<input name="pint_name" className={fieldClass} placeholder="Pumpkin Pie" /></label>
        <label className="grid gap-2 text-sm font-bold">Base or short description<textarea name="base_or_description" rows={3} className={fieldClass} placeholder="Pumpkin ice cream with a caramel swirl" /></label>
        <label className="grid gap-2 text-sm font-bold">Mix-ins <span className="font-normal text-[#382721]/60">Optional, comma-separated</span><input name="mix_ins" className={fieldClass} placeholder="Caramel swirl, graham cracker" /></label>
      </div>}

      <label className="grid min-w-0 gap-2 text-sm font-bold">Note <span className="font-normal text-[#382721]/60">Optional</span><textarea name="notes" rows={3} className={fieldClass} placeholder="Anything worth remembering?" /></label>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2"><button type="submit" data-intent="draft" disabled={submitting} className="w-full rounded-full border border-[#382721]/25 px-5 py-3 font-bold disabled:opacity-60">Save draft</button><button type="submit" data-intent="review" disabled={submitting} className="w-full rounded-full bg-[#d84e72] px-5 py-3 font-bold text-white disabled:opacity-60">{submitting ? 'Saving…' : 'Submit for review'}</button></div>
      <p className="rounded-xl bg-[#f8ecdf] p-4 text-sm leading-6 text-[#382721]/75">Review is blocked until a rating has a confirmed storefront. The Shoppe never uses photo GPS as its public map pin.</p>
      {status && <p role="status" className="text-sm font-medium leading-6 text-[#382721]">{status}</p>}
    </form>
  )
}
