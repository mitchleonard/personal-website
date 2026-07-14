'use client'

import { upload } from '@vercel/blob/client'
import { FormEvent, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Location = { id: string; display_name: string; address: string }

const MAX_FILES = 4
const MAX_IMAGE_BYTES = 12 * 1024 * 1024

function safeFilename(name: string) {
  const extension = name.split('.').pop()?.toLowerCase() || 'jpg'
  return `photo.${extension.replace(/[^a-z0-9]/g, '') || 'jpg'}`
}

export default function ShoppeCounterForm({ ownerId, locations }: { ownerId: string; locations: Location[] }) {
  const [kind, setKind] = useState<'rating' | 'pint'>('rating')
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedLocationId, setSelectedLocationId] = useState('')
  const selectedLocation = useMemo(() => locations.find((location) => location.id === selectedLocationId), [locations, selectedLocationId])

  async function submit(event: FormEvent<HTMLFormElement>, targetStatus: 'draft' | 'ready_for_review') {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSubmitting(true)
    setStatus('Creating a private draft…')

    const supabase = createClient()
    const common = {
      owner_id: ownerId,
      kind,
      status: 'draft' as const,
      notes: String(form.get('notes') || '').trim() || null,
      image_urls: [],
    }
    const isRating = kind === 'rating'
    const payload = {
      ...common,
      shop_display_name: isRating ? (selectedLocation?.display_name ?? (String(form.get('shop_display_name') || '').trim() || null)) : null,
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

    const { data: draft, error: draftError } = await supabase
      .from('shoppe_submissions')
      .insert(payload)
      .select('id')
      .single()

    if (draftError || !draft) {
      setStatus(draftError?.message ?? 'Unable to create a private draft.')
      setSubmitting(false)
      return
    }

    try {
      const imageUrls = await Promise.all(files.map(async (file) => {
        const result = await upload(
          `ice-cream/counter/${draft.id}/${safeFilename(file.name)}`,
          file,
          {
            access: 'public',
            contentType: file.type,
            clientPayload: draft.id,
            handleUploadUrl: '/api/shoppe/upload',
          },
        )
        return result.url
      }))

      setStatus(targetStatus === 'draft' ? 'Saving your draft…' : 'Checking the entry for review…')
      const { error: updateError } = await supabase
        .from('shoppe_submissions')
        .update({ ...payload, image_urls: imageUrls, status: targetStatus })
        .eq('id', draft.id)

      if (updateError) throw updateError
      event.currentTarget.reset()
      setFiles([])
      setSelectedLocationId('')
      setStatus(targetStatus === 'draft' ? 'Draft saved. You can return to finish it later.' : 'Ready for review. It is not public yet.')
    } catch (error) {
      setStatus(error instanceof Error ? `Saved as a draft, but blocked: ${error.message}` : 'Saved as a draft, but the final check was blocked.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleFiles(nextFiles: FileList | null) {
    const chosen = Array.from(nextFiles ?? [])
    const error = chosen.length > MAX_FILES
      ? `Choose up to ${MAX_FILES} photos.`
      : chosen.find((file) => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
        ? 'Use a JPEG, PNG, or WebP photo so the public lightbox can display it.'
        : chosen.find((file) => file.size > MAX_IMAGE_BYTES)
          ? 'Each photo must be 12 MB or smaller.'
          : ''
    setFiles(error ? [] : chosen)
    if (error) setStatus(error)
  }

  return (
    <form className="grid gap-6" onSubmit={(event) => {
      const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
      submit(event, submitter?.dataset.intent === 'draft' ? 'draft' : 'ready_for_review')
    }}>
      <fieldset className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f8ecdf] p-1" aria-label="Entry type">
        {(['rating', 'pint'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setKind(option)}
            aria-pressed={kind === option}
            className={`rounded-xl px-4 py-3 text-sm font-bold ${kind === option ? 'bg-[#382721] text-white shadow-sm' : 'text-[#382721]/65'}`}
          >
            {option === 'rating' ? 'New rating' : 'Made by Mitch pint'}
          </button>
        ))}
      </fieldset>

      <label className="grid gap-2 text-sm font-bold">Photos <span className="font-normal text-[#382721]/60">Up to four JPEG, PNG, or WebP photos.</span>
        <input className="rounded-xl border border-dashed border-[#382721]/30 bg-[#fffaf1] p-3 font-normal" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => handleFiles(event.target.files)} />
        {files.length > 0 && <span className="font-normal text-[#382721]/70">{files.length} photo{files.length === 1 ? '' : 's'} ready to upload.</span>}
      </label>

      {kind === 'rating' ? (
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-bold">Verified shop address
            <select value={selectedLocationId} onChange={(event) => setSelectedLocationId(event.target.value)} className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal">
              <option value="">Choose an existing shop (required for review)</option>
              {locations.map((location) => <option key={location.id} value={location.id}>{location.display_name} — {location.address}</option>)}
            </select>
          </label>
          {!locations.length && <p className="rounded-xl bg-[#fff0f3] p-3 text-sm text-[#852944]">No verified shops are available yet. Save a draft; do not submit it for review until the storefront seed is applied.</p>}
          <label className="grid gap-2 text-sm font-bold">Shop name <span className="font-normal text-[#382721]/60">For a new shop, enter the name and save a draft for location research.</span>
            <input name="shop_display_name" defaultValue={selectedLocation?.display_name ?? ''} className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal" placeholder="Ice cream shop" />
          </label>
          <label className="grid gap-2 text-sm font-bold">What did you order?
            <input name="flavor_or_item" className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal" placeholder="Flavor, sundae, shake…" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-2 text-sm font-bold">Score
              <input name="score" type="number" min="0" max="10" step="0.1" className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal" placeholder="8.5" />
            </label>
            <label className="grid gap-2 text-sm font-bold">Tasting date
              <input name="tasted_at" type="date" className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal" />
            </label>
          </div>
          <div className="grid grid-cols-[1fr_7rem] gap-4">
            <label className="grid gap-2 text-sm font-bold">Price <span className="font-normal text-[#382721]/60">Optional</span>
              <input name="price_amount" type="number" min="0" step="0.01" className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal" placeholder="6.50" />
            </label>
            <label className="grid gap-2 text-sm font-bold">Currency
              <select name="price_currency" defaultValue="USD" className="rounded-xl border border-[#382721]/20 bg-white px-3 py-3 font-normal"><option>USD</option><option>MXN</option></select>
            </label>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-bold">Pint name
            <input name="pint_name" className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal" placeholder="Pumpkin Pie" />
          </label>
          <label className="grid gap-2 text-sm font-bold">Base or short description
            <textarea name="base_or_description" rows={3} className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal" placeholder="Pumpkin ice cream with a caramel swirl" />
          </label>
          <label className="grid gap-2 text-sm font-bold">Mix-ins <span className="font-normal text-[#382721]/60">Optional, comma-separated</span>
            <input name="mix_ins" className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal" placeholder="Caramel swirl, graham cracker" />
          </label>
        </div>
      )}

      <label className="grid gap-2 text-sm font-bold">Note <span className="font-normal text-[#382721]/60">Optional</span>
        <textarea name="notes" rows={3} className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 font-normal" placeholder="Anything worth remembering?" />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="submit" data-intent="draft" disabled={submitting} className="rounded-full border border-[#382721]/25 px-5 py-3 font-bold disabled:opacity-60">Save draft</button>
        <button type="submit" data-intent="review" disabled={submitting} className="rounded-full bg-[#d84e72] px-5 py-3 font-bold text-white disabled:opacity-60">{submitting ? 'Saving…' : 'Submit for review'}</button>
      </div>
      <p className="rounded-xl bg-[#f8ecdf] p-4 text-sm leading-6 text-[#382721]/75">The review gate requires a verified shop address for ratings. A photo’s GPS is never used as a Shoppe map pin.</p>
      {status && <p role="status" className="text-sm font-medium leading-6 text-[#382721]">{status}</p>}
    </form>
  )
}
