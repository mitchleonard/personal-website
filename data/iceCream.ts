export type IceCreamRating = {
  id: string
  slug: string
  shop: string
  flavor: string
  score: number
  scoreScale: 10
  triedAt: string
  notes?: string
  image?: { src: string; alt: string }
  location: {
    label: string
    city?: string
    region?: string
    latitude?: number
    longitude?: number
  }
  status: 'published' | 'needs-review' | 'draft'
}

export type HomemadePint = {
  id: string
  slug: string
  name: string
  madeAt: string
  base: string
  mixIns: string[]
  description: string
  wouldMakeAgain: boolean
  images?: Array<{ src: string; alt: string }>
}

import importedData from './iceCream.imported.json'

// Representative records keep the experience functional while the private Apple
// Notes and Photos archive is prepared for import. Replace these via the importer;
// do not present them as Mitch's real ratings.
export const demoRatings: IceCreamRating[] = [
  {
    id: 'demo-001', slug: 'brown-butter-waffle-cone', shop: 'Sample Scoop Co.',
    flavor: 'Brown Butter Waffle Cone', score: 9.6, scoreScale: 10,
    triedAt: '2026-06-14', notes: 'Caramelized, salty, and aggressively crunchy.',
    location: { label: 'Minneapolis sample', city: 'Minneapolis', region: 'MN', latitude: 44.9778, longitude: -93.265 },
    status: 'draft',
  },
  {
    id: 'demo-002', slug: 'strawberry-buttermilk', shop: 'Demo Creamery',
    flavor: 'Strawberry Buttermilk', score: 9.2, scoreScale: 10,
    triedAt: '2025-08-22', notes: 'Bright fruit with just enough tang.',
    location: { label: 'Chicago sample', city: 'Chicago', region: 'IL', latitude: 41.8781, longitude: -87.6298 },
    status: 'draft',
  },
  {
    id: 'demo-003', slug: 'malted-chocolate', shop: 'The Test Parlor',
    flavor: 'Malted Chocolate', score: 8.8, scoreScale: 10,
    triedAt: '2024-11-03', notes: 'Deep cocoa, soft malt finish.',
    location: { label: 'New York sample', city: 'New York', region: 'NY', latitude: 40.7128, longitude: -74.006 },
    status: 'draft',
  },
  {
    id: 'demo-004', slug: 'lemon-olive-oil', shop: 'Sample Scoop Co.',
    flavor: 'Lemon Olive Oil', score: 8.5, scoreScale: 10,
    triedAt: '2026-02-09', notes: 'Clean citrus with a peppery finish.',
    location: { label: 'Minneapolis sample', city: 'Minneapolis', region: 'MN', latitude: 44.9778, longitude: -93.265 },
    status: 'draft',
  },
]

export const demoHomemadePints: HomemadePint[] = [
  {
    id: 'pint-demo-001', slug: 'malted-vanilla-crunch', name: 'Malted Vanilla Crunch',
    madeAt: '2026-05-18', base: 'Malted vanilla', mixIns: ['Chocolate-covered waffle cone'],
    description: 'A sample batch entry showing how experiments, mix-ins, and verdicts will live together.',
    wouldMakeAgain: true,
    images: [],
  },
  {
    id: 'pint-demo-002', slug: 'roasted-strawberry', name: 'Roasted Strawberry',
    madeAt: '2026-04-06', base: 'Buttermilk', mixIns: ['Roasted strawberries', 'Strawberry ripple'],
    description: 'The homemade shelf is intentionally separate from the public-shop leaderboard.',
    wouldMakeAgain: true,
    images: [],
  },
]

export const ICE_CREAM_DATA_STATUS = {
  isDemo: true,
  trackedSince: 2020,
  expectedRatings: 150,
} as const

export const importedRatings = importedData.ratings as IceCreamRating[]
export const importedHomemadePints = importedData.homemade as HomemadePint[]
