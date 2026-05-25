'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import NextMatch from './NextMatch'
import GrainOverlay from './GrainOverlay'
import BrandText from './BrandText'

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const [maskGone, setMaskGone] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    let player: YT.Player | null = null
    let poll: ReturnType<typeof setInterval> | null = null
    let revealTimer: ReturnType<typeof setTimeout> | null = null
    let loopGuard: ReturnType<typeof setInterval> | null = null
    let qualityWarmup: ReturnType<typeof setInterval> | null = null
    let cancelled = false
    const preferBestQuality = (target: YT.Player) => {
      const qualityPlayer = target as YT.Player & {
        getAvailableQualityLevels?: () => string[]
        setPlaybackQuality?: (quality: string) => void
      }
      const preferred = ['highres', 'hd2160', 'hd1440', 'hd1080', 'hd720', 'large']
      const available = qualityPlayer.getAvailableQualityLevels?.() || []
      const quality = preferred.find((level) => available.includes(level)) || 'hd1080'
      qualityPlayer.setPlaybackQuality?.(quality)
    }
    const warmQualityPreference = (target: YT.Player) => {
      if (qualityWarmup) clearInterval(qualityWarmup)
      let attempts = 0
      qualityWarmup = setInterval(() => {
        if (cancelled || attempts > 10) {
          if (qualityWarmup) clearInterval(qualityWarmup)
          qualityWarmup = null
          return
        }
        try { preferBestQuality(target) } catch {}
        attempts += 1
      }, 900)
    }
    const revealWhenSettled = () => {
      if (revealTimer) clearTimeout(revealTimer)
      // YouTube can flash its chrome for a beat after PLAYING. Keep that behind
      // the cover layer and reveal only after the background has settled.
      revealTimer = setTimeout(() => {
        if (!cancelled) setMaskGone(true)
      }, 1800)
    }
    const init = () => {
      if (cancelled || !iframeRef.current) return
      player = new YT.Player(iframeRef.current, {
        events: {
          onReady: (e: YT.PlayerEvent) => {
            try {
              e.target.mute()
              preferBestQuality(e.target)
              warmQualityPreference(e.target)
              e.target.playVideo()
              loopGuard = setInterval(() => {
                if (cancelled || !player) return
                try {
                  const duration = player.getDuration()
                  const current = player.getCurrentTime()
                  if (duration > 0 && current > duration - 1.5) {
                    player.seekTo(1, true)
                    player.playVideo()
                  }
                } catch {}
              }, 400)
            } catch {}
          },
          onStateChange: (e: YT.OnStateChangeEvent) => {
            if (e.data === YT.PlayerState.PLAYING && !cancelled) {
              try { preferBestQuality(e.target) } catch {}
              revealWhenSettled()
            }
          },
          onError: () => {
            if (!cancelled) setMaskGone(false)
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
      if (revealTimer) clearTimeout(revealTimer)
      if (loopGuard) clearInterval(loopGuard)
      if (qualityWarmup) clearInterval(qualityWarmup)
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
          src="https://www.youtube-nocookie.com/embed/q180SEl5Sgs?autoplay=1&mute=1&controls=0&rel=0&showinfo=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&start=1&enablejsapi=1&autohide=1&vq=hd1080&hd=1"
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
        {/* Mask fades out once video playback has settled, hiding YouTube chrome flashes. */}
        <div
          className="absolute inset-0 bg-[#09090b] pointer-events-none transition-opacity duration-[1200ms]"
          aria-hidden="true"
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
        {/* Visible BUKAYO SAKA brand — plain HTML text sized to fill the
            container width. Letters fade in left-to-right via BrandText's
            internal stagger. */}
        <div
          className="px-4 md:px-6 pb-4 md:pb-6 mt-5 md:mt-16"
          style={{ flexShrink: 0 }}
          aria-label="Bukayo Saka"
        >
          {/* Stagger starts AFTER the SignatureReveal loader fades out
              (loader is shown for 6.5s then exits over 1.2s) — otherwise
              the brand wave plays behind the loader and never gets seen. */}
          <BrandText staggerDelay={7.0} />
        </div>
      </motion.div>
    </section>
  )
}
