interface DotMatrixLoaderProps {
  label?: string
  className?: string
}

const cells = Array.from({ length: 9 }, (_, index) => index)

export default function DotMatrixLoader({
  label = 'Loading',
  className = '',
}: DotMatrixLoaderProps) {
  return (
    <div
      className={`dot-matrix-loader ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span className="dot-matrix-loader__grid" aria-hidden="true">
        {cells.map((cell) => {
          const x = cell % 3
          const y = Math.floor(cell / 3)
          const delay = (x + y) * 90

          return (
            <span
              key={cell}
              className="dot-matrix-loader__dot"
              style={{ animationDelay: `${delay}ms` }}
            />
          )
        })}
      </span>
      <span className="sr-only">{label}</span>
    </div>
  )
}
