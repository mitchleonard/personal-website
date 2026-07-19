'use client'

import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Location = {
  display_name: string
  address: string
  latitude: number | null
  longitude: number | null
}

export type CounterSubmission = {
  id: string
  kind: 'rating' | 'pint'
  status: 'draft' | 'blocked' | 'ready_for_review' | 'approved' | 'published'
  flavor_or_item: string | null
  pint_name: string | null
  shop_display_name: string | null
  score: number | null
  tasted_at: string | null
  made_at: string | null
  price_amount: number | null
  price_currency: string | null
  base_or_description: string | null
  mix_ins: string[]
  notes: string | null
  image_urls: string[]
  validation_errors: string[]
  created_at: string
}

function csvValue(value: string | number | null | undefined) {
  const text = String(value ?? '')
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function locationParts(location: Location | null) {
  if (!location) return { city: '', region: '', latitude: '', longitude: '' }
  const parts = location.address.split(',').map((part) => part.trim()).filter(Boolean)
  const regionIndex = parts.findIndex((part) => /^[A-Z]{2}(?:\s+\d{5}(?:-\d{4})?)?$/.test(part))
  return {
    city: regionIndex > 0 ? parts[regionIndex - 1] : '',
    region: regionIndex >= 0 ? parts[regionIndex].match(/^[A-Z]{2}/)?.[0] ?? '' : '',
    latitude: location.latitude ?? '',
    longitude: location.longitude ?? '',
  }
}

function formatMoney(amount: number | null, currency: string | null) {
  if (amount == null) return null
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount)
}

export default function ShoppeCounterReview({ submission, location }: { submission: CounterSubmission; location: Location | null }) {
  const [status, setStatus] = useState(submission.status)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const title = submission.kind === 'rating' ? submission.flavor_or_item || 'Untitled rating' : submission.pint_name || 'Untitled pint'
  const submissionDate = submission.kind === 'rating' ? submission.tasted_at : submission.made_at
  const canApprove = status === 'ready_for_review' && submission.validation_errors.length === 0

  async function approve() {
    setSaving(true)
    setMessage('Approving this entry…')
    try {
      const supabase = createClient()
      const now = new Date().toISOString()
      const { error } = await supabase.from('shoppe_submissions').update({ status: 'approved', reviewed_at: now, approved_at: now }).eq('id', submission.id)
      if (error) throw error
      setStatus('approved')
      setMessage('Approved. Download the import row when you are ready to add it to the public archive.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to approve this entry.')
    } finally {
      setSaving(false)
    }
  }

  function downloadImportRow() {
    const fields = ['type', 'shop_or_name', 'flavor_or_base', 'score', 'date', 'city', 'region', 'notes', 'mix_ins', 'image_src', 'latitude', 'longitude']
    const locationData = locationParts(location)
    const values = submission.kind === 'rating'
      ? ['rating', submission.shop_display_name || location?.display_name, submission.flavor_or_item, submission.score, submission.tasted_at, locationData.city, locationData.region, submission.notes, '', submission.image_urls[0], locationData.latitude, locationData.longitude]
      : ['homemade', submission.pint_name, submission.base_or_description, '', submission.made_at, '', '', submission.notes, submission.mix_ins.join('|'), submission.image_urls[0], '', '']
    const contents = `${fields.map(csvValue).join(',')}\n${values.map(csvValue).join(',')}\n`
    const url = URL.createObjectURL(new Blob([contents], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${submission.kind}-${submission.id}.csv`
    link.click()
    URL.revokeObjectURL(url)
    setMessage('Import row downloaded. Add it to the Inbox, run the normal checks, then deploy the reviewed change.')
  }

  return (
    <section className="grid gap-7">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#382721]/15 pb-6">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#d84e72]">{submission.kind === 'rating' ? 'Rating review' : 'Pint review'}</p><h1 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">{title}</h1></div>
        <span className="rounded-full bg-[#f8ecdf] px-3 py-1.5 text-sm font-bold capitalize">{status.replaceAll('_', ' ')}</span>
      </div>

      {submission.image_urls.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{submission.image_urls.map((url, index) => <div key={url} className="relative aspect-square overflow-hidden rounded-2xl bg-[#f8ecdf]"><Image src={url} alt={`${title}, photo ${index + 1}`} fill unoptimized sizes="(max-width: 640px) 45vw, 180px" className="object-cover" /></div>)}</div>}

      <dl className="grid gap-x-8 gap-y-5 rounded-2xl bg-[#fff8e8] p-5 text-sm leading-6 sm:grid-cols-2">
        {submission.kind === 'rating' ? <>
          <div><dt className="font-bold text-[#382721]/55">Shop</dt><dd>{submission.shop_display_name || location?.display_name || 'Not set'}</dd></div>
          <div><dt className="font-bold text-[#382721]/55">Score</dt><dd>{submission.score?.toFixed(1) ?? 'Not set'}{submission.score != null ? ' / 10' : ''}</dd></div>
          <div><dt className="font-bold text-[#382721]/55">Storefront</dt><dd>{location?.address || 'Not confirmed'}</dd></div>
          <div><dt className="font-bold text-[#382721]/55">Price</dt><dd>{formatMoney(submission.price_amount, submission.price_currency) || 'Not recorded'}</dd></div>
        </> : <>
          <div><dt className="font-bold text-[#382721]/55">Base / description</dt><dd>{submission.base_or_description || 'Not set'}</dd></div>
          <div><dt className="font-bold text-[#382721]/55">Mix-ins</dt><dd>{submission.mix_ins.length ? submission.mix_ins.join(', ') : 'None recorded'}</dd></div>
        </>}
        <div><dt className="font-bold text-[#382721]/55">{submission.kind === 'rating' ? 'Tasted' : 'Made'}</dt><dd>{submissionDate || 'Not set'}</dd></div>
        <div><dt className="font-bold text-[#382721]/55">Note</dt><dd>{submission.notes || 'None recorded'}</dd></div>
      </dl>

      {submission.validation_errors.length > 0 && <div className="rounded-2xl border border-[#d84e72]/30 bg-[#fff7f8] p-5 text-sm leading-6"><strong>Still needs attention</strong><ul className="mt-2 list-disc space-y-1 pl-5">{submission.validation_errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}

      <div className="rounded-2xl border border-[#382721]/15 p-5">
        <h2 className="font-serif text-3xl">Finish the handoff</h2>
        <p className="mt-2 text-sm leading-6 text-[#382721]/70">Approval keeps this private entry intentional. The download creates a ready-to-import row for the existing public archive workflow; it does not put an unreviewed entry live.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {canApprove && <button type="button" onClick={approve} disabled={saving} className="rounded-full bg-[#d84e72] px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? 'Approving…' : 'Approve entry'}</button>}
          {status === 'approved' && <button type="button" onClick={downloadImportRow} className="rounded-full bg-[#382721] px-5 py-3 text-sm font-bold text-white">Download import row</button>}
        </div>
        {status === 'draft' && <p className="mt-4 text-sm leading-6 text-[#382721]/70">This is still a draft. Add the missing details from the Counter before it can enter review.</p>}
        {status === 'ready_for_review' && !canApprove && <p className="mt-4 text-sm leading-6 text-[#382721]/70">Resolve the items above before approving this entry.</p>}
        {message && <p role="status" className="mt-4 text-sm font-medium leading-6">{message}</p>}
      </div>
    </section>
  )
}
