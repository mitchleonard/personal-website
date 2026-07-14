import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse, type NextRequest } from 'next/server'
import { isConfiguredShoppeEditor, isSupabaseConfigured } from '@/lib/supabase/config'
import { createClient } from '@/lib/supabase/server'

const MAX_IMAGE_BYTES = 12 * 1024 * 1024
const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'The private Shoppe Counter is not configured.' }, { status: 503 })
  }

  const body = await request.json() as HandleUploadBody
  const supabase = createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims

  if (!claims?.sub || !isConfiguredShoppeEditor(claims.email)) {
    return NextResponse.json({ error: 'Sign in with the approved Shoppe editor account first.' }, { status: 401 })
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!clientPayload || !pathname.startsWith(`ice-cream/counter/${clientPayload}/`)) {
          throw new Error('Invalid Shoppe upload request.')
        }

        const { data: submission } = await supabase
          .from('shoppe_submissions')
          .select('id')
          .eq('id', clientPayload)
          .maybeSingle()

        if (!submission) throw new Error('Create a draft before uploading photos.')

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to prepare the photo upload.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
