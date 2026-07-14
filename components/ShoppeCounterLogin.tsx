'use client'

import { FormEvent, useState } from 'react'

export default function ShoppeCounterLogin({ initialError }: { initialError?: boolean }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(initialError ? 'That sign-in link did not work. Request a fresh one.' : '')
  const [sending, setSending] = useState(false)

  async function sendLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setMessage('')

    const response = await fetch('/api/shoppe/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const result = await response.json().catch(() => ({})) as { error?: string }
    setSending(false)
    setMessage(response.ok ? 'Check your email for the private Counter sign-in link.' : result.error ?? 'Unable to send a sign-in link.')
  }

  return (
    <form onSubmit={sendLink} className="mt-8 grid gap-4">
      <label className="grid gap-2 text-sm font-bold text-[#382721]">
        Email address
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-[#382721]/20 bg-white px-4 py-3 text-base font-normal outline-none focus:border-[#d84e72] focus:ring-2 focus:ring-[#d84e72]/20"
          placeholder="you@example.com"
        />
      </label>
      <button disabled={sending} className="rounded-full bg-[#382721] px-5 py-3 font-bold text-white disabled:opacity-60">
        {sending ? 'Sending…' : 'Send private sign-in link'}
      </button>
      {message && <p role="status" className="text-sm leading-6 text-[#382721]/75">{message}</p>}
    </form>
  )
}
