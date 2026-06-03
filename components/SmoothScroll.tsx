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

    // Programmatic Scroll Snapping Logic
    let scrollTimeout: NodeJS.Timeout
    let isSnapping = false
    let isInteracting = false

    const handleInteractStart = () => { isInteracting = true }
    const handleInteractEnd = () => {
      isInteracting = false
      checkSnap()
    }

    window.addEventListener('mousedown', handleInteractStart)
    window.addEventListener('mouseup', handleInteractEnd)
    window.addEventListener('touchstart', handleInteractStart)
    window.addEventListener('touchend', handleInteractEnd)

    const checkSnap = () => {
      if (isSnapping || isInteracting) return
      
      const sections = ['#hero', '#story', '#club-and-country', '#foundation', '#commercial', '#fixtures']
      const wh = window.innerHeight
      
      for (const sel of sections) {
        const el = document.querySelector(sel) as HTMLElement
        if (!el) continue
        
        const rect = el.getBoundingClientRect()
        const elementTopAbsolute = window.scrollY + rect.top
        
        // Transition zone where section boundary crosses viewport
        const zoneStart = elementTopAbsolute - wh
        const zoneEnd = elementTopAbsolute
        
        // If current scroll is within the boundary transition zone (50% visibility)
        if (window.scrollY > zoneStart && window.scrollY < zoneEnd) {
          const distanceToStart = window.scrollY - zoneStart
          const distanceToEnd = zoneEnd - window.scrollY
          
          if (distanceToEnd < distanceToStart && distanceToEnd > 5) {
            // Snap forward to the section's top
            isSnapping = true
            lenis.scrollTo(zoneEnd, { duration: 0.45, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
            setTimeout(() => { isSnapping = false }, 550)
            break
          } else if (distanceToStart < distanceToEnd && distanceToStart > 5) {
            // Snap back off the screen
            isSnapping = true
            lenis.scrollTo(zoneStart, { duration: 0.45, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
            setTimeout(() => { isSnapping = false }, 550)
            break
          }
        }
      }
    }

    lenis.on('scroll', () => {
      if (isSnapping || isInteracting) return
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(checkSnap, 50)
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
      window.removeEventListener('mousedown', handleInteractStart)
      window.removeEventListener('mouseup', handleInteractEnd)
      window.removeEventListener('touchstart', handleInteractStart)
      window.removeEventListener('touchend', handleInteractEnd)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return null
}
