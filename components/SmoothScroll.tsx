'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

if (typeof window !== 'undefined') {
  ;(window as any).LenisClass = Lenis
}

export default function SmoothScroll() {
  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (coarsePointer || reducedMotion) {
      delete (window as unknown as Record<string, unknown>).__lenis
      return
    }

    const lenis = new Lenis({
      duration: window.innerWidth > 768 ? 1.4 : 1.44,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      prevent: (node: HTMLElement) =>
        !!node.closest?.('[data-overlay-scroll]'),
    })

    // Expose instance so Navigation can call lenis.scrollTo() for smooth anchor jumps
    ;(window as unknown as Record<string, unknown>).__lenis = lenis

    const onStop  = () => lenis.stop()
    const onStart = () => lenis.start()
    window.addEventListener('lenis:stop',  onStop)
    window.addEventListener('lenis:start', onStart)

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      delete (window as unknown as Record<string, unknown>).__lenis
      window.removeEventListener('lenis:stop',  onStop)
      window.removeEventListener('lenis:start', onStart)
    }
  }, [])

  return null
}
