'use client'

import { useIceCreamMode } from '@/lib/useIceCreamMode'

// A persistent on/off slider. The 🍦 rides inside a glossy knob that slides
// between OFF (left, muted cream track) and ON (right, strawberry→cherry
// track with a sprinkle dusting + a wiggling cone). It stays visible in both
// states so the mode can be flipped from anywhere — the nav on every page and
// the Ice Cream Shoppe. The outer button carries the caller's className so it
// can line up with surrounding items (e.g. the mobile nav links).
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
      role="switch"
      aria-checked={on}
      aria-label={on ? 'Turn off ice cream mode' : 'Turn on ice cream mode'}
      title="Ice cream mode"
      className={`ice-mode-toggle ${className}`.trim()}
    >
      <span className="ice-mode-toggle__track" aria-hidden="true">
        <span className="ice-mode-toggle__thumb">
          <span className="ice-mode-toggle__cone">🍦</span>
        </span>
      </span>
      {label && <span className="ice-mode-toggle__label">{label}</span>}
    </button>
  )
}
