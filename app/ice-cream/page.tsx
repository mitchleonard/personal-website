import type { Metadata } from 'next'
import IceCreamShoppe from '@/components/IceCreamShoppe'
import { demoHomemadePints, demoRatings, ICE_CREAM_DATA_STATUS, importedHomemadePints, importedRatings } from '@/data/iceCream'
import { getLiveShoppeEntries } from '@/lib/shoppePublications'

export const metadata: Metadata = {
  title: 'Ice Cream Shoppe — Mitch Leonard',
  description: 'Ice cream ratings, recommendations, and homemade pints from Mitch Leonard’s collection.',
}

export const dynamic = 'force-dynamic'

export default async function IceCreamPage() {
  const liveEntries = await getLiveShoppeEntries()
  const hasImportedRatings = importedRatings.length > 0
  const archivedRatings = hasImportedRatings ? importedRatings : demoRatings
  const archivedPints = importedHomemadePints.length ? importedHomemadePints : demoHomemadePints
  return <IceCreamShoppe ratings={[...liveEntries.ratings, ...archivedRatings]} homemade={[...liveEntries.homemade, ...archivedPints]} expectedRatings={ICE_CREAM_DATA_STATUS.expectedRatings} isDemo={!hasImportedRatings} layout="guided-preview" />
}
