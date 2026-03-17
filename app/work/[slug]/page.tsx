import { notFound } from 'next/navigation'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ResultsBlock from '@/components/ResultsBlock'
import MediaBlock from '@/components/MediaBlock'
import { caseStudies, getCaseStudy, getAdjacentCaseStudy } from '@/data/caseStudies'
import Link from 'next/link'

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

// Render text that may contain \n\n paragraph breaks
function BodyText({ text }: { text: string }) {
  const paragraphs = text.split('\n\n').filter(Boolean)
  if (paragraphs.length === 1) {
    return <p className="font-sans text-base md:text-lg text-near-black/80 leading-relaxed">{text}</p>
  }
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="font-sans text-base md:text-lg text-near-black/80 leading-relaxed">{p}</p>
      ))}
    </div>
  )
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = getCaseStudy(params.slug)
  if (!cs) notFound()

  const next = getAdjacentCaseStudy(params.slug)

  return (
    <main>
      <Nav />
      <article className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <Link
            href="/#work"
            className="font-sans text-sm text-near-black/50 hover:text-near-black transition-colors inline-flex items-center gap-2 mb-12"
          >
            ← Work
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-5">
              <span className="font-sans text-xs uppercase tracking-widest text-accent">{cs.company}</span>
              {cs.client && (
                <>
                  <span className="text-near-black/20">·</span>
                  <span className="font-sans text-xs uppercase tracking-widest text-near-black/50">
                    Client: {cs.client}
                  </span>
                </>
              )}
              {cs.tags.map((tag: string) => (
                <span key={tag} className="font-sans text-xs text-near-black/40 border border-near-black/15 px-2 py-0.5 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-near-black leading-tight mb-4">
              {cs.title}
            </h1>
            <p className="font-sans text-xl text-near-black/60 italic">{cs.subtitle}</p>
          </div>

          {/* Results block */}
          {cs.results && cs.results.length > 0 && (
            <div className="mb-16">
              <ResultsBlock results={cs.results} />
            </div>
          )}

          {/* Body sections */}
          <div className="space-y-14">
            {[
              { label: 'Context', content: cs.context },
              { label: 'Challenge', content: cs.challenge },
              { label: 'Insight', content: cs.insight },
              { label: 'Role', content: cs.role },
            ].map((section) => (
              section.content && (
                <section key={section.label}>
                  <p className="font-sans text-xs uppercase tracking-widest text-near-black/40 mb-4">{section.label}</p>
                  <BodyText text={section.content} />
                </section>
              )
            ))}

            {/* Execution — bulleted list */}
            {cs.execution && cs.execution.length > 0 && (
              <section>
                <p className="font-sans text-xs uppercase tracking-widest text-near-black/40 mb-4">Execution</p>
                <ul className="space-y-4">
                  {cs.execution.map((item: string, i: number) => (
                    <li key={i} className="flex gap-4">
                      <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full border border-accent flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      </span>
                      <p className="font-sans text-base text-near-black/80 leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Impact */}
            {cs.impact && (
              <section>
                <p className="font-sans text-xs uppercase tracking-widest text-near-black/40 mb-4">Impact</p>
                <BodyText text={cs.impact} />
              </section>
            )}
          </div>

          {/* Visuals — photos, videos, GIFs */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(cs as any).visuals && (cs as any).visuals.length > 0 && (
            <div className="mt-16 space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(cs as any).visuals.map((v: any, i: number) => {
                if (v.featured) {
                  return (
                    <div key={i} className="w-full rounded-lg overflow-hidden bg-near-black/5">
                      {v.type === 'video' ? (
                        <video
                          src={v.src}
                          controls
                          muted
                          playsInline
                          className="w-full max-h-[600px] object-contain"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={v.src} alt={v.caption || ''} className="w-full object-contain" />
                      )}
                      {v.caption && (
                        <p className="font-sans text-xs text-near-black/40 px-3 py-2">{v.caption}</p>
                      )}
                    </div>
                  )
                }
                return null
              })}
              {/* Grid for remaining non-featured assets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(cs as any).visuals.filter((v: any) => !v.featured).map((v: any, i: number) => (
                  <div key={i} className="rounded-lg overflow-hidden bg-near-black/5">
                    {v.type === 'video' ? (
                      <video
                        src={v.src}
                        controls
                        muted
                        playsInline
                        className="w-full max-h-[480px] object-contain"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.src} alt={v.caption || ''} className="w-full object-contain" />
                    )}
                    {v.caption && (
                      <p className="font-sans text-xs text-near-black/40 px-3 py-2">{v.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media block — social links */}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <MediaBlock media={cs.media as any} />

          {/* Next case study */}
          {next && (
            <div className="mt-20 pt-10 border-t border-near-black/10">
              <p className="font-sans text-xs uppercase tracking-widest text-near-black/40 mb-4">Next case study</p>
              <Link href={`/work/${next.slug}`} className="group block">
                <span className="font-sans text-xs uppercase tracking-widest text-accent block mb-2">{next.company}</span>
                <h2 className="font-serif text-2xl md:text-3xl text-near-black group-hover:text-accent transition-colors leading-snug">
                  {next.title} →
                </h2>
              </Link>
            </div>
          )}
        </div>
      </article>
      <Footer />
    </main>
  )
}
