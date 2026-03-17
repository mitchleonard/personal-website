import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { caseStudies, getCaseStudy, getAdjacentCaseStudy } from '@/data/caseStudies'
import CaseStudyContent from './CaseStudyContent'

export async function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const cs = getCaseStudy(params.slug)
  if (!cs) return {}
  return {
    title: `${cs.title} — Mitch Leonard`,
    description: cs.subtitle,
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
    </main>
  )
}
