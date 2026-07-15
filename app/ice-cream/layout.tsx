import type { Metadata } from 'next'

const socialImage = 'https://www.mitchleonard.com/ice-cream/ice-cream-shoppe-social.png'

export const metadata: Metadata = {
  openGraph: {
    images: [{
      url: socialImage,
      width: 1200,
      height: 630,
      alt: 'Ice Cream Shoppe — Est. 2020 · Minneapolis, Minnesota',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [socialImage],
  },
}

export default function IceCreamLayout({ children }: { children: React.ReactNode }) {
  return children
}
