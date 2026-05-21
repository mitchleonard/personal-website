import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { caseStudies, getCaseStudy, getAdjacentCaseStudy } from '@/data/caseStudies'
import CaseStudyContent from './CaseStudyContent'

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const cs = getCaseStudy(params.slug) as any
  if (!cs) return {}
  const ogImage = cs.ogImage || '/og-default.png'
  const url = `https://www.mitchleonard.com/work/${cs.slug}`
  return {
    title: `${cs.title} — Mitch Leonard`,
    description: cs.subtitle,
    openGraph: {
      title: `${cs.title} — Mitch Leonard`,
      description: cs.subtitle,
      url,
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: cs.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: cs.title,
      description: cs.subtitle,
      images: [ogImage],
    },
  }
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = getCaseStudy(params.slug)
  if (!cs) notFound()

  const next = getAdjacentCaseStudy(params.slug)

  return (
    <main>
      <Nav />
      <CaseStudyContent cs={cs} next={next} />
      <Footer />
      <ScrollToTop />
    </main>
  )
}
