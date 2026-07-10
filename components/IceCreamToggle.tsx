'use client'

import { useIceCreamMode } from '@/lib/useIceCreamMode'

export default function IceCreamToggle({
  className = '',
  label,
}: {
  className?: string
  label?: string
}) {
  const [on, toggle] = useIceCreamMode()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn off ice cream mode' : 'Turn on ice cream mode'}
      title="Ice cream mode"
      className={className}
    >
      <span className="ic-cone">🍦</span>
      {label && <span>{label}</span>}
    </button>
  )
}
