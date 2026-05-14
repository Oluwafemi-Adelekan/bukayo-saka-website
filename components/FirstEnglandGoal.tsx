'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { useScroll, useMotionValueEvent } from 'framer-motion'

// Video panel slides in over the first 60% of scroll, then holds for 40%.
const SLIDE_END = 0.6

export default function FirstEnglandGoal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoPanelRef = useRef<HTMLDivElement>(null)
  const iframeRef     = useRef<HTMLIFrameElement>(null)

  // YouTube — polling-only init
  useEffect(() => {
    let player: YT.Player | null = null
    let cancelled = false

    const init = () => {
      if (cancelled || !iframeRef.current) return
      player = new YT.Player(iframeRef.current, {
        events: {
          onReady: (e: YT.PlayerEvent) => {
            e.target.mute(); e.target.playVideo()
          },
          onStateChange: (e: YT.OnStateChangeEvent) => {
            if (e.data === YT.PlayerState.ENDED) e.target.playVideo()
          },
        },
      })
    }

    if (!containerRef.current) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        obs.disconnect()
        const poll = setInterval(() => {
          if (typeof YT !== 'undefined' && YT.Player) { clearInterval(poll); init() }
        }, 100)
      }
    }, { threshold: 0.01 })
    obs.observe(containerRef.current)

    return () => {
      cancelled = true; obs.disconnect()
      if (player && typeof player.destroy === 'function') { try { player.destroy() } catch {} }
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!videoPanelRef.current) return
    const t = Math.max(0, Math.min(1, v / SLIDE_END))
    videoPanelRef.current.style.transform = `translateX(${(1 - t) * 100}%)`
  })

  return (
    // 200vh: 60% slide + 40% hold
    <div ref={containerRef} style={{ height: '200vh' }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">


        {/* Video panel — slides IN from RIGHT over the England image */}
        <div
          ref={videoPanelRef}
          className="absolute inset-0 bg-[#09090b]"
          style={{ transform: 'translateX(100%)', willChange: 'transform' }}
        >
          <iframe
            ref={iframeRef}
            id="yt-england-goal"
            src="https://www.youtube.com/embed/MPf5WiO8nv0?autoplay=1&mute=1&controls=0&loop=1&playlist=MPf5WiO8nv0&rel=0&showinfo=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
            allow="autoplay; fullscreen"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              border: 'none',
              width: 'max(100%, calc(100vh * 16 / 9))',
              height: 'max(100%, calc(100vw * 9 / 16))',
            }}
          />
        </div>

      </div>
    </div>
  )
}
