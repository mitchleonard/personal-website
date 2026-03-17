'use client'

import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <main>
      <Nav />
      <section className="pt-28 pb-20 px-6 min-h-screen">
        <div className="max-w-xl mx-auto">
          <p className="font-sans text-xs uppercase tracking-widest text-near-black/40 mb-4">Get in touch</p>
          <h1 className="font-serif text-4xl md:text-5xl text-near-black leading-tight mb-4">
            Let&apos;s talk.
          </h1>
          <p className="font-sans text-lg text-near-black/60 mb-12">
            Whether it&apos;s an opportunity, a collaboration, or just a hello — reach out and I&apos;ll get back to you.
          </p>

          {status === 'success' ? (
            <div className="bg-accent/10 border border-accent/20 rounded-lg px-6 py-8 text-center">
              <p className="font-serif text-2xl text-near-black mb-2">Message sent.</p>
              <p className="font-sans text-base text-near-black/60">Thanks for reaching out — I&apos;ll be in touch soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block font-sans text-xs uppercase tracking-widest text-near-black/50 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full font-sans text-base text-near-black bg-transparent border-b border-near-black/20 focus:border-near-black pb-3 outline-none transition-colors placeholder:text-near-black/30"
                />
              </div>

              <div>
                <label htmlFor="email" className="block font-sans text-xs uppercase tracking-widest text-near-black/50 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full font-sans text-base text-near-black bg-transparent border-b border-near-black/20 focus:border-near-black pb-3 outline-none transition-colors placeholder:text-near-black/30"
                />
              </div>

              <div>
                <label htmlFor="message" className="block font-sans text-xs uppercase tracking-widest text-near-black/50 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="What&apos;s on your mind?"
                  className="w-full font-sans text-base text-near-black bg-transparent border-b border-near-black/20 focus:border-near-black pb-3 outline-none transition-colors resize-none placeholder:text-near-black/30"
                />
              </div>

              {status === 'error' && (
                <p className="font-sans text-sm text-red-600">
                  Something went wrong. Try emailing me directly at{' '}
                  <a href="mailto:mitch@mitchleonard.com" className="underline">mitch@mitchleonard.com</a>.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="font-sans text-sm uppercase tracking-widest px-8 py-4 bg-near-black text-off-white hover:bg-accent transition-colors rounded-sm disabled:opacity-50"
              >
                {status === 'sending' ? 'Sending...' : 'Send message'}
              </button>
            </form>
          )}

          <div className="mt-16 pt-10 border-t border-near-black/10">
            <p className="font-sans text-sm text-near-black/50 mb-4">Or reach me directly:</p>
            <div className="flex flex-wrap gap-6">
              <a
                href="mailto:mitch@mitchleonard.com"
                className="font-sans text-sm text-near-black hover:text-accent transition-colors"
              >
                mitch@mitchleonard.com
              </a>
              <a
                href="https://linkedin.com/in/mitchellleonard"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm text-near-black hover:text-accent transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
