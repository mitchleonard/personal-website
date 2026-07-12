'use client'

import { useIceCreamMode } from '@/lib/useIceCreamMode'

// Progressive disclosure, on purpose:
//   OFF — a bare 🍦 cone. Quiet enough to stay an easter egg a curious
//         visitor discovers and taps.
//   ON  — the cone expands into a clearly-labeled switch (reusing the
//         .ice-mode-toggle styles in globals.css) so, once the whimsy is
//         running, turning it back off is obvious and stays one tap away on
//         every page the visitor navigates to.
export default function IceCreamToggle({
  className = '',
  label,
}: {
  className?: string
  label?: string
}) {
  const [on, toggle] = useIceCreamMode()

  if (!on) {
    return (
      <button
        type="button"
        onClick={toggle}
        role="switch"
        aria-checked={false}
        aria-label="Turn on ice cream mode"
        title="Ice cream mode"
        className={className}
      >
        <span className="ic-cone">🍦</span>
        {label && <span>{label}</span>}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={true}
      aria-label="Turn off ice cream mode"
      title="Ice cream mode"
      className="ice-mode-toggle"
    >
      <span className="ice-mode-toggle__track" aria-hidden="true">
        <span className="ice-mode-toggle__thumb">🍦</span>
      </span>
    </button>
  )
}
