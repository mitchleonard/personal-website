import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import ShoppeCounterReview, { type CounterSubmission } from '@/components/ShoppeCounterReview'
import { isConfiguredShoppeEditor, isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

type Location = { display_name: string; address: string; latitude: number | null; longitude: number | null }

export const dynamic = 'force-dynamic'

export default async function ShoppeCounterReviewPage({ params }: { params: { id: string } }) {
  if (!isSupabaseConfigured()) notFound()
  const supabase = createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims
  if (!claims?.sub) redirect('/ice-cream/counter/login')
  if (!isConfiguredShoppeEditor(claims.email)) notFound()

  const { data: submission } = await supabase.from('shoppe_submissions').select('*').eq('id', params.id).eq('owner_id', claims.sub).maybeSingle()
  if (!submission) notFound()
  const { data: location } = submission.canonical_location_id
    ? await supabase.from('shoppe_locations').select('display_name, address, latitude, longitude').eq('id', submission.canonical_location_id).maybeSingle()
    : { data: null }

  return (
    <main className="min-h-screen bg-[#fff8e8] px-5 py-10 text-[#382721] sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link href="/ice-cream/counter" className="text-sm font-bold underline underline-offset-4">← Back to the Counter</Link>
        <div className="mt-10 rounded-[2rem] border border-[#382721]/15 bg-white p-5 shadow-[0_16px_45px_rgba(56,39,33,.08)] sm:p-8">
          <ShoppeCounterReview submission={submission as CounterSubmission} location={location as Location | null} />
        </div>
      </div>
    </main>
  )
}
