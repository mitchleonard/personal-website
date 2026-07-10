import type { Metadata } from 'next'
import { DM_Serif_Display, Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { GoogleAnalytics } from '@next/third-parties/google'
import SprinkleOverlay from '@/components/SprinkleOverlay'
import './globals.css'

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mitch Leonard — Communications Strategist',
  description: 'I\'m a communications strategist leading AI-powered transformation to help global teams tell sharper, smarter, insight-driven stories.',
  openGraph: {
    title: 'Mitch Leonard — Communications Strategist',
    description: 'AI-powered communications strategy, enterprise storytelling, and digital transformation.',
    url: 'https://mitchleonard.com',
    siteName: 'Mitch Leonard',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSerifDisplay.variable} ${roboto.variable}`} suppressHydrationWarning>
      <body className="bg-off-white text-near-black font-sans antialiased">
        {/* Restore ice cream mode pre-paint so a reload never flashes the normal palette */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('icecream-mode')==='on')document.documentElement.dataset.icecream='on'}catch(e){}",
          }}
        />
        {children}
        <SprinkleOverlay />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-ZQPZY66RZG" />
      </body>
    </html>
  )
}
