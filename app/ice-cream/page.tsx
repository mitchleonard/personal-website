import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import IceCreamShoppe from '@/components/IceCreamShoppe'
import { demoHomemadePints, demoRatings, ICE_CREAM_DATA_STATUS, ICE_CREAM_SHOPPE_PUBLIC, importedHomemadePints, importedRatings } from '@/data/iceCream'

// A dynamic response preserves the intended HTTP 404 while the private gate is
// on; otherwise Next could pre-render the not-found UI into a 200 static file.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Ice Cream Shoppe — Mitch Leonard',
  description: 'Ice cream ratings, recommendations, and homemade pints from Mitch Leonard’s collection.',
  robots: { index: false, follow: false },
}

export default function IceCreamPage() {
  // Preview deployments are intentionally unlisted (the flag still keeps the
  // route out of navigation and the sitemap) so the map can be reviewed before
  // the production launch. This is not an authentication boundary.
  const isPreviewDeployment = process.env.VERCEL_ENV === 'preview'
  if (!ICE_CREAM_SHOPPE_PUBLIC && !isPreviewDeployment) notFound()
  const hasImportedRatings = importedRatings.length > 0
  return <IceCreamShoppe ratings={hasImportedRatings ? importedRatings : demoRatings} homemade={importedHomemadePints.length ? importedHomemadePints : demoHomemadePints} expectedRatings={ICE_CREAM_DATA_STATUS.expectedRatings} isDemo={!hasImportedRatings} />
}
