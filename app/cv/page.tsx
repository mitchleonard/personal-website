import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import { HighlightLink, RandomHoverButton } from '@/components/BrandAccent'
import { cvData } from '@/data/cv'

export const metadata = {
  title: 'CV — Mitch Leonard',
  description: 'Full curriculum vitae for Mitch Leonard — communications strategist, AI lead, and digital builder.',
}

// Split multi-period date strings (e.g. "Jun 2016 · Dec 2016 · Jun 2017") into lines
function DateDisplay({ dates }: { dates: string }) {
  const periods = dates.split(' · ')
  if (periods.length === 1) {
    return (
      <span className="font-sans text-xs text-near-black/40 bg-near-black/5 px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
        {dates}
      </span>
    )
  }
  return (
    <div className="flex flex-col gap-1 items-start md:items-end">
      {periods.map((p, i) => (
        <span key={i} className="font-sans text-xs text-near-black/40 bg-near-black/5 px-3 py-1 rounded-full whitespace-nowrap">
          {p}
        </span>
      ))}
    </div>
  )
}

// Highlight stripe behind org/company/school name — color varies by section
type HighlightColor = 'banana' | 'frozen-lake' | 'tangerine' | 'yellow-green'

const highlightClass: Record<HighlightColor, string> = {
  'banana':       'bg-banana/65',
  'frozen-lake':  'bg-frozen-lake/55',
  'tangerine':    'bg-tangerine/25',
  'yellow-green': 'bg-yellow-green/35',
}

function OrgHighlight({ name, color = 'banana' }: { name: string; color?: HighlightColor }) {
  return (
    <span className="font-sans text-sm font-normal text-near-black relative inline-block">
      <span className="relative z-10">{name}</span>
      <span className={`absolute bottom-0 left-0 right-0 h-2.5 z-0 rounded-sm ${highlightClass[color]}`} />
    </span>
  )
}

// ── Work experience card ─────────────────────────────────────────────────────
function RoleCard({ role }: { role: (typeof cvData.workExperience)[0] }) {
  return (
    <div className="bg-white rounded-xl border border-near-black/8 p-6 hover:border-near-black/15 transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-sans text-lg font-semibold text-near-black mb-1.5">{role.title}</h3>
          <OrgHighlight name={role.company} />
          {role.note && (
            <p className="font-sans text-xs text-near-black/35 italic mt-1">{role.note}</p>
          )}
        </div>
        <DateDisplay dates={role.dates} />
      </div>
      <ul className="space-y-2 mt-4">
        {role.bullets.map((bullet: string, j: number) => (
          <li key={j} className="flex gap-3">
            <span className="shrink-0 w-1 h-1 rounded-full bg-tangerine mt-2 block" />
            <p className="font-sans text-sm text-near-black/65 leading-relaxed">{bullet}</p>
          </li>
        ))}
      </ul>
      {role.clients && (
        <p className="font-sans text-xs text-near-black/45 mt-4 italic">
          <span className="not-italic font-medium text-near-black/55">Clients: </span>{role.clients}
        </p>
      )}
    </div>
  )
}

// ── Volunteer card ───────────────────────────────────────────────────────────
function VolunteerCard({ role }: { role: (typeof cvData.volunteerExperience)[0] }) {
  return (
    <div className="bg-white rounded-xl border border-near-black/8 p-6 hover:border-near-black/15 transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="font-sans text-lg font-semibold text-near-black mb-1.5">{role.title}</h3>
          <OrgHighlight name={role.organization} color="frozen-lake" />
        </div>
        <DateDisplay dates={role.dates} />
      </div>
      {role.description && (
        <p className="font-sans text-sm text-near-black/65 leading-relaxed mt-4">{role.description}</p>
      )}
    </div>
  )
}

// ── Award card ───────────────────────────────────────────────────────────────
function AwardCard({ award }: { award: (typeof cvData.awards)[0] }) {
  return (
    <div className="bg-white rounded-xl border border-near-black/8 p-6 hover:border-near-black/15 transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="font-sans text-lg font-semibold text-near-black mb-1.5">{award.name}</h3>
          <OrgHighlight name={award.org} color="tangerine" />
        </div>
        <span className="font-sans text-xs text-near-black/40 shrink-0 bg-near-black/5 px-3 py-1 rounded-full h-fit">
          {award.year}
        </span>
      </div>
      {award.description && (
        <p className="font-sans text-sm text-near-black/60 leading-relaxed mt-4">{award.description}</p>
      )}
    </div>
  )
}

export default function CVPage() {
  return (
    <main className="bg-off-white">
      <Nav />
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">

          {/* ── Page header ── */}
          <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-cornflower mb-3">Career overview</p>
              <h1 className="font-serif text-5xl md:text-7xl text-near-black leading-tight mb-3">Mitch Leonard</h1>
              <p className="font-sans text-base text-near-black/50">
                Communications strategist · AI lead · Digital builder
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <RandomHoverButton
                href="/MitchLeonard_Resume_Feb2026.pdf"
                download
                className="font-sans text-sm font-medium text-near-black border border-near-black/20 px-5 py-2.5 rounded-full transition-colors inline-block text-center"
              >
                Download PDF ↓
              </RandomHoverButton>
              <RandomHoverButton
                href="/"
                className="font-sans text-sm font-medium text-near-black/60 border border-near-black/15 px-5 py-2.5 rounded-full transition-colors inline-block text-center"
              >
                ← Back home
              </RandomHoverButton>
            </div>
          </div>

          {/* ── Intro line with anchor links ── */}
          <p className="font-sans text-base text-near-black/55 leading-relaxed mb-16 max-w-xl">
            Sometimes you need extra space to document your{' '}
            <HighlightLink href="#experience">full career path</HighlightLink>,{' '}
            <HighlightLink href="#volunteer">key volunteer milestones</HighlightLink>, and{' '}
            <HighlightLink href="#awards">awards</HighlightLink>{' '}
            you&apos;re proud of. Here&apos;s mine.
          </p>

          {/* ── Work Experience ── */}
          <section id="experience" className="mb-16 scroll-mt-28">
            <h2 className="font-serif text-3xl text-near-black mb-10 pb-4 border-b border-near-black/15">
              Work Experience
            </h2>
            <div className="space-y-5">
              {cvData.workExperience.map((role, i) => (
                <RoleCard key={i} role={role} />
              ))}
            </div>
          </section>

          {/* ── Volunteer Experience ── */}
          <section id="volunteer" className="mb-16 scroll-mt-28">
            <h2 className="font-serif text-3xl text-near-black mb-10 pb-4 border-b border-near-black/15">
              Volunteer Experience
            </h2>
            <div className="space-y-5">
              {cvData.volunteerExperience.map((role, i) => (
                <VolunteerCard key={i} role={role} />
              ))}
            </div>
          </section>

          {/* ── Awards ── */}
          <section id="awards" className="mb-16 scroll-mt-28">
            <h2 className="font-serif text-3xl text-near-black mb-10 pb-4 border-b border-near-black/15">
              Awards
            </h2>
            <div className="space-y-5">
              {cvData.awards.map((award, i) => (
                <AwardCard key={i} award={award} />
              ))}
            </div>
          </section>

          {/* ── Education ── */}
          <section>
            <h2 className="font-serif text-3xl text-near-black mb-10 pb-4 border-b border-near-black/15">
              Education
            </h2>
            <div className="space-y-5">
              {cvData.education.map((edu, i) => (
                <div key={i} className="bg-white rounded-xl border border-near-black/8 p-6 hover:border-near-black/15 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-sans text-lg font-semibold text-near-black mb-1.5">{edu.school}</h3>
                      <OrgHighlight name={edu.location} color="yellow-green" />
                    </div>
                    <DateDisplay dates={edu.dates} />
                  </div>
                  <ul className="space-y-2 mt-4">
                    {edu.degrees.map((degree: string, j: number) => (
                      <li key={j} className="flex gap-3">
                        <span className="shrink-0 w-1 h-1 rounded-full bg-tangerine mt-2 block" />
                        <p className="font-sans text-sm text-near-black/65">{degree}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  )
}
