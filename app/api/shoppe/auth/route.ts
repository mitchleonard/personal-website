import { NextResponse, type NextRequest } from 'next/server'
import { isConfiguredShoppeEditor, isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'The private Shoppe Counter is not configured.' }, { status: 503 })
  }

  const { email } = await request.json().catch(() => ({ email: '' })) as { email?: unknown }
  const submittedEmail = typeof email === 'string' ? email : ''
  if (!isConfiguredShoppeEditor(submittedEmail)) {
    // Do not disclose the allowlisted address.
    return NextResponse.json({ error: 'This address is not allowed to use the Counter.' }, { status: 403 })
  }

  const supabase = createClient()
  const callback = new URL('/auth/callback', request.url)
  callback.searchParams.set('next', '/ice-cream/counter')
  const { error } = await supabase.auth.signInWithOtp({
    email: submittedEmail,
    options: { emailRedirectTo: callback.toString() },
  })

  if (error) {
    return NextResponse.json({ error: 'Unable to send the sign-in email. Try again shortly.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
