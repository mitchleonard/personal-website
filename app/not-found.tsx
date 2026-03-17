import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <main>
      <Nav />
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="font-sans text-xs uppercase tracking-widest text-accent mb-4">404</p>
        <h1 className="font-serif text-5xl md:text-7xl text-near-black mb-6">Page not found</h1>
        <p className="font-sans text-base text-near-black/60 mb-10 max-w-md">
          That page doesn&apos;t exist — or it moved. Head back to the homepage.
        </p>
        <Link
          href="/"
          className="font-sans text-sm font-medium border border-near-black/20 px-6 py-3 hover:bg-near-black hover:text-off-white transition-colors"
        >
          ← Back home
        </Link>
      </div>
      <Footer />
    </main>
  )
}
