import type { Metadata } from 'next'
import IceCreamShoppe from '@/components/IceCreamShoppe'
import { ICE_CREAM_DATA_STATUS, importedHomemadePints, importedRatings } from '@/data/iceCream'

export const metadata: Metadata = {
  title: 'Ice Cream Shoppe Preview — Mitch Leonard',
  robots: { index: false, follow: false },
}

export default function IceCreamShoppePreviewPage() {
  return <IceCreamShoppe ratings={importedRatings} homemade={importedHomemadePints} expectedRatings={ICE_CREAM_DATA_STATUS.expectedRatings} isDemo={false} layout="guided-preview" />
}
