'use client'

import { useState } from 'react'
import { cvData } from '@/data/cv'

type Role = (typeof cvData.workExperience)[0]

function RoleCard({ role }: { role: Role }) {
  return (
    <div className="bg-white rounded-xl border border-near-black/8 p-6 hover:border-near-black/15 transition-colors">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-sans text-lg font-semibold text-near-black mb-1.5">{role.title}</h3>
          <span className="font-sans text-sm font-normal text-near-black relative inline-block">
            <span className="relative z-10">{role.company}</span>
            <span className="absolute bottom-0 left-0 right-0 h-2.5 z-0 rounded-sm bg-banana/65" />
          </span>
        </div>
        <span className="font-sans text-xs text-near-black/40 bg-near-black/5 px-3 py-1 rounded-full shrink-0 whitespace-nowrap">
          {role.dates}
        </span>
      </div>
      <ul className="space-y-2 mt-4">
        {role.bullets.map((bullet: string, j: number) => (
          <li key={j} className="flex gap-3">
            <span className="shrink-0 w-1 h-1 rounded-full bg-tangerine mt-2 block" />
            <p className="font-sans text-sm text-near-black/65 leading-relaxed">{bullet}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function EarlyCareerToggle({ roles }: { roles: Role[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-sans text-sm text-near-black/50 hover:text-near-black border border-near-black/15 hover:border-near-black/30 px-5 py-2.5 rounded-full transition-colors"
      >
        {open ? 'Hide early career ↑' : 'Show early career (college years) ↓'}
      </button>
      {open && (
        <div className="space-y-5 mt-5">
          {roles.map((role, i) => (
            <RoleCard key={i} role={role} />
          ))}
        </div>
      )}
    </div>
  )
}
