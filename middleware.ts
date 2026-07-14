import { NextResponse } from 'next/server'

// The Shoppe archive remains public; its case study is intentionally held back
// while its editorial treatment and screenshots are refreshed.
export function middleware() {
  return new NextResponse('Not Found', {
    status: 404,
    headers: { 'cache-control': 'no-store' },
  })
}

export const config = {
  matcher: ['/work/ice-cream-shoppe'],
}
