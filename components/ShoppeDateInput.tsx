'use client'

import { useState } from 'react'

const fieldClass = 'flex w-full min-w-0 max-w-full items-center justify-between rounded-xl border border-[#382721]/20 bg-white px-4 py-3 text-base font-normal'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

function CalendarIcon() {
  return <svg className="size-5 shrink-0 text-[#382721]/55" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 3v3m10-3v3M4.5 9.5h15M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
  </svg>
}

export default function ShoppeDateInput({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  const [value, setValue] = useState(defaultValue)

  return (
    <label className="grid min-w-0 gap-2 text-sm font-bold">
      {label}
      <span className="relative block min-w-0 rounded-xl focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#d84e72]">
        <span aria-hidden="true" className={fieldClass}>
          <span>{value ? formatDate(value) : 'Choose a date'}</span>
          <CalendarIcon />
        </span>
        <input
          aria-label={label}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          name={name}
          type="date"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </span>
    </label>
  )
}
