import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import ShoppeCounterForm from '@/components/ShoppeCounterForm'
import { isConfiguredShoppeEditor, isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

type Location = { id: string; display_name: string; address: string }
type Submission = { id: string; kind: 'rating' | 'pint'; status: string; created_at: string; flavor_or_item: string | null; pint_name: string | null }

export const metadata = { title: 'Behind the Counter — Mitch Leonard' }
export const dynamic = 'force-dynamic'

export default async function ShoppeCounterPage() {
  if (!isSupabaseConfigured()) notFound()

  const supabase = createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  if (!claims?.sub) redirect('/ice-cream/counter/login')
  if (!isConfiguredShoppeEditor(claims.email)) notFound()

  const [{ data: editor }, { data: locations }, { data: submissions }] = await Promise.all([
    supabase.from('shoppe_editors').select('user_id').eq('user_id', claims.sub).maybeSingle(),
    supabase.from('shoppe_locations').select('id, display_name, address').eq('is_verified', true).order('display_name'),
    supabase.from('shoppe_submissions').select('id, kind, status, created_at, flavor_or_item, pint_name').order('created_at', { ascending: false }).limit(5),
  ])

  if (!editor) {
    return (
      <main className="min-h-screen bg-[#fff8e8] px-5 py-16 text-[#382721]">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-[#382721]/15 bg-white p-8 shadow-[0_16px_45px_rgba(56,39,33,.10)]">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d84e72]">Behind the Counter</p>
          <h1 className="mt-4 font-serif text-5xl leading-none">One last setup step</h1>
          <p className="mt-5 leading-7 text-[#382721]/75">Your email passed the site allowlist, but it has not been added to the Shoppe editor table yet. This is intentional: the Counter stays locked until the one owner account is explicitly granted access.</p>
          <p className="mt-5 rounded-xl bg-[#f8ecdf] p-4 text-sm leading-6">In Supabase SQL Editor, insert your auth user ID into <code className="font-mono">public.shoppe_editors</code>, then reload this page.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fff8e8] px-5 py-10 text-[#382721] sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/ice-cream" className="text-sm font-bold underline underline-offset-4">← Back to the Shoppe</Link>
        <header className="mt-10 border-b border-[#382721]/20 pb-8">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d84e72]">Private workspace</p>
          <h1 className="mt-3 font-serif text-6xl leading-[.8] sm:text-7xl">Behind the Counter</h1>
          <p className="mt-6 max-w-xl leading-7 text-[#382721]/75">Capture it now. The Shoppe catches anything incomplete before review, map placement, or public release.</p>
        </header>

        <section className="mt-8 rounded-[2rem] border border-[#382721]/15 bg-white p-5 shadow-[0_16px_45px_rgba(56,39,33,.08)] sm:p-8">
          <ShoppeCounterForm ownerId={claims.sub} locations={(locations ?? []) as Location[]} />
        </section>

        <section className="mt-10 border-t border-[#382721]/20 pt-7">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d84e72]">Recent captures</p>
          <div className="mt-4 grid gap-3">
            {(submissions ?? []).length ? (submissions as Submission[]).map((submission) => (
              <div key={submission.id} className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 text-sm shadow-sm">
                <span><strong>{submission.kind === 'rating' ? submission.flavor_or_item || 'Untitled rating' : submission.pint_name || 'Untitled pint'}</strong><span className="ml-2 text-[#382721]/55">{submission.kind}</span></span>
                <span className="rounded-full bg-[#f8ecdf] px-2.5 py-1 text-xs font-bold">{submission.status.replaceAll('_', ' ')}</span>
              </div>
            )) : <p className="text-sm leading-6 text-[#382721]/65">Your drafts and review-ready entries will appear here.</p>}
          </div>
        </section>
      </div>
    </main>
  )
}
