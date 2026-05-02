'use client'

import { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion'

export default function ProfessionalDebut() {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const yearRef = useRef<HTMLSpanElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hasEnteredView, setHasEnteredView] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use IntersectionObserver to detect when the section enters view,
  // then trigger the text entrance animations via CSS classes.
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // YouTube API: force seek to 8:03 on load and loop 8:03-8:33
  useEffect(() => {
    let player: YT.Player | null = null
    let checkInterval: ReturnType<typeof setInterval> | null = null

    // Load YouTube IFrame API if not already loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }

    const initPlayer = () => {
      if (!iframeRef.current) return

      player = new YT.Player(iframeRef.current, {
        events: {
          onReady: (event: YT.PlayerEvent) => {
            event.target.seekTo(483, true)
            event.target.mute()
            event.target.playVideo()
          },
        },
      })

      // Poll current time and loop back when past 8:33
      checkInterval = setInterval(() => {
        if (player && typeof player.getCurrentTime === 'function') {
          const currentTime = player.getCurrentTime()
          if (currentTime >= 513 || currentTime < 480) {
            player.seekTo(483, true)
          }
        }
      }, 500)
    }

    // Wait for the YT API to be ready
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).YT) {
      // API already loaded
      const waitForReady = setInterval(() => {
        if (typeof YT !== 'undefined' && YT.Player) {
          clearInterval(waitForReady)
          initPlayer()
        }
      }, 100)
    } else {
      // Set the callback for when the API loads
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval)
      if (player && typeof player.destroy === 'function') {
        try { player.destroy() } catch {}
      }
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // The video starts as a letterbox in the center and grows to fill the screen.
  const videoWidthDesktop = useTransform(scrollYProgress, [0, 0.8], ['60vw', '100vw'])
  const videoWidthMobile = useTransform(scrollYProgress, [0, 0.8], ['90vw', '100vw'])
  const videoWidth = isMobile ? videoWidthMobile : videoWidthDesktop
  const videoHeight = useTransform(scrollYProgress, [0, 0.8], ['20vh', '100vh'])

  // Fade out the text as the video expands
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (textLayerRef.current) {
      let op = 1
      if (v >= 0.15 && v <= 0.5) {
        op = 1 - ((v - 0.15) / (0.5 - 0.15))
      } else if (v > 0.5) {
        op = 0
      }
      textLayerRef.current.style.opacity = String(Math.max(0, Math.min(1, op)))
    }
  })

  return (
    <div ref={containerRef} style={{ height: '300vh' }} className="relative bg-[#7A1C19]">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        
        {/* TEXT LAYER — fades out as video expands */}
        <div ref={textLayerRef} className="absolute inset-0 z-20 pointer-events-none" style={{ opacity: 1 }}>
          {/* Top Left: Title + Description */}
          <div className="absolute top-[80px] md:top-[104px] left-4 md:left-6 max-w-xs md:max-w-sm">
            <h3 
              ref={titleRef}
              className={`text-white text-xl md:text-2xl mb-3 tracking-widest uppercase transition-all duration-700 ease-out ${
                hasEnteredView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ fontFamily: 'Notable, serif' }}
            >
              PROFESSIONAL DEBUT
            </h3>
            <p 
              ref={descRef}
              className={`text-white/80 text-[11px] md:text-xs leading-relaxed transition-all duration-700 ease-out delay-300 ${
                hasEnteredView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              Makes his senior Arsenal debut on 29 November 2018 in the UEFA Europa League against Vorskla Poltava, aged 17. The journey officially begins.
            </p>
          </div>

          {/* Bottom Right: Year */}
          <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6">
            <span 
              ref={yearRef}
              className={`text-7xl md:text-9xl text-transparent tracking-tighter block leading-none transition-all duration-700 ease-out delay-500 ${
                hasEnteredView 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                fontFamily: 'Notable, serif', 
                WebkitTextStroke: '2px white' 
              }}
            >
              2018
            </span>
          </div>
        </div>

        {/* GROWING VIDEO CONTAINER */}
        <motion.div 
          className="absolute left-1/2 top-1/2 z-10 overflow-hidden shadow-2xl"
          style={{
            width: videoWidth,
            height: videoHeight,
            x: '-50%',
            y: '-50%',
          }}
        >
          {/* YouTube player target — the YT API will attach to this iframe via its id */}
          <iframe
            ref={iframeRef}
            id="yt-debut-player"
            src="https://www.youtube.com/embed/8Ul3ls6RKNY?autoplay=1&mute=1&controls=0&start=483&loop=1&playlist=8Ul3ls6RKNY&rel=0&showinfo=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1"
            allow="autoplay; fullscreen"
            className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ border: 'none' }}
          />
        </motion.div>

        {/* GRAIN OVERLAY */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-overlay">
          <div 
            className="w-full h-full"
            style={{ backgroundImage: 'url("/grain.png")', backgroundSize: '200px' }}
          />
        </div>

      </div>
    </div>
  )
}
