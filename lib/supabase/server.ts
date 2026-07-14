import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { isSupabaseConfigured } from './config'

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('The private Shoppe Counter is not configured yet.')
  }

  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Server Components cannot write cookies. The focused middleware
            // refreshes them for Counter and auth requests instead.
          }
        },
      },
    },
  )
}
