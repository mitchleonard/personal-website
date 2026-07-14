import { createBrowserClient } from '@supabase/ssr'
import { isSupabaseConfigured } from './config'

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('The private Shoppe Counter is not configured yet.')
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
