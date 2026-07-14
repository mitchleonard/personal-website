import { notFound } from 'next/navigation'
import ShoppeCounterLogin from '@/components/ShoppeCounterLogin'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export const metadata = { title: 'Behind the Counter — Mitch Leonard' }

export default function ShoppeCounterLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  if (!isSupabaseConfigured()) notFound()

  return (
    <main className="min-h-screen bg-[#fff8e8] px-5 py-16 text-[#382721]">
      <div className="mx-auto max-w-md rounded-[2rem] border border-[#382721]/15 bg-white p-7 shadow-[0_16px_45px_rgba(56,39,33,.10)] sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d84e72]">Ice Cream Shoppe</p>
        <h1 className="mt-4 font-serif text-5xl leading-none">Behind the Counter</h1>
        <p className="mt-5 leading-7 text-[#382721]/72">A private, mobile-first capture space for new ratings and homemade pints. Nothing here is public until it clears the Shoppe review checks.</p>
        <ShoppeCounterLogin initialError={searchParams.error === 'link'} />
      </div>
    </main>
  )
}
