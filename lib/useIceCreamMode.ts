'use client'

import { useEffect, useState } from 'react'

// Ice cream mode lives as a `data-icecream` attribute on <html> so every
// style swap is pure CSS (see html[data-icecream] in globals.css) and the
// mode survives route changes even though Nav/Footer remount per page.
// An inline script in app/layout.tsx restores it from localStorage pre-paint.

const STORAGE_KEY = 'icecream-mode'
const EVENT = 'icecreamchange'

export function isIceCreamOn(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.dataset.icecream === 'on'
}

export function setIceCream(on: boolean) {
  if (on) {
    document.documentElement.dataset.icecream = 'on'
  } else {
    delete document.documentElement.dataset.icecream
  }
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch {
    // localStorage unavailable (private mode) — mode still works for the session
  }
  window.dispatchEvent(new Event(EVENT))
}

export function useIceCreamMode(): [boolean, () => void] {
  // Starts false on server and first client render; syncs post-mount.
  const [on, setOn] = useState(false)

  useEffect(() => {
    const sync = () => setOn(isIceCreamOn())
    sync()
    window.addEventListener(EVENT, sync)
    // Cross-tab: storage fires in other tabs; mirror the change into the DOM.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return
      setIceCream(e.newValue === 'on')
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(EVENT, sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const toggle = () => setIceCream(!isIceCreamOn())

  return [on, toggle]
}
