'use client'

import { useRef, useEffect } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'

// ── Scroll keyframes (over 600 vh) ──────────────────────────────────────────
const SLICE_START = 0.12   // panels begin sliding
const SLICE_END   = 0.44   // panels fully off-screen, England background revealed
const TEXT_START  = 0.48   // "CALL-UP" heading slides up
const TEXT_END    = 0.60
const YEAR_START  = 0.63
const YEAR_END    = 0.73

export default function EnglandCallUp() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const leftPanelRef  = useRef<HTMLDivElement>(null)
  const rightPanelRef = useRef<HTMLDivElement>(null)
  const textRef       = useRef<HTMLDivElement>(null)
  const yearRef       = useRef<HTMLDivElement>(null)
  const leftIframeRef  = useRef<HTMLIFrameElement>(null)
  const rightIframeRef = useRef<HTMLIFrameElement>(null)

  // ── YouTube: left-panel FA Cup player ──────────────────────────────────
  useEffect(() => {
    let player: YT.Player | null = null
    let loop: ReturnType<typeof setInterval> | null = null
    let cancelled = false

    const init = () => {
      if (cancelled || !leftIframeRef.current) return
      player = new YT.Player(leftIframeRef.current, {
        events: {
          onReady: (e: YT.PlayerEvent) => {
            e.target.seekTo(570, true); e.target.mute(); e.target.playVideo()
          },
        },
      })
      loop = setInterval(() => {
        if (!player || typeof player.getCurrentTime !== 'function') return
        const t = player.getCurrentTime()
        if (t >= 630 || t < 565) player.seekTo(570, true)
      }, 500)
    }

    // Initialise only when section enters the viewport (performance)
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
      if (loop) clearInterval(loop)
      if (player && typeof player.destroy === 'function') { try { player.destroy() } catch {} }
    }
  }, [])

  // ── YouTube: right-panel FA Cup player ─────────────────────────────────
  useEffect(() => {
    let player: YT.Player | null = null
    let loop: ReturnType<typeof setInterval> | null = null
    let cancelled = false

    const init = () => {
      if (cancelled || !rightIframeRef.current) return
      player = new YT.Player(rightIframeRef.current, {
        events: {
          onReady: (e: YT.PlayerEvent) => {
            e.target.seekTo(570, true); e.target.mute(); e.target.playVideo()
          },
        },
      })
      loop = setInterval(() => {
        if (!player || typeof player.getCurrentTime !== 'function') return
        const t = player.getCurrentTime()
        if (t >= 630 || t < 565) player.seekTo(570, true)
      }, 500)
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
      if (loop) clearInterval(loop)
      if (player && typeof player.destroy === 'function') { try { player.destroy() } catch {} }
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // Slice: left panel slides UP, right panel slides DOWN
    const pct = v >= SLICE_START
      ? Math.min(1, (v - SLICE_START) / (SLICE_END - SLICE_START)) * 110
      : 0
    if (leftPanelRef.current)  leftPanelRef.current.style.transform  = `translateY(-${pct}%)`
    if (rightPanelRef.current) rightPanelRef.current.style.transform = `translateY(${pct}%)`

    // "ENGLAND / CALL-UP" heading slides up after slice
    if (textRef.current) {
      let op = 0, ty = 60
      if (v >= TEXT_START && v <= TEXT_END) {
        const t = (v - TEXT_START) / (TEXT_END - TEXT_START)
        op = t; ty = 60 * (1 - t)
      } else if (v > TEXT_END) {
        op = 1; ty = 0
      }
      textRef.current.style.opacity   = String(Math.max(0, Math.min(1, op)))
      textRef.current.style.transform = `translateY(${ty}px)`
    }

    // Year drifts up at bottom-left
    if (yearRef.current) {
      let op = 0, ty = 20
      if (v >= YEAR_START && v <= YEAR_END) {
        const t = (v - YEAR_START) / (YEAR_END - YEAR_START)
        op = t; ty = 20 * (1 - t)
      } else if (v > YEAR_END) {
        op = 1; ty = 0
      }
      yearRef.current.style.opacity   = String(Math.max(0, Math.min(1, op)))
      yearRef.current.style.transform = `translateY(${ty}px)`
    }
  })

  const iframeClass = 'absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none'

  return (
    <div ref={containerRef} style={{ height: '600vh' }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: '#ffffff' }}>


        {/* ── Left panel: left half of FA Cup video — slides UP (desktop only) ── */}
        <div
          ref={leftPanelRef}
          className="absolute inset-0 z-10 hidden md:block"
          style={{ clipPath: 'inset(0 50% 0 0)' }}
        >
          <iframe
            ref={leftIframeRef}
            id="yt-england-left"
            src="https://www.youtube.com/embed/wUjUDkx0pVs?autoplay=1&mute=1&controls=0&start=570&loop=1&playlist=wUjUDkx0pVs&rel=0&showinfo=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
            allow="autoplay; fullscreen"
            className={iframeClass}
            style={{ border: 'none' }}
          />
        </div>

        {/* ── Right panel: right half of FA Cup video — slides DOWN (desktop only) ── */}
        <div
          ref={rightPanelRef}
          className="absolute inset-0 z-10 hidden md:block"
          style={{ clipPath: 'inset(0 0 0 50%)' }}
        >
          <iframe
            ref={rightIframeRef}
            id="yt-england-right"
            src="https://www.youtube.com/embed/wUjUDkx0pVs?autoplay=1&mute=1&controls=0&start=570&loop=1&playlist=wUjUDkx0pVs&rel=0&showinfo=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
            allow="autoplay; fullscreen"
            className={iframeClass}
            style={{ border: 'none' }}
          />
        </div>

        {/* ── ENGLAND / CALL-UP text — desktop: slides up after the slice ── */}
        <div
          ref={textRef}
          className="absolute z-20 top-[104px] left-6 max-w-md pointer-events-none hidden md:block"
          style={{ opacity: 0, transform: 'translateY(60px)' }}
        >
          <h2 style={{ margin: '0 0 18px', padding: 0, lineHeight: 0.88 }}>
            <span style={{
              display: 'block',
              fontFamily: 'Kegilka, serif',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              lineHeight: 0.88,
              fontWeight: 400,
              color: '#ffffff',
            }}>
              ENGLAND
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 5rem)',
              lineHeight: 0.88,
              fontWeight: 300,
              color: '#ffffff',
            }}>
              CALL-UP
            </span>
          </h2>
        </div>

        {/* ── Mobile only: full-screen overlay, flex pushes content to the bottom ── */}
        <div
          className="absolute inset-0 z-20 pointer-events-none md:hidden"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingLeft: 16, paddingRight: 16, paddingBottom: 16 }}
        >
          <h2 style={{ margin: '0 0 12px', padding: 0, lineHeight: 0.88 }}>
            <span style={{
              display: 'block',
              fontFamily: 'Kegilka, serif',
              fontSize: 'clamp(2rem, 9vw, 3rem)',
              lineHeight: 0.88,
              fontWeight: 400,
              color: '#ffffff',
            }}>
              ENGLAND
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: 'clamp(2rem, 9vw, 3rem)',
              lineHeight: 0.88,
              fontWeight: 300,
              color: '#ffffff',
            }}>
              CALL-UP
            </span>
          </h2>
          <p style={{
            fontFamily: 'Mona Sans, sans-serif',
            fontSize: '0.8rem',
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.72)',
            margin: '0 0 14px',
            maxWidth: 340,
          }}>
            Called up to the England senior squad for the first time in October 2020.
            19-year-old Saka stepped onto the international stage with an assist on debut —
            and never looked back. One of the Three Lions&apos; most important players,
            he would carry the weight of a nation at Euro 2020 and beyond.
          </p>
          <span
            style={{
              fontFamily: 'Kegilka, serif',
              fontSize: '4.5rem',
              lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: '2px #ffffff',
              letterSpacing: '-0.05em',
              display: 'block',
            }}
          >
            2020
          </span>
        </div>

        {/* ── 2020 year — bottom-left (desktop only) ── */}
        <div
          ref={yearRef}
          className="absolute bottom-6 left-6 z-20 pointer-events-none select-none hidden md:block"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          <span
            className="text-9xl text-transparent tracking-tighter"
            style={{ fontFamily: 'Kegilka, serif', WebkitTextStroke: '2px #ffffff' }}
          >
            2020
          </span>
        </div>

      </div>
    </div>
  )
}
