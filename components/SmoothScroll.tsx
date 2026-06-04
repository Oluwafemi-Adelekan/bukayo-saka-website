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

    let scrollTimeout: NodeJS.Timeout
    let isSnapping = false

    const cancelSnap = () => {
      if (isSnapping) {
        isSnapping = false
      }
    }
    window.addEventListener('wheel', cancelSnap, { passive: true })
    window.addEventListener('touchstart', cancelSnap, { passive: true })

    lenis.on('scroll', () => {
      if (isSnapping) return

      clearTimeout(scrollTimeout)
      
      scrollTimeout = setTimeout(() => {
        const ids = ['hero', 'story', 'club-and-country', 'foundation', 'commercial', 'fixtures']
        const sections = ids.map(id => document.getElementById(id)).filter(Boolean)
        if (!sections.length) return

        let closest = sections[0]
        let minDiff = Infinity

        for (const sec of sections) {
          const rect = sec!.getBoundingClientRect()
          const dist = Math.abs(rect.top)
          if (dist < minDiff) {
            minDiff = dist
            closest = sec
          }
        }

        if (minDiff > 10) {
          isSnapping = true
          lenis.scrollTo(closest!, {
            duration: 0.8,
            easing: (t: number) => t, // Linear animation as requested
            onComplete: () => {
              isSnapping = false
            }
          })
        }
      }, 150)
    })

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
      window.removeEventListener('wheel', cancelSnap)
      window.removeEventListener('touchstart', cancelSnap)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return null
}
