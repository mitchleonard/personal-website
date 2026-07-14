import { NextResponse, type NextRequest } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

function safeNext(next: string | null) {
  return next?.startsWith('/') && !next.startsWith('//') ? next : '/ice-cream/counter'
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return new NextResponse('The private Shoppe Counter is not configured.', { status: 503 })
  }

  const code = request.nextUrl.searchParams.get('code')
  const next = safeNext(request.nextUrl.searchParams.get('next'))

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(new URL(next, request.url))
  }

  return NextResponse.redirect(new URL('/ice-cream/counter/login?error=link', request.url))
}
