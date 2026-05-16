'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import NextMatch from './NextMatch'
import GrainOverlay from './GrainOverlay'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const [maskGone, setMaskGone] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    let player: YT.Player | null = null
    let poll: ReturnType<typeof setInterval> | null = null
    let cancelled = false
    // Fallback: remove mask after 4 s even if YT never fires PLAYING
    const fallback = setTimeout(() => { if (!cancelled) setMaskGone(true) }, 4000)

    const init = () => {
      if (cancelled || !iframeRef.current) return
      player = new YT.Player(iframeRef.current, {
        events: {
          onStateChange: (e: YT.OnStateChangeEvent) => {
            if (e.data === YT.PlayerState.PLAYING && !cancelled) setMaskGone(true)
          },
        },
      })
    }

    // Load YT script if not already present
    if (!(window as unknown as Record<string, unknown>).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }

    // Poll until YT.Player is available — works even if the API was loaded
    // by another component (EnglandCallUp) that already consumed onYouTubeIframeAPIReady
    poll = setInterval(() => {
      if (typeof YT !== 'undefined' && YT.Player) {
        clearInterval(poll!)
        poll = null
        init()
      }
    }, 100)

    return () => {
      cancelled = true
      clearTimeout(fallback)
      if (poll) clearInterval(poll)
      if (player && typeof player.destroy === 'function') { try { player.destroy() } catch {} }
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={ref}
      id="hero"
      className="relative w-full flex flex-col overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* YouTube video background */}
      <div className="absolute inset-0 z-[0] overflow-hidden">
        <iframe
          ref={iframeRef}
          id="yt-hero-player"
          src="https://www.youtube-nocookie.com/embed/q180SEl5Sgs?autoplay=1&mute=1&controls=0&loop=1&playlist=q180SEl5Sgs&rel=0&showinfo=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&start=1&enablejsapi=1"
          title="Bukayo Saka Highlights"
          allow="autoplay; encrypted-media"
          className="absolute pointer-events-none"
          style={{
            border: 'none',
            width: 'max(130vw, calc(130vh * 16 / 9))',
            height: 'max(130vh, calc(130vw * 9 / 16))',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        {/* Mask fades out once video is playing (or after 4 s fallback) */}
        <div
          className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-[1200ms]"
          style={{ opacity: maskGone ? 0 : 1 }}
        />
      </div>

      <GrainOverlay className="z-[1]" />

      <motion.div
        style={{ opacity }}
        className="relative z-[30] flex-1 flex flex-col justify-end pointer-events-none"
      >
        <div className="relative z-10 px-4 md:px-6 md:translate-y-10 pointer-events-auto">
          <NextMatch />
        </div>
        {/* Visible BUKAYO SAKA brand — part of the hero's normal flow, fills
            the container width. The fixed/floating version (FixedBrand) is
            hidden while this is on-screen and appears only after the hero
            scrolls out of view. Putting the big brand in document flow avoids
            the iOS WebKit getBBox/clipping issues that the absolute-positioned
            version was running into. */}
        <div
          className="block px-4 md:px-6 pb-4 md:pb-6 mt-5 md:mt-16"
          style={{ flexShrink: 0 }}
        >
          <svg
            viewBox="0 0 1000 135"
            className="block w-full overflow-visible"
            preserveAspectRatio="xMidYMax meet"
            aria-label="Bukayo Saka"
            overflow="visible"
          >
            <text
              x="0" y="128"
              textAnchor="start"
              fontSize="155"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fill="#ffffff"
              style={{ fontFamily: 'Kegilka, serif', fontWeight: 400 }}
            >
              {'BUKAYO SAKA'.split('').map((char, i) => (
                <motion.tspan
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + i * 0.05, duration: 0.05 }}
                >
                  {char}
                </motion.tspan>
              ))}
            </text>
          </svg>
        </div>
      </motion.div>
    </section>
  )
}
