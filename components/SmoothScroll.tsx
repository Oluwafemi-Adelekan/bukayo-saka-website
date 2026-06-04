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

    // Snap targets, shared by both the desktop (Lenis) and mobile (native) paths.
    const SNAP_IDS = ['hero', 'story', 'club-and-country', 'foundation', 'commercial', 'fixtures']
    const overlayOpen = () =>
      !!document.querySelector('[data-story-overlay][data-story-open="true"]')
    const findClosest = () => {
      let closest: HTMLElement | null = null
      let minDiff = Infinity
      for (const id of SNAP_IDS) {
        const sec = document.getElementById(id)
        if (!sec) continue
        const diff = Math.abs(sec.getBoundingClientRect().top)
        if (diff < minDiff) { minDiff = diff; closest = sec }
      }
      return { closest, minDiff }
    }

    // ── Touch devices: Lenis is off, so snap with native smooth scroll ──
    if (coarsePointer) {
      delete (window as unknown as Record<string, unknown>).__lenis
      if (reducedMotion) return

      let idleTimer: ReturnType<typeof setTimeout>
      let snapClear: ReturnType<typeof setTimeout>
      let snapping = false

      const onScroll = () => {
        if (snapping) return
        clearTimeout(idleTimer)
        idleTimer = setTimeout(() => {
          if (overlayOpen()) return
          const { closest, minDiff } = findClosest()
          // Snap only when near a boundary — never yanks mid pinned section.
          if (!closest || minDiff <= 8 || minDiff > window.innerHeight * 0.5) return
          snapping = true
          const top = window.scrollY + closest.getBoundingClientRect().top
          window.scrollTo({ top, behavior: 'smooth' })
          clearTimeout(snapClear)
          snapClear = setTimeout(() => { snapping = false }, 760)
        }, 140)
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        window.removeEventListener('scroll', onScroll)
        clearTimeout(idleTimer)
        clearTimeout(snapClear)
      }
    }

    if (reducedMotion) {
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

    let scrollTimeout: ReturnType<typeof setTimeout>
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
        if (overlayOpen()) return
        const { closest, minDiff } = findClosest()
        if (!closest || minDiff <= 10) return

        isSnapping = true
        lenis.scrollTo(closest, {
          duration: 0.8,
          easing: (t: number) => t, // Linear animation as requested
          onComplete: () => {
            isSnapping = false
          }
        })
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
