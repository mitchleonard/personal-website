interface Result {
  value: string
  label: string
}

export default function ResultsBlock({ results }: { results: Result[] }) {
  if (!results || results.length === 0) return null

  return (
    <div className="bg-near-black rounded-sm px-8 py-10 md:py-14">
      <div className="flex flex-wrap gap-x-12 gap-y-10 justify-center md:justify-start">
        {results.map((result, i) => (
          <div key={i} className="text-center md:text-left min-w-[120px]">
            <div
              className="font-serif text-off-white leading-none"
              style={{ fontSize: 'clamp(48px, 6vw, 80px)' }}
            >
              {result.value}
            </div>
            <div className="font-sans text-xs text-off-white/50 uppercase tracking-widest mt-2">
              {result.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
