import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { cvData } from '@/data/cv'
import Link from 'next/link'

export const metadata = {
  title: 'CV — Mitch Leonard',
  description: 'Full curriculum vitae for Mitch Leonard — communications strategist, AI lead, and digital builder.',
}

export default function CVPage() {
  return (
    <main>
      <Nav />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Page header */}
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h1 className="font-serif text-5xl md:text-6xl text-near-black mb-3">CV</h1>
              <p className="font-sans text-lg text-near-black/50">Mitch Leonard</p>
            </div>
            <a
              href="#"
              className="font-sans text-sm font-medium text-near-black border border-near-black/20 px-5 py-2.5 hover:bg-near-black hover:text-off-white transition-colors inline-block"
            >
              Download PDF ↓
            </a>
          </div>

          {/* Work Experience */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-near-black mb-10 pb-4 border-b border-near-black/15">
              Work Experience
            </h2>
            <div className="space-y-12">
              {cvData.workExperience.map((role, i) => (
                <div key={i}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-4">
                    <div>
                      <h3 className="font-sans text-lg font-medium text-near-black">{role.title}</h3>
                      <p className="font-sans text-sm text-accent font-medium">{role.company}</p>
                      {role.note && (
                        <p className="font-sans text-xs text-near-black/40 italic mt-0.5">{role.note}</p>
                      )}
                    </div>
                    <p className="font-sans text-sm text-near-black/50 md:text-right shrink-0">{role.dates}</p>
                  </div>
                  <ul className="space-y-2 ml-0">
                    {role.bullets.map((bullet, j) => (
                      <li key={j} className="flex gap-3">
                        <span className="shrink-0 text-accent mt-1.5">–</span>
                        <p className="font-sans text-sm text-near-black/70 leading-relaxed">{bullet}</p>
                      </li>
                    ))}
                  </ul>
                  {role.clients && (
                    <p className="font-sans text-xs text-near-black/50 mt-4 italic">
                      <span className="not-italic font-medium text-near-black/60">Clients: </span>
                      {role.clients}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Volunteer Experience */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-near-black mb-10 pb-4 border-b border-near-black/15">
              Volunteer Experience
            </h2>
            <div className="space-y-8">
              {cvData.volunteerExperience.map((role, i) => (
                <div key={i}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="font-sans text-base font-medium text-near-black">{role.title}</h3>
                      <p className="font-sans text-sm text-accent">{role.organization}</p>
                    </div>
                    <p className="font-sans text-sm text-near-black/50 md:text-right shrink-0">{role.dates}</p>
                  </div>
                  <p className="font-sans text-sm text-near-black/70 leading-relaxed">{role.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Awards */}
          <section className="mb-16">
            <h2 className="font-serif text-3xl text-near-black mb-10 pb-4 border-b border-near-black/15">
              Awards
            </h2>
            <div className="space-y-8">
              {cvData.awards.map((award, i) => (
                <div key={i}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-1">
                    <div>
                      <span className="font-sans text-base font-medium text-near-black">{award.name}</span>
                      <span className="font-sans text-sm text-accent ml-3">{award.org}</span>
                    </div>
                    <span className="font-sans text-sm text-near-black/40 shrink-0">{award.year}</span>
                  </div>
                  {award.description && (
                    <p className="font-sans text-sm text-near-black/60 leading-relaxed">{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="font-serif text-3xl text-near-black mb-10 pb-4 border-b border-near-black/15">
              Education
            </h2>
            {cvData.education.map((edu, i) => (
              <div key={i}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-2">
                  <div>
                    <h3 className="font-sans text-base font-medium text-near-black">{edu.school}</h3>
                    <p className="font-sans text-sm text-near-black/50">{edu.location}</p>
                  </div>
                  <p className="font-sans text-sm text-near-black/50 md:text-right">{edu.dates}</p>
                </div>
                <ul className="mt-2 space-y-1">
                  {edu.degrees.map((degree, j) => (
                    <li key={j} className="font-sans text-sm text-near-black/70">{degree}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

        </div>
      </div>
      <Footer />
    </main>
  )
}
