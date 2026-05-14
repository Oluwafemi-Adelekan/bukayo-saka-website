'use client'

import { useRef, useEffect, useState } from 'react'
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion'

const PAD        = 24
const SHRINK_END = 0.48   // scroll progress when the square is fully formed
const SWAP_START = 0.22   // debut fades out / FA Cup fades in from here → SHRINK_END
const TEXT_START = 0.52
const TEXT_END   = 0.68
const YEAR_START = 0.70
const YEAR_END   = 0.85

export default function FACupWinner() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const debutRef      = useRef<HTMLIFrameElement>(null)
  const facupRef      = useRef<HTMLIFrameElement>(null)
  const debutLayerRef = useRef<HTMLDivElement>(null)
  const facupLayerRef = useRef<HTMLDivElement>(null)
  const infoRef       = useRef<HTMLDivElement>(null)
  const yearRef       = useRef<HTMLDivElement>(null)

  const dimsRef = useRef({ squarePx: 0, navH: 66 })
  const [textPos, setTextPos] = useState({ left: 0, top: 0, mobile: false })

  useEffect(() => {
    const update = () => {
      const navH    = window.innerWidth >= 1024 ? 66 : 74
      const squarePx = window.innerHeight - navH - 2 * PAD
      dimsRef.current = { squarePx, navH }
      if (window.innerWidth < 768) {
        // On mobile the square is wider than the viewport — overlay text at the bottom
        setTextPos({ left: PAD, top: 0, mobile: true })
      } else {
        // Text sits 24 px to the right of the square's right edge
        setTextPos({ left: squarePx + 2 * PAD, top: navH + PAD, mobile: false })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // ── YouTube: debut continuation (same clip, continues from ProfessionalDebut) ──
  useEffect(() => {
    let player: YT.Player | null = null
    let loop: ReturnType<typeof setInterval> | null = null
    let cancelled = false

    const init = () => {
      if (cancelled || !debutRef.current) return
      player = new YT.Player(debutRef.current, {
        events: {
          onReady: (e) => { e.target.seekTo(483, true); e.target.mute(); e.target.playVideo() },
        },
      })
      loop = setInterval(() => {
        if (!player || typeof player.getCurrentTime !== 'function') return
        const t = player.getCurrentTime()
        if (t >= 513 || t < 480) player.seekTo(483, true)
      }, 500)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).YT && !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
    const poll = setInterval(() => {
      if (typeof YT !== 'undefined' && YT.Player) { clearInterval(poll); init() }
    }, 100)

    return () => {
      cancelled = true; clearInterval(poll)
      if (loop) clearInterval(loop)
      if (player && typeof player.destroy === 'function') { try { player.destroy() } catch {} }
    }
  }, [])

  // ── YouTube: FA Cup celebration footage ──
  useEffect(() => {
    let player: YT.Player | null = null
    let loop: ReturnType<typeof setInterval> | null = null
    let cancelled = false

    const init = () => {
      if (cancelled || !facupRef.current) return
      player = new YT.Player(facupRef.current, {
        events: {
          onReady: (e) => { e.target.seekTo(570, true); e.target.mute(); e.target.playVideo() },
        },
      })
      loop = setInterval(() => {
        if (!player || typeof player.getCurrentTime !== 'function') return
        const t = player.getCurrentTime()
        if (t >= 630 || t < 565) player.seekTo(570, true)
      }, 500)
    }

    const poll = setInterval(() => {
      if (typeof YT !== 'undefined' && YT.Player) { clearInterval(poll); init() }
    }, 100)

    return () => {
      cancelled = true; clearInterval(poll)
      if (loop) clearInterval(loop)
      if (player && typeof player.destroy === 'function') { try { player.destroy() } catch {} }
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Container: full-screen → padded square anchored to the left.
  // left:  0 → PAD        (small rightward shift for left-edge padding)
  // top:   0 → navH + PAD (nav-aware top padding)
  // width: 100vw → squarePx
  // height:100vh → squarePx
  const vidLeft = useTransform(scrollYProgress, (v) => {
    const t = Math.max(0, Math.min(1, v / SHRINK_END))
    return `${PAD * t}px`
  })
  const vidTop = useTransform(scrollYProgress, (v) => {
    const { navH } = dimsRef.current
    const t = Math.max(0, Math.min(1, v / SHRINK_END))
    return `${(navH + PAD) * t}px`
  })
  const vidWidth = useTransform(scrollYProgress, (v) => {
    const { squarePx } = dimsRef.current
    const t = Math.max(0, Math.min(1, v / SHRINK_END))
    return `${window.innerWidth + (squarePx - window.innerWidth) * t}px`
  })
  const vidHeight = useTransform(scrollYProgress, (v) => {
    const { squarePx } = dimsRef.current
    const t = Math.max(0, Math.min(1, v / SHRINK_END))
    return `${window.innerHeight + (squarePx - window.innerHeight) * t}px`
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // Crossfade: debut fades out, FA Cup fades in
    if (debutLayerRef.current && facupLayerRef.current) {
      let debutOp = 1, facupOp = 0
      if (v >= SWAP_START && v <= SHRINK_END) {
        const t = (v - SWAP_START) / (SHRINK_END - SWAP_START)
        debutOp = 1 - t
        facupOp = t
      } else if (v > SHRINK_END) {
        debutOp = 0; facupOp = 1
      }
      debutLayerRef.current.style.opacity = String(debutOp)
      facupLayerRef.current.style.opacity  = String(facupOp)
    }

    // Info text slides in from the right
    if (infoRef.current) {
      let op = 0, tx = 30
      if (v >= TEXT_START && v <= TEXT_END) {
        const t = (v - TEXT_START) / (TEXT_END - TEXT_START)
        op = t; tx = 30 * (1 - t)
      } else if (v > TEXT_END) {
        op = 1; tx = 0
      }
      infoRef.current.style.opacity  = String(Math.max(0, Math.min(1, op)))
      infoRef.current.style.transform = `translateX(${tx}px)`
    }

    // Year drifts up into place
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

  const iframeClass = 'absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none'
  const iframeStyle: React.CSSProperties = {
    border: 'none',
    // Always natural 16:9 width for the full viewport height — crops right as container shrinks
    width: 'calc(100vh * 16 / 9)',
    height: '100%',
  }

  return (
    <div ref={containerRef} style={{ height: '400vh' }} className="relative bg-[#09090b]">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Shrinking video container: starts full-screen, ends as a padded square */}
        <motion.div
          style={{ left: vidLeft, top: vidTop, width: vidWidth, height: vidHeight }}
          className="absolute z-10 overflow-hidden"
        >
          {/* Layer 1 — debut video continuation */}
          <div ref={debutLayerRef} className="absolute inset-0" style={{ opacity: 1 }}>
            <iframe
              ref={debutRef}
              id="yt-debut-cont"
              src="https://www.youtube.com/embed/8Ul3ls6RKNY?autoplay=1&mute=1&controls=0&start=483&loop=1&playlist=8Ul3ls6RKNY&rel=0&showinfo=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
              allow="autoplay; fullscreen"
              className={iframeClass}
              style={iframeStyle}
            />
          </div>

          {/* Layer 2 — FA Cup celebration footage */}
          <div ref={facupLayerRef} className="absolute inset-0" style={{ opacity: 0 }}>
            <iframe
              ref={facupRef}
              id="yt-facup-player"
              src="https://www.youtube.com/embed/wUjUDkx0pVs?autoplay=1&mute=1&controls=0&start=570&loop=1&playlist=wUjUDkx0pVs&rel=0&showinfo=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
              allow="autoplay; fullscreen"
              className={iframeClass}
              style={iframeStyle}
            />
          </div>
        </motion.div>

        {/* Info text: right of square on desktop, bottom overlay on mobile */}
        <div
          ref={infoRef}
          className="absolute z-20 max-w-xs md:max-w-sm pointer-events-none"
          style={{
            opacity: 0,
            transform: 'translateX(30px)',
            ...(textPos.mobile
              ? { left: PAD, right: PAD, bottom: 80 }
              : { left: textPos.left, top: textPos.top }),
          }}
        >
          <h3
            className="text-white text-xl md:text-2xl mb-3 tracking-widest uppercase"
            style={{ fontFamily: 'Kegilka, serif' }}
          >
            FA CUP WINNER
          </h3>
          <p
            className="text-zinc-300 text-[11px] md:text-xs leading-relaxed"
            style={{ fontFamily: 'Mona Sans, sans-serif' }}
          >
            Arsenal lift their 14th FA Cup on 1 August 2020, defeating Chelsea
            2–1 in front of a ghost Wembley. Aubameyang, twice — the second a
            cool-headed penalty. Arteta&apos;s first trophy as manager. And Saka,
            18 years old, on the pitch for every second of it — already
            indispensable in an Arsenal side finding its identity again.
          </p>
        </div>

        {/* Year: fixed at the screen's bottom-right throughout */}
        <div
          ref={yearRef}
          className="absolute bottom-6 right-4 md:right-6 z-20 pointer-events-none select-none"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          <span
            className="text-7xl md:text-9xl text-transparent tracking-tighter"
            style={{ fontFamily: 'Kegilka, serif', WebkitTextStroke: '2px white' }}
          >
            2020
          </span>
        </div>

      </div>
    </div>
  )
}
