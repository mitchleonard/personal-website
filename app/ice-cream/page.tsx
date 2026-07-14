import type { Metadata } from 'next'
import IceCreamShoppe from '@/components/IceCreamShoppe'
import { demoHomemadePints, demoRatings, ICE_CREAM_DATA_STATUS, importedHomemadePints, importedRatings } from '@/data/iceCream'

export const metadata: Metadata = {
  title: 'Ice Cream Shoppe — Mitch Leonard',
  description: 'Ice cream ratings, recommendations, and homemade pints from Mitch Leonard’s collection.',
}

export default function IceCreamPage() {
  const hasImportedRatings = importedRatings.length > 0
  return <IceCreamShoppe ratings={hasImportedRatings ? importedRatings : demoRatings} homemade={importedHomemadePints.length ? importedHomemadePints : demoHomemadePints} expectedRatings={ICE_CREAM_DATA_STATUS.expectedRatings} isDemo={!hasImportedRatings} />
}
