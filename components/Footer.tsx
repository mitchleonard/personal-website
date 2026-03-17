import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-near-black text-off-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <Link href="/" className="font-serif text-2xl hover:text-accent transition-colors">
            Mitch Leonard
          </Link>
          <nav className="flex flex-wrap gap-6">
            <Link href="/#work" className="font-sans text-sm text-off-white/60 hover:text-off-white transition-colors">Work</Link>
            <Link href="/projects" className="font-sans text-sm text-off-white/60 hover:text-off-white transition-colors">Projects</Link>
            <Link href="/cv" className="font-sans text-sm text-off-white/60 hover:text-off-white transition-colors">CV</Link>
            <a href="https://linkedin.com/in/mitchellleonard" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-off-white/60 hover:text-off-white transition-colors">LinkedIn</a>
            <a href="https://github.com/mitchleonard" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-off-white/60 hover:text-off-white transition-colors">GitHub</a>
            <Link href="/contact" className="font-sans text-sm text-off-white/60 hover:text-off-white transition-colors">Contact</Link>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-off-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="font-sans text-xs text-off-white/40">📍Minneapolis</p>
          <p className="font-sans text-xs text-off-white/40">Powered by 🍦</p>
        </div>
      </div>
    </footer>
  )
}
