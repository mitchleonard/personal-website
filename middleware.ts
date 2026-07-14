import { NextResponse } from 'next/server'

// The Shoppe is under private map review. Intercept the request before the
// route can render so production returns a real 404 rather than a discoverable
// page shell. Remove this matcher when ICE_CREAM_SHOPPE_PUBLIC is re-enabled.
export default function middleware() {
  // Keep the in-progress Shoppe reachable on the unlisted Vercel preview URL
  // for map review, while the production domain remains a real 404.
  if (process.env.VERCEL_ENV === 'preview') return NextResponse.next()
  return new NextResponse('Not Found', { status: 404, headers: { 'content-type': 'text/plain; charset=utf-8' } })
}

export const config = {
  matcher: '/ice-cream/:path*',
}
