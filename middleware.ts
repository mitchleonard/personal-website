import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { updateSession } from '@/lib/supabase/middleware'

// The Shoppe archive remains public; its case study is intentionally held back
// while its editorial treatment and screenshots are refreshed.
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isCounterRequest = pathname === '/ice-cream/counter' ||
    pathname.startsWith('/ice-cream/counter/') ||
    pathname === '/auth/callback' ||
    pathname.startsWith('/api/shoppe/')

  if (pathname === '/work/ice-cream-shoppe') {
    return new NextResponse('Not Found', {
      status: 404,
      headers: { 'cache-control': 'no-store' },
    })
  }

  // Defend against an overly broad matcher: only the explicitly private paths
  // ever enter Counter configuration/auth behavior.
  if (!isCounterRequest) return NextResponse.next()

  // A configured counter is intentionally private; an unconfigured one must
  // not advertise an incomplete workflow or return a soft 200 not-found page.
  if (!isSupabaseConfigured()) {
    return new NextResponse('Not Found', {
      status: 404,
      headers: { 'cache-control': 'no-store' },
    })
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    '/work/ice-cream-shoppe',
    '/ice-cream/counter',
    '/ice-cream/counter/:path*',
    '/auth/callback',
    '/auth/:path*',
    '/api/shoppe/auth',
    '/api/shoppe/upload',
    '/api/shoppe/:path*',
  ],
}
