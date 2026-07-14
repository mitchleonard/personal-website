export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  )
}

export function shoppeEditorEmail() {
  return process.env.SHOPPE_EDITOR_EMAIL?.trim().toLowerCase() ?? ''
}

export function isConfiguredShoppeEditor(email: unknown) {
  return typeof email === 'string' &&
    email.trim().toLowerCase() === shoppeEditorEmail() &&
    Boolean(shoppeEditorEmail())
}
