'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll, animate } from 'framer-motion'
import FillButton from './FillButton'
import SignatureStroke from './SignatureStroke'
import TrophyCabinet from './TrophyCabinet'
import GrainOverlay from './GrainOverlay'
import EnglandStoryImmersive from './EnglandStoryImmersive'
import { useSakaStats } from '@/hooks/useSakaStats'

type Side = 'club' | 'country'

const PANEL_EASING = 'cubic-bezier(0.87, 0, 0.13, 1)'
const PANEL_DUR    = '900ms'
// Overlay animation duration (ms) — content fades in AFTER this completes
const OVERLAY_DUR  = 640

const ARSENAL_SVG = '/Arsenal Crest Use this instead.svg'
const ENGLAND_SVG = '/england-badge use this instead.svg'

const STORY =
  "Since making his Arsenal debut as a teenager in 2018, Bukayo Saka has been the one constant in North London's rise. Not just a player. A statement. Every title race Arsenal has mounted, every European night that mattered, every moment that needed someone to step up: it's been him. Direct, decisive, and quietly devastating."

// Saka quote — words flagged `display` render in Kegilka serif, others in Mona Sans
export const SAKA_QUOTE: { text: string; display?: boolean }[] = [
  { text: '"' },
  { text: 'Football',  display: true },
  { text: 'is a' },
  { text: 'platform',  display: true },
  { text: '. Every' },
  { text: 'goal',      display: true },
  { text: 'I score gives me a' },
  { text: 'bigger',    display: true },
  { text: 'voice',     display: true },
  { text: '. I want to use that' },
  { text: 'voice',     display: true },
  { text: 'for people who' },
  { text: "don't",     display: true },
  { text: 'have one."' },
]

// ── Saka stats card values ─────────────────────────────────────
const STATS = {
  plGoals: 50,
  arsGoals: 83,
  arsAssists: 64,
  goalInvolvements: 147,
  shirt: 7,
} as const

const ENG_STATS = {
  caps: 63,
  goals: 16,
  assists: 17,
  ga: 33,
  shirt: 7,
} as const

const ENG_FG      = '#0A1946'
const ENG_FG_DIM  = 'rgba(10,25,70,0.55)'
const ENG_BORDER  = 'rgba(10,25,70,0.12)'

const ENG_DESCRIPTION =
  'Joins the Three Lions and makes his mark on the international stage. A breakthrough moment in his young career, representing England at the highest level and becoming a key figure in major tournaments. His performances for the national team brought pride to millions, cementing his place as one of the brightest talents in English football, all before his 20th birthday.'

// ── Background video (Cloudinary, covers panel) ───────────────────────────────
function VideoBg({ src }: { src: string }) {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'max(100%, calc(100vh * 16 / 9))',
        height: 'max(100%, calc(100vw * 9 / 16))',
        objectFit: 'cover',
        pointerEvents: 'none',
      }}
    />
  )
}

// ── Count-up: animates 0 → `to` once `start` becomes true ─────
function CountUp({
  to,
  start,
  duration = 2.4,
  delay = 0,
}: {
  to: number
  start: boolean
  duration?: number
  delay?: number
}) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) { setValue(0); return }
    let raf = 0
    let startTs: number | null = null
    const tick = (now: number) => {
      if (startTs === null) startTs = now
      const elapsed = (now - startTs) / 1000 - delay
      if (elapsed < 0) { raf = requestAnimationFrame(tick); return }
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setValue(Math.round(to * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, start, duration, delay])
  return <>{value}</>
}

// ── Tile primitive for stats card ─────────────────────────────
function Tile({
  label,
  value,
  big,
  className,
  children,
}: {
  label?: string
  value?: React.ReactNode
  big?: boolean
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={className}
      style={{
        border: '1px solid rgba(255,255,255,0.18)',
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'rgba(0,0,0,0.18)',
        height: 96,
        boxSizing: 'border-box',
      }}
    >
      {children ?? (
        <>
          {label && (
            <span
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          )}
          {value !== undefined && (
            <span
              style={{
                fontFamily: 'Kegilka, serif',
                fontSize: big ? '1.85rem' : '1.4rem',
                lineHeight: 1,
                color: '#fff',
                fontWeight: 400,
                letterSpacing: '0.02em',
              }}
            >
              {value}
            </span>
          )}
        </>
      )}
    </div>
  )
}

// ── England tile — white background, deep-blue text ──────────────
function EngTile({
  label,
  value,
  children,
}: {
  label?: string
  value?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div
      style={{
        border: `1px solid ${ENG_BORDER}`,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'rgba(10,25,70,0.03)',
        height: 96,
        boxSizing: 'border-box',
      }}
    >
      {children ?? (
        <>
          {label && (
            <span
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: '0.55rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(10,25,70,0.5)',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          )}
          {value !== undefined && (
            <span
              style={{
                fontFamily: 'Kegilka, serif',
                fontSize: '1.85rem',
                lineHeight: 1,
                color: ENG_FG,
                fontWeight: 400,
                letterSpacing: '0.02em',
              }}
            >
              {value}
            </span>
          )}
        </>
      )}
    </div>
  )
}

import type { SanityCareerChapter, SanityTrophy, SanitySettings } from '@/lib/sanity/queries'

type ClubAndCountryProps = {
  careerChapters?: SanityCareerChapter[]
  trophies?: SanityTrophy[]
  settings?: SanitySettings | null
}

export default function ClubAndCountry({ careerChapters, trophies, settings }: ClubAndCountryProps) {
  const { stats: liveStats } = useSakaStats()

  const englandStats = settings?.englandStats ?? ENG_STATS
  const arsenalStory = settings?.arsenalStory ?? STORY
  const englandDescription = settings?.englandDescription ?? ENG_DESCRIPTION

  const [active, setActive]                         = useState<Side>('club')
  const [showOverlay, setShow]                      = useState(false)
  const [contentReady, setContentReady]             = useState(false)
  const [showEngland, setShowEngland]               = useState(false)
  const [contentReadyEngland, setContentReadyEngland] = useState(false)
  const [cursorPanel, setCursorPanel]               = useState<Side>('club')
  const [cursorVisible, setCursorVisible]           = useState(false)
  const [mounted, setMounted]                       = useState(false)
  const [isTouch, setIsTouch]                       = useState(false)
  const [mobileIdx, setMobileIdx]                   = useState(0)
  const touchStartX                                 = useRef<number>(0)
  const carouselRef                                 = useRef<HTMLDivElement>(null)
  const trackX                                      = useMotionValue(0)
  const baseTrackX                                  = useRef(0)
  const snapAnimRef                                 = useRef<{ stop: () => void } | null>(null)
  const sectionRef             = useRef<HTMLDivElement>(null)
  const engScrollContainerRef  = useRef<HTMLDivElement>(null)
  const slideContainerRef      = useRef<HTMLDivElement>(null)

  // Slide-up over Number7 — same pattern as Number7 slides over ProfessionalDebut
  const { scrollYProgress: slideProgress } = useScroll({
    target: slideContainerRef,
    offset: ['start end', 'start start'],
  })
  const panelSlideY = useTransform(slideProgress, [0, 1], ['100%', '0%'])

  // Scroll-driven horizontal story for England overlay
  // Chapter centres: p=0 (ch1), p=0.333 (ch2), p=0.667 (ch3), p=1.0 (ch4)
  const engProgress   = useMotionValue(0)
  // engTranslateX / engDepthBg / engDepthFg removed — depth is now handled
  // natively by CSS 3D perspective inside EnglandStoryImmersive

  const getCarouselWidth = useCallback(() => {
    if (typeof window === 'undefined') return 1
    return carouselRef.current?.offsetWidth ?? window.innerWidth
  }, [])

  // trackX ranges from 0 (Arsenal fully visible) to -cardWidth (Arsenal fully clipped).
  // Map it to a clip-path that grows from the right edge of Arsenal inward.
  const arsenalClip = useTransform(trackX, (v) => {
    const w = getCarouselWidth()
    const pct = Math.max(0, Math.min(100, (Math.abs(v) / w) * 100))
    return `inset(0 ${pct}% 0 0)`
  })

  // Spring-dampened cursor position (viewport coords)
  const cx = useMotionValue(-300)
  const cy = useMotionValue(-300)
  const sx = useSpring(cx, { damping: 22, stiffness: 600, mass: 0.3 })
  const sy = useSpring(cy, { damping: 22, stiffness: 600, mass: 0.3 })

  // Mount detection for portal + touch detection.
  // Use `(hover: hover) and (pointer: fine)` instead of `ontouchstart` — the
  // latter is true on every Windows laptop with a touchscreen even when the
  // user is driving the page with a mouse, which hid the desktop cursor.
  // matchMedia distinguishes "primary mouse-like pointer" from "touch-only".
  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updateIsTouch = () => setIsTouch(!mq.matches)
    updateIsTouch()
    mq.addEventListener('change', updateIsTouch)
    return () => mq.removeEventListener('change', updateIsTouch)
  }, [])

  // Track mouse globally; cursor only renders when over the section
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cx.set(e.clientX)
      cy.set(e.clientY)
      const el = sectionRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const inBounds =
        e.clientX >= r.left && e.clientX <= r.right &&
        e.clientY >= r.top  && e.clientY <= r.bottom
      // Also confirm the topmost element at the pointer is actually inside this
      // section — prevents the cursor bleeding into sections stacked above (e.g. BeyondThePitch)
      const topEl = document.elementFromPoint(e.clientX, e.clientY)
      const inside = inBounds && !!topEl && el.contains(topEl)
      setCursorVisible(inside && !showOverlay && !showEngland)
      if (inside) {
        // Decide which panel based on x relative to section + active panel
        const split = active === 'club' ? r.left + r.width * 0.8 : r.left + r.width * 0.2
        const side: Side = e.clientX < split ? 'club' : 'country'
        setCursorPanel(side)
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [active, showOverlay, showEngland, cx, cy])

  // Arsenal overlay content timing
  useEffect(() => {
    if (showOverlay) {
      const t = setTimeout(() => setContentReady(true), OVERLAY_DUR)
      return () => clearTimeout(t)
    } else {
      setContentReady(false)
    }
  }, [showOverlay])

  // England overlay content timing
  useEffect(() => {
    if (showEngland) {
      const t = setTimeout(() => setContentReadyEngland(true), OVERLAY_DUR)
      return () => clearTimeout(t)
    } else {
      setContentReadyEngland(false)
    }
  }, [showEngland])

  // Scroll-driven horizontal pan — smooth wheel inertia (desktop) /
  // native scroll (touch). On touch devices we MUST NOT run the raf-lerp,
  // because it force-snaps container.scrollTop and fights native touch
  // scroll — making the overlay un-scrollable on phones.
  useEffect(() => {
    if (!showEngland) {
      engProgress.set(0)
      return
    }
    const container = engScrollContainerRef.current
    if (!container) return

    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    const updateProgress = (scrollTop: number) => {
      const { scrollHeight, clientHeight } = container
      const storyStart = clientHeight + 80 // hero + section-gap spacer
      const storyRange = scrollHeight - clientHeight - storyStart
      const p = storyRange > 0 ? Math.max(0, Math.min(1, (scrollTop - storyStart) / storyRange)) : 0
      engProgress.set(p)
    }

    // Touch: let the browser handle scroll natively, just track progress.
    if (isTouch) {
      const onScroll = () => updateProgress(container.scrollTop)
      container.addEventListener('scroll', onScroll, { passive: true })
      updateProgress(container.scrollTop)
      return () => container.removeEventListener('scroll', onScroll)
    }

    // Desktop: hijack wheel and run smooth lerp toward target.
    let targetScroll = container.scrollTop
    let currentScroll = container.scrollTop
    let rafId: number

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const max = container.scrollHeight - container.clientHeight
      targetScroll = Math.max(0, Math.min(max, targetScroll + e.deltaY))
    }

    const tick = () => {
      currentScroll += (targetScroll - currentScroll) * 0.085
      const snapped = Math.round(currentScroll)
      if (Math.abs(container.scrollTop - snapped) > 0.5) {
        container.scrollTop = snapped
      }
      updateProgress(snapped)
      rafId = requestAnimationFrame(tick)
    }

    container.addEventListener('wheel', onWheel, { passive: false })
    rafId = requestAnimationFrame(tick)
    updateProgress(container.scrollTop)

    return () => {
      container.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(rafId)
    }
  }, [showEngland, engProgress])

  // Lenis stop/start — stop when either overlay is open
  useEffect(() => {
    window.dispatchEvent(new Event(showOverlay || showEngland ? 'lenis:stop' : 'lenis:start'))
  }, [showOverlay, showEngland])

  // Escape to close either overlay
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShow(false); setShowEngland(false) }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  // Preload trophy images so hover transitions are instant
  useEffect(() => {
    const paths = [
      '/FA Cup Win.png',
      '/Community Shield.png',
      '/PFA Young player of the year.png',
      '/Arsenal P;ayer of the season.png',
      '/England Player of the Year.png',
      '/Premiere league player of the month.jpg',
    ]
    paths.forEach((src) => { const img = new window.Image(); img.src = src })
  }, [])

  // ── Liquid-glass cursor (portaled to body so no ancestor can clip it) ─
  const cursorEl = (
    <motion.div
      className="pointer-events-none rounded-full flex flex-col items-center justify-center"
      style={{
        position: 'fixed',
        zIndex: 9999,
        left: -45, top: -45,
        width: 90, height: 90,
        x: sx, y: sy,
        background: 'rgba(255,255,255,0.14)',
        backdropFilter: 'blur(18px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.6)',
        border: '1px solid rgba(255,255,255,0.32)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -8px 16px rgba(255,255,255,0.05), 0 2px 10px rgba(0,0,0,0.18)',
        willChange: 'transform',
      }}
      animate={{ scale: cursorVisible && !showOverlay && !showEngland ? 1 : 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <span style={{
        fontFamily: 'Mona Sans, sans-serif',
        color: 'rgba(255,255,255,0.95)',
        fontSize: '0.6rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        fontWeight: 600,
        lineHeight: 1.25,
        textAlign: 'center',
        userSelect: 'none',
        whiteSpace: 'pre-line',
        textShadow: '0 1px 2px rgba(0,0,0,0.25)',
      }}>
        {'CLICK\nTO\nEXPLORE'}
      </span>
    </motion.div>
  )

  return (
    <>
      {mounted && !isTouch && createPortal(cursorEl, document.body)}

      {/* ── Split-panel ───────────────────────────────────────────── */}
      {/* marginTop: -100vh overlaps the last 100vh of Number7 so the slide starts while it's still visible */}
      <div
        ref={slideContainerRef}
        id="club-country"
        style={{ height: '250vh', position: 'relative', zIndex: 61, marginTop: '-100vh' }}
      >
        <motion.section
          ref={sectionRef}
          className="sticky top-0 w-full flex overflow-hidden"
          style={{ height: '100vh', cursor: isTouch ? 'auto' : 'none', translateY: panelSlideY }}
        >
          <div className="hidden md:flex h-full w-full">
            {/* Arsenal panel */}
            <div
              className="relative overflow-hidden flex-none"
              style={{
                width: active === 'club' ? '80%' : '20%',
                height: '100%',
                cursor: 'none',
                transition: `width ${PANEL_DUR} ${PANEL_EASING}`,
              }}
              onMouseEnter={() => { setActive('club') }}
              onClick={() => active === 'club' ? setShow(true) : setActive('club')}
            >
              <div className="absolute inset-0" style={{ opacity: active === 'club' ? 0 : 1, filter: 'grayscale(1) brightness(0.35)', transition: `opacity ${PANEL_DUR} ${PANEL_EASING}` }}>
                <Image src="/Saka Arsenal.png" alt="Saka Arsenal" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} unoptimized priority />
              </div>
              <div className="absolute inset-0 overflow-hidden" style={{ opacity: active === 'club' ? 1 : 0, transition: `opacity ${PANEL_DUR} ${PANEL_EASING}` }}>
                <VideoBg src="https://res.cloudinary.com/dinsvbrfd/video/upload/v1778431370/The_Gunner_Cover_zowdp8.mp4" />
              </div>
              <div className="absolute inset-0 pointer-events-none" style={{ background: active === 'club' ? 'linear-gradient(to right,rgba(9,9,11,0.85) 0%,rgba(9,9,11,0.2) 55%,rgba(9,9,11,0.05) 100%)' : 'transparent', transition: `background ${PANEL_DUR} ${PANEL_EASING}` }} />

              <div className="absolute inset-0 flex flex-col justify-end p-4 pb-16 md:p-6 pointer-events-none" style={{ opacity: active === 'club' ? 1 : 0, transition: 'opacity 350ms ease' }}>
                <Image src={ARSENAL_SVG} alt="Arsenal" width={40} height={47} className="mb-4" unoptimized />
                <p className="text-white/50 text-xs tracking-[0.4em] uppercase mb-3 font-normal" style={{ fontFamily: 'Mona Sans, sans-serif' }}>Arsenal FC · Premier League</p>
                <h2 className="text-white text-xl md:text-2xl tracking-widest uppercase leading-none" style={{ fontFamily: 'Kegilka, serif', fontWeight: 400 }}>THE GUNNER</h2>
              </div>

              {/* Vertical "Arsenal" label — pinned to LEFT edge so it doesn't drift on resize */}
              <div className="absolute pointer-events-none z-20" style={{ left: 24, top: '50%', transform: 'translateY(-50%)', opacity: active === 'club' ? 0 : 1, transition: 'opacity 350ms ease' }}>
                <span style={{ fontFamily: 'Mona Sans, sans-serif', writingMode: 'vertical-rl', transform: 'rotate(180deg)', display: 'block', letterSpacing: '0.5em', fontSize: '0.95rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', fontWeight: 500, textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>Arsenal</span>
              </div>
            </div>

            {/* England panel */}
            <div
              className="relative overflow-hidden flex-none"
              style={{
                width: active === 'country' ? '80%' : '20%',
                height: '100%',
                cursor: 'none',
                transition: `width ${PANEL_DUR} ${PANEL_EASING}`,
              }}
              onMouseEnter={() => { setActive('country') }}
              onClick={() => active === 'country' ? setShowEngland(true) : setActive('country')}
            >
              <div className="absolute inset-0" style={{ opacity: active === 'country' ? 0 : 1, filter: 'grayscale(1) brightness(0.35)', transition: `opacity ${PANEL_DUR} ${PANEL_EASING}` }}>
                <Image src="/Saka England National.png" alt="Saka England" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} unoptimized />
              </div>
              <div className="absolute inset-0 overflow-hidden" style={{ opacity: active === 'country' ? 1 : 0, transition: `opacity ${PANEL_DUR} ${PANEL_EASING}` }}>
                <VideoBg src="https://res.cloudinary.com/dinsvbrfd/video/upload/v1778431397/The_Lions_Cover_mbuqbm.mp4" />
              </div>
              <div className="absolute inset-0 pointer-events-none" style={{ background: active === 'country' ? 'linear-gradient(to left,rgba(9,9,11,0.85) 0%,rgba(9,9,11,0.2) 55%,rgba(9,9,11,0.05) 100%)' : 'transparent', transition: `background ${PANEL_DUR} ${PANEL_EASING}` }} />

              <div className="absolute inset-0 flex flex-col justify-end items-end p-4 pb-16 md:p-6 pointer-events-none" style={{ opacity: active === 'country' ? 1 : 0, transition: 'opacity 350ms ease' }}>
                <Image src={ENGLAND_SVG} alt="England" width={36} height={42} className="mb-4" unoptimized />
                <p className="text-white/60 text-xs tracking-[0.4em] uppercase mb-3 font-normal text-right" style={{ fontFamily: 'Mona Sans, sans-serif' }}>England · Three Lions</p>
                <h2 className="text-white text-xl md:text-2xl tracking-widest uppercase leading-none text-right" style={{ fontFamily: 'Kegilka, serif', fontWeight: 400 }}>THE LION</h2>
              </div>

              {/* Vertical "England" label — pinned to RIGHT edge */}
              <div className="absolute pointer-events-none z-20" style={{ right: 24, top: '50%', transform: 'translateY(-50%)', opacity: active === 'country' ? 0 : 1, transition: 'opacity 350ms ease' }}>
                <span style={{ fontFamily: 'Mona Sans, sans-serif', writingMode: 'vertical-rl', transform: 'rotate(180deg)', display: 'block', letterSpacing: '0.5em', fontSize: '0.95rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', fontWeight: 500, textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}>England</span>
              </div>
            </div>

            {/* Divider line */}
            <div className="absolute top-0 bottom-0 w-px pointer-events-none z-10" style={{ left: active === 'club' ? '80%' : '20%', background: 'rgba(255,255,255,0.12)', transition: `left ${PANEL_DUR} ${PANEL_EASING}` }} />
          </div>

          {/* ── Mobile carousel — peel/seam reveal (Capture One before/after style)
              Both cards sit perfectly still in place. Arsenal is on top (zIndex 2)
              and is CLIPPED from the right as the user swipes left — a vertical
              seam slides across, with England (always rendered fully underneath)
              showing through where Arsenal is clipped away.
                trackX =  0           → Arsenal fully unclipped, seam off-screen right
                trackX = -cardWidth   → Arsenal fully clipped, England fully revealed
              Neither card translates. */}
          <div
            ref={carouselRef}
            className="md:hidden absolute inset-0 overflow-hidden"
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX
              baseTrackX.current = trackX.get()
              snapAnimRef.current?.stop()
            }}
            onTouchMove={(e) => {
              const dx = e.touches[0].clientX - touchStartX.current
              const w = getCarouselWidth()
              let next = baseTrackX.current + dx
              // Elastic resistance past either boundary
              if (next > 0) next = next * 0.25
              else if (next < -w) next = -w + (next + w) * 0.25
              trackX.set(next)
            }}
            onTouchEnd={(e) => {
              const dx = e.changedTouches[0].clientX - touchStartX.current
              const w = getCarouselWidth()
              const threshold = w * 0.22
              let newIdx = mobileIdx
              if (mobileIdx === 0 && dx < -threshold) newIdx = 1
              else if (mobileIdx === 1 && dx > threshold) newIdx = 0
              setMobileIdx(newIdx)
              snapAnimRef.current = animate(trackX, newIdx === 0 ? 0 : -w, {
                type: 'spring', stiffness: 280, damping: 32, mass: 0.9,
              })
            }}
          >
            {/* England card — always rendered fully behind, NEVER moves */}
            <div
              style={{
                position: 'absolute', inset: 0, zIndex: 1, cursor: 'pointer',
                filter: mobileIdx === 1 ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.45)',
                transition: 'filter 0.6s cubic-bezier(0.16,1,0.3,1)',
              }}
              onClick={() => setShowEngland(true)}
            >
              {/* Image fallback always renders. The video fades in only once
                  England becomes the active card (post-commit), and fades out
                  the moment it's no longer active. */}
              <Image src="/Saka England National.png" alt="Saka England" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} unoptimized />
              <motion.div
                style={{ position: 'absolute', inset: 0 }}
                animate={{ opacity: mobileIdx === 1 ? 1 : 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <VideoBg src="https://res.cloudinary.com/dinsvbrfd/video/upload/v1778431397/The_Lions_Cover_mbuqbm.mp4" />
              </motion.div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: '3rem', left: '1rem', right: '1rem' }}>
                <Image src={ENGLAND_SVG} alt="England" width={28} height={33} unoptimized style={{ marginBottom: 14, display: 'block' }} />
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontFamily: 'Mona Sans, sans-serif', fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: '0 0 6px', fontWeight: 600 }}>England · Three Lions</p>
                  <h2 style={{ fontFamily: 'Kegilka, serif', fontWeight: 400, fontSize: 'clamp(2.2rem, 8vw, 3rem)', lineHeight: 1, color: '#fff', margin: 0 }}>The Lion</h2>
                </div>
                <div onClick={(e) => e.stopPropagation()} style={{ marginBottom: 22 }}>
                  <FillButton label="TAP TO EXPLORE" onClick={() => setShowEngland(true)} />
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ display: 'block', height: 4, borderRadius: 2, background: mobileIdx === 0 ? '#fff' : 'rgba(255,255,255,0.3)', width: mobileIdx === 0 ? 24 : 8, transition: 'width 0.3s ease, background 0.3s ease' }} />
                  <span style={{ display: 'block', height: 4, borderRadius: 2, background: mobileIdx === 1 ? '#fff' : 'rgba(255,255,255,0.3)', width: mobileIdx === 1 ? 24 : 8, transition: 'width 0.3s ease, background 0.3s ease' }} />
                </div>
              </div>
            </div>

            {/* Arsenal card — always rendered fully on top, NEVER translates;
                only its clip-path shrinks from the right as the user swipes left. */}
            <motion.div
              style={{
                position: 'absolute', inset: 0, zIndex: 2, cursor: 'pointer', clipPath: arsenalClip,
                filter: mobileIdx === 0 ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.45)',
                transition: 'filter 0.6s cubic-bezier(0.16,1,0.3,1)',
              }}
              onClick={() => setShow(true)}
            >
              <Image src="/Saka Arsenal.png" alt="Saka Arsenal" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} unoptimized priority />
              <motion.div
                style={{ position: 'absolute', inset: 0 }}
                animate={{ opacity: mobileIdx === 0 ? 1 : 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <VideoBg src="https://res.cloudinary.com/dinsvbrfd/video/upload/v1778431370/The_Gunner_Cover_zowdp8.mp4" />
              </motion.div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: '3rem', left: '1rem', right: '1rem' }}>
                <Image src={ARSENAL_SVG} alt="Arsenal" width={32} height={38} unoptimized style={{ marginBottom: 14, display: 'block' }} />
                <div style={{ marginBottom: 18 }}>
                  <p style={{ fontFamily: 'Mona Sans, sans-serif', fontSize: '0.55rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', margin: '0 0 6px', fontWeight: 600 }}>Arsenal FC · Premier League</p>
                  <h2 style={{ fontFamily: 'Kegilka, serif', fontWeight: 400, fontSize: 'clamp(2.2rem, 8vw, 3rem)', lineHeight: 1, color: '#fff', margin: 0 }}>The Gunner</h2>
                </div>
                <div onClick={(e) => e.stopPropagation()} style={{ marginBottom: 22 }}>
                  <FillButton label="TAP TO EXPLORE" onClick={() => setShow(true)} />
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ display: 'block', height: 4, borderRadius: 2, background: mobileIdx === 0 ? '#fff' : 'rgba(255,255,255,0.3)', width: mobileIdx === 0 ? 24 : 8, transition: 'width 0.3s ease, background 0.3s ease' }} />
                  <span style={{ display: 'block', height: 4, borderRadius: 2, background: mobileIdx === 1 ? '#fff' : 'rgba(255,255,255,0.3)', width: mobileIdx === 1 ? 24 : 8, transition: 'width 0.3s ease, background 0.3s ease' }} />
                </div>
              </div>
            </motion.div>

          </div>
        </motion.section>
      </div>

      {/* ── England overlay (THE LION) ────────────────────────────────────────── */}
      <AnimatePresence>
        {showEngland && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[300]"
            style={{ background: '#ffffff', overflow: 'hidden' }}
          >
            <GrainOverlay className="z-[50] pointer-events-none" />
            {(() => {
              const engEase = [0.16, 1, 0.3, 1] as const
              const fade = (delay: number, dy: number = 24) => ({
                initial: { opacity: 0, y: dy },
                animate: contentReadyEngland ? { opacity: 1, y: 0 } : { opacity: 0, y: dy },
                transition: { duration: 0.75, ease: engEase, delay },
              })

              return (
                <>
                  <div
                    data-overlay-scroll
                    ref={engScrollContainerRef}
                    style={{
                      position: 'absolute', inset: 0,
                      overflowY: 'auto', overflowX: 'hidden',
                      WebkitOverflowScrolling: 'touch',
                      touchAction: 'pan-y',
                    }}
                  >
                    {/* ── SECTION A: HERO ──────────────────────────────── */}
                    <section style={{ position: 'relative', height: '100vh', minHeight: 600 }}>
                      <div className="absolute inset-0 p-4 md:p-6 flex flex-col">
                        <motion.h1
                          {...fade(0, 32)}
                          style={{
                            fontFamily: 'Kegilka, serif',
                            fontSize: 'clamp(3rem, 13vw, 11rem)',
                            lineHeight: 0.88,
                            fontWeight: 400,
                            color: ENG_FG,
                            margin: 0,
                            paddingRight: 64,
                          }}
                        >
                          THE LION
                        </motion.h1>

                        <motion.div
                          {...fade(0.12, 18)}
                          className="ml-0 md:ml-[clamp(0.65rem,2.75vw,2.35rem)]"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            marginTop: 16,
                            fontFamily: 'Mona Sans, sans-serif',
                          }}
                        >
                          {['Starboy', '25 Years Old', 'North London'].map((item, i) => (
                            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              {i > 0 && <span style={{ color: ENG_FG_DIM, fontSize: '0.6rem' }}>•</span>}
                              <span style={{ color: ENG_FG, fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.04em' }}>{item}</span>
                            </span>
                          ))}
                        </motion.div>

                        <div className="flex-1 flex items-end justify-start md:justify-end pb-12 md:pb-0">
                          <div className="w-full md:max-w-[360px]" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <motion.p
                              {...fade(0.22, 18)}
                              style={{
                                fontFamily: 'Mona Sans, sans-serif',
                                fontSize: 'var(--body-text-size)',
                                lineHeight: 1.7,
                                color: ENG_FG_DIM,
                                margin: 0,
                              }}
                            >
                              {englandDescription}
                            </motion.p>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
                              {[
                                <EngTile key="caps"  label="Caps"    value={<><CountUp to={englandStats.caps}     start={contentReadyEngland} delay={0.05} />+</>} />,
                                <EngTile key="goals" label="Goals"   value={<CountUp to={englandStats.goals}    start={contentReadyEngland} delay={0.10} />} />,
                                <EngTile key="ast"   label="Assists" value={<CountUp to={englandStats.assists}  start={contentReadyEngland} delay={0.15} />} />,
                                <EngTile key="ga"    label="G+A"     value={<CountUp to={englandStats.ga}       start={contentReadyEngland} delay={0.20} />} />,
                                <EngTile key="shirt" label="Shirt"   value={`#${liveStats.shirt}`} />,
                                <EngTile key="sig">
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                    <SignatureStroke
                                      className="w-full select-none pointer-events-none"
                                      startDelay={0.5}
                                      glow={false}
                                      loop
                                      color={ENG_FG}
                                    />
                                  </div>
                                </EngTile>,
                              ].map((tile, i) => (
                                <motion.div key={i} {...fade(0.32 + i * 0.06, 14)}>{tile}</motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* England crest — bottom-left, navy version, same size/position as Arsenal crest */}
                      <motion.div
                        {...fade(0.18, 36)}
                        className="hidden md:block"
                        style={{ position: 'absolute', bottom: 24, left: 24, pointerEvents: 'none' }}
                      >
                        <Image
                          src="/england-badge-navy.svg"
                          alt="England crest"
                          width={240}
                          height={282}
                          unoptimized
                          priority
                          style={{ width: 'clamp(150px, 21vw, 270px)', height: 'auto' }}
                        />
                      </motion.div>
                    </section>

                    {/* Section gap — matches Arsenal overlay 80px desktop gap */}
                    <div style={{ height: 80 }} />

                    {/* ── SECTION B: IMMERSIVE STORY — z-depth parallax scroll ── */}
                    <EnglandStoryImmersive progress={engProgress} chapters={careerChapters} />
                  </div>

                  {/* X close */}
                  <motion.button
                    {...fade(0.05, 12)}
                    onClick={() => setShowEngland(false)}
                    aria-label="Close overlay"
                    className="absolute top-4 right-4 md:top-6 md:right-6"
                    style={{
                      zIndex: 50,
                      color: 'rgba(10,25,70,0.45)',
                      background: 'rgba(10,25,70,0.06)',
                      border: `1px solid ${ENG_BORDER}`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      width: 40, height: 40,
                      borderRadius: 999,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', padding: 0,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = ENG_FG)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,25,70,0.45)')}
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    </svg>
                  </motion.button>

                  {/* BUKAYO SAKA — blue tint at bottom */}
                  <motion.div
                    {...fade(0.55, 8)}
                    style={{
                      position: 'absolute', bottom: 24, left: 0, right: 0,
                      display: 'flex', justifyContent: 'center',
                      pointerEvents: 'none', userSelect: 'none', zIndex: 40,
                    }}
                  >
                    <div className="w-[120px] md:w-[160px]">
                      <svg viewBox="0 0 1000 135" className="block w-full overflow-visible" preserveAspectRatio="xMidYMax meet" aria-label="Bukayo Saka">
                        <text x="0" y="128" textAnchor="start" fontSize="155" textLength="1000" lengthAdjust="spacingAndGlyphs" fill="rgba(10,25,70,0.2)" style={{ fontFamily: 'Kegilka, serif', fontWeight: 400 }}>
                          BUKAYO SAKA
                        </text>
                      </svg>
                    </div>
                  </motion.div>

                  <style jsx>{`
                    @media (max-width: 767px) {
                      /* On mobile the overlay scroll container stacks chapters vertically instead of horizontal pan */
                    }
                  `}</style>
                </>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Arsenal overlay (multi-section scrollable: HERO → QUOTE → TROPHIES) ── */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[300]"
            style={{ background: '#7B1218', overflow: 'hidden' }}
          >
            {/* Grain overlay on the Arsenal overlay background */}
            <GrainOverlay className="z-[50] pointer-events-none" />
            {(() => {

              const ease = [0.16, 1, 0.3, 1] as const
              const fade = (delay: number, dy: number = 24) => ({
                initial: { opacity: 0, y: dy },
                animate: contentReady ? { opacity: 1, y: 0 } : { opacity: 0, y: dy },
                transition: { duration: 0.75, ease, delay },
              })
              const scrollFade = (delay: number = 0, dy: number = 24) => ({
                initial: { opacity: 0, y: dy },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: { duration: 0.8, ease, delay },
              })

              return (
                <>
                  {/* Inner scrollable layer — Lenis ignores this via [data-overlay-scroll] */}
                  <div
                    data-overlay-scroll
                    style={{
                      position: 'absolute',
                      inset: 0,
                      overflowY: 'auto',
                      overflowX: 'hidden',
                    }}
                  >
                    {/* ── SECTION A: HERO ────────────────────────────── */}
                    <section style={{ position: 'relative', height: '100vh', minHeight: 600 }}>
                      <div className="absolute inset-0 p-4 md:p-6 flex flex-col">
                        {/* Heading */}
                        <motion.h1
                          {...fade(0, 32)}
                          style={{
                            fontFamily: 'Kegilka, serif',
                            fontSize: 'clamp(3rem, 13vw, 11rem)',
                            lineHeight: 0.88,
                            fontWeight: 400,
                            color: '#ffffff',
                            margin: 0,
                            paddingRight: 64, // room for fixed X
                          }}
                        >
                          THE GUNNER
                        </motion.h1>

                        {/* Stats meta row */}
                        <motion.div
                          {...fade(0.12, 18)}
                          className="ml-0 md:ml-[clamp(0.65rem,2.75vw,2.35rem)]"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            marginTop: 16,
                            fontFamily: 'Mona Sans, sans-serif',
                          }}
                        >
                          {['Starboy', '25 Years Old', 'North London'].map((item, i) => (
                            <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              {i > 0 && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', lineHeight: 1 }}>•</span>}
                              <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.9rem', fontWeight: 500, letterSpacing: '0.04em' }}>
                                {item}
                              </span>
                            </span>
                          ))}
                        </motion.div>

                        {/* Bottom-right: story above stats card */}
                        <div className="flex-1 flex items-end justify-start md:justify-end pb-12 md:pb-0">
                          <div className="w-full md:max-w-[360px]" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <motion.p
                              {...fade(0.22, 18)}
                              style={{
                                fontFamily: 'Mona Sans, sans-serif',
                                fontSize: 'var(--body-text-size)',
                                lineHeight: 1.7,
                                color: 'rgba(255,255,255,0.62)',
                                margin: 0,
                              }}
                            >
                              {arsenalStory}
                            </motion.p>

                            {/* Stats card */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto', gap: 0 }}>
                              {[
                                <Tile key="pl"  label="PL Goals"  big value={<CountUp to={liveStats.plGoals}         start={contentReady} delay={0.05} />} />,
                                <Tile key="g"   label="Goals"     big value={<CountUp to={liveStats.arsGoals}        start={contentReady} delay={0.10} />} />,
                                <Tile key="a"   label="Assists"   big value={<CountUp to={liveStats.arsAssists}      start={contentReady} delay={0.15} />} />,
                                <Tile key="ga"  label="G+A"       big value={<CountUp to={liveStats.goalInvolvements} start={contentReady} delay={0.20} />} />,
                                <Tile key="sh"  label="Shirt"     big value={`#${liveStats.shirt}`} />,
                                <Tile key="sig">
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                    <SignatureStroke
                                      className="w-full select-none pointer-events-none"
                                      startDelay={0.5}
                                      glow={false}
                                      loop
                                    />
                                  </div>
                                </Tile>,
                              ].map((tile, i) => (
                                <motion.div key={i} {...fade(0.32 + i * 0.06, 14)}>
                                  {tile}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Arsenal crest — bottom-left */}
                      <motion.div
                        {...fade(0.18, 36)}
                        className="hidden md:block"
                        style={{ position: 'absolute', bottom: 24, left: 24, pointerEvents: 'none' }}
                      >
                        <Image
                          src={ARSENAL_SVG}
                          alt="Arsenal crest"
                          width={240}
                          height={282}
                          unoptimized
                          priority
                          style={{ width: 'clamp(150px, 21vw, 270px)', height: 'auto' }}
                        />
                      </motion.div>
                    </section>

                    {/* ── SECTION B: QUOTE ───────────────────────────── */}
                    <section
                      className="overlay-section-gap"
                      style={{
                        position: 'relative',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 'clamp(48px, 6vw, 96px) clamp(16px, 2vw, 24px)',
                      }}
                    >

                      {/* Static signature — no animation in quote section */}
                      <motion.div
                        {...scrollFade(0)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 36,
                        }}
                      >
                        <SignatureStroke className="w-[120px]" startDelay={0} glow={false} />
                      </motion.div>

                      <motion.div
                        {...scrollFade(0.12)}
                        style={{
                          fontFamily: 'Kegilka, serif',
                          fontSize: 'clamp(1.05rem, 1.5vw, 1.4rem)',
                          color: 'rgba(255,255,255,0.92)',
                          fontWeight: 400,
                          marginBottom: 36,
                        }}
                      >
                        Bukayo Saka
                      </motion.div>

                      <motion.blockquote
                        {...scrollFade(0.22, 32)}
                        style={{
                          margin: 0,
                          textAlign: 'center',
                          maxWidth: 'min(1100px, 92vw)',
                          fontSize: 'clamp(2rem, 5vw, 4.5rem)',
                          lineHeight: 1.05,
                          color: '#fff',
                          textTransform: 'uppercase',
                          fontWeight: 500,
                        }}
                      >
                        {SAKA_QUOTE.map((w, i) => (
                          <span
                            key={i}
                            style={{
                              fontFamily: w.display ? 'Kegilka, serif' : 'Mona Sans, sans-serif',
                              fontWeight: w.display ? 400 : 600,
                              letterSpacing: '0.005em',
                            }}
                          >
                            {/^[\.\,\!\?\"]/.test(w.text) ? '' : ' '}{w.text}
                          </span>
                        ))}
                      </motion.blockquote>
                    </section>

                    {/* ── SECTION C: TROPHIES & AWARDS ───────────────── */}
                    <div className="overlay-section-gap">
                      <TrophyCabinet inOverlay trophies={trophies} />
                    </div>
                  </div>

                  {/* X close — fixed top-right, top aligned with THE GUNNER cap-top */}
                  <motion.button
                    {...fade(0.05, 12)}
                    onClick={() => setShow(false)}
                    aria-label="Close overlay"
                    className="absolute top-4 right-4 md:top-6 md:right-6"
                    style={{
                      zIndex: 50,
                      color: 'rgba(255,255,255,0.55)',
                      background: 'rgba(0,0,0,0.18)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      width: 40, height: 40,
                      borderRadius: 999,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', padding: 0,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                    </svg>
                  </motion.button>

                  {/* BUKAYO SAKA — fixed bottom, SAME size/font/position as FixedBrand shrunk version */}
                  <motion.div
                    {...fade(0.55, 8)}
                    style={{
                      position: 'absolute',
                      bottom: 24,
                      left: 0,
                      right: 0,
                      display: 'flex',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      zIndex: 40,
                    }}
                  >
                    <div className="w-[120px] md:w-[160px]">
                      <svg
                        viewBox="0 0 1000 135"
                        className="block w-full overflow-visible"
                        preserveAspectRatio="xMidYMax meet"
                        aria-label="Bukayo Saka"
                      >
                        <text
                          x="0"
                          y="128"
                          textAnchor="start"
                          fontSize="155"
                          textLength="1000"
                          lengthAdjust="spacingAndGlyphs"
                          fill="rgba(255,255,255,0.45)"
                          style={{
                            fontFamily: 'Kegilka, serif',
                            fontWeight: 400,
                          }}
                        >
                          BUKAYO SAKA
                        </text>
                      </svg>
                    </div>
                  </motion.div>

                  {/* 60px desktop / 32px mobile gap between scrollable sections */}
                  <style jsx>{`
                    .overlay-section-gap { margin-top: 32px; }
                    @media (min-width: 768px) {
                      .overlay-section-gap { margin-top: 60px; }
                    }
                  `}</style>
                </>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
