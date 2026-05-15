'use client'

import { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion'
import GrainOverlay from './GrainOverlay'
import type { SanityMilestone } from '@/lib/sanity/queries'

// ── Scroll keyframes ──────────────────────────────────────────────────────────
const DEBUT_TEXT_OUT   = 0.069
const GROW_END         = 0.112
const SWAP_START       = 0.169
const SHRINK_END       = 0.232
const FACUP_TEXT_START = 0.250
const FACUP_TEXT_END   = 0.300
const YEAR_FA_START    = 0.313
const YEAR_FA_END      = 0.356
const RE_EXPAND_START  = 0.375
const RE_EXPAND_END    = 0.437
const SLICE_START      = 0.457
const SLICE_END        = 0.525
const ENG_TEXT_START   = 0.538
const ENG_TEXT_END     = 0.581
const ENG_YEAR_START   = 0.587
const ENG_YEAR_END     = 0.613
const HSCROLL_START    = 0.642
const HSCROLL_END      = 0.780
const PAD              = 24

function interp(v: number, k0: number, k1: number, k2: number, k3: number): number {
  if (v <= GROW_END)        return k0 + (k1 - k0) * (v / GROW_END)
  if (v <= SHRINK_END)      return k1 + (k2 - k1) * ((v - GROW_END) / (SHRINK_END - GROW_END))
  if (v <= RE_EXPAND_START) return k2
  const t = Math.max(0, Math.min(1, (v - RE_EXPAND_START) / (RE_EXPAND_END - RE_EXPAND_START)))
  return k2 + (k3 - k2) * t
}

const DEBUT_SRC   = 'https://res.cloudinary.com/dinsvbrfd/video/upload/v1778431396/Arsenal_Professional_Debut_asbpy6.mp4'
const FACUP_SRC   = 'https://res.cloudinary.com/dinsvbrfd/video/upload/v1778431412/Saka_FA_Cup_WIn_iznyfk.mp4'
const ENGLAND_SRC = 'https://res.cloudinary.com/dinsvbrfd/video/upload/v1778432260/Saka_England_Debut_g6q3zn.mp4'

export default function ProfessionalDebut({ milestones }: { milestones?: SanityMilestone[] }) {
  const debut   = milestones?.find(m => m.type === 'debut')
  const facup   = milestones?.find(m => m.type === 'facup')
  const england = milestones?.find(m => m.type === 'england_callup')
  const containerRef  = useRef<HTMLDivElement>(null)
  const debutLayerRef = useRef<HTMLDivElement>(null)
  const facupLayerRef = useRef<HTMLDivElement>(null)
  const textLayerRef  = useRef<HTMLDivElement>(null)
  const infoRef       = useRef<HTMLDivElement>(null)
  const yearFaRef     = useRef<HTMLDivElement>(null)
  const englandBgRef  = useRef<HTMLDivElement>(null)
  const leftSliceRef  = useRef<HTMLDivElement>(null)
  const rightSliceRef = useRef<HTMLDivElement>(null)
  const engTextRef    = useRef<HTMLDivElement>(null)
  const engYearRef    = useRef<HTMLDivElement>(null)
  const goalPanelRef  = useRef<HTMLDivElement>(null)

  const [hasEnteredView, setHasEnteredView] = useState(false)
  const dimsRef = useRef({ squarePx: 0, navH: 66 })
  const [textPos, setTextPos] = useState({ left: 0, top: 0 })

  useEffect(() => {
    const update = () => {
      const navH     = window.innerWidth >= 1024 ? 66 : 74
      const squarePx = window.innerHeight - navH - 2 * PAD
      dimsRef.current = { squarePx, navH }
      setTextPos({ left: squarePx + 2 * PAD, top: navH + PAD })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setHasEnteredView(true); obs.disconnect() } },
      { threshold: 0.05 },
    )
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const getVw = () => (typeof window === 'undefined' ? 1280 : window.innerWidth)
  const getVh = () => (typeof window === 'undefined' ? 720 : window.innerHeight)

  const vidLeft = useTransform(scrollYProgress, (v) => {
    const vw = getVw()
    const sw = vw < 768 ? 0.9 * vw : 0.6 * vw
    return `${interp(v, (vw - sw) / 2, 0, PAD, 0)}px`
  })
  const vidTop = useTransform(scrollYProgress, (v) => {
    const vh = getVh()
    const { navH } = dimsRef.current
    return `${interp(v, (vh - 0.2 * vh) / 2, 0, navH + PAD, 0)}px`
  })
  const vidWidth = useTransform(scrollYProgress, (v) => {
    const vw = getVw()
    const { squarePx } = dimsRef.current
    const sw = vw < 768 ? 0.9 * vw : 0.6 * vw
    return `${interp(v, sw, vw, squarePx, vw)}px`
  })
  const vidHeight = useTransform(scrollYProgress, (v) => {
    const vh = getVh()
    const { squarePx } = dimsRef.current
    return `${interp(v, 0.2 * vh, vh, squarePx, vh)}px`
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // ── England goal panel — slides in from right ─────────────────────────
    if (goalPanelRef.current) {
      let tx = 100
      if (v >= HSCROLL_START && v <= HSCROLL_END) {
        tx = (1 - (v - HSCROLL_START) / (HSCROLL_END - HSCROLL_START)) * 100
      } else if (v > HSCROLL_END) {
        tx = 0
      }
      goalPanelRef.current.style.transform = `translateX(${tx}%)`
    }

    // ── PROFESSIONAL DEBUT text fades out ─────────────────────────────────
    if (textLayerRef.current) {
      let op = 1
      if (v >= 0.08 && v <= DEBUT_TEXT_OUT) op = 1 - (v - 0.08) / (DEBUT_TEXT_OUT - 0.08)
      else if (v > DEBUT_TEXT_OUT) op = 0
      textLayerRef.current.style.opacity = String(Math.max(0, op))
    }

    // ── Debut → FA Cup crossfade ──────────────────────────────────────────
    if (debutLayerRef.current && facupLayerRef.current) {
      let dOp = 1, fOp = 0
      if (v >= SWAP_START && v <= SHRINK_END) {
        const t = (v - SWAP_START) / (SHRINK_END - SWAP_START)
        dOp = 1 - t; fOp = t
      } else if (v > SHRINK_END) { dOp = 0; fOp = 1 }
      if (v >= SLICE_START) { dOp = 0; fOp = 0 }
      debutLayerRef.current.style.opacity = String(dOp)
      facupLayerRef.current.style.opacity = String(fOp)
    }

    // ── FA CUP WINNER text ────────────────────────────────────────────────
    if (infoRef.current) {
      let op = 0, tx = 30
      if (v >= FACUP_TEXT_START && v <= FACUP_TEXT_END) {
        const t = (v - FACUP_TEXT_START) / (FACUP_TEXT_END - FACUP_TEXT_START)
        op = t; tx = 30 * (1 - t)
      } else if (v > FACUP_TEXT_END && v < RE_EXPAND_START) {
        op = 1; tx = 0
      } else if (v >= RE_EXPAND_START && v <= RE_EXPAND_END) {
        const t = (v - RE_EXPAND_START) / (RE_EXPAND_END - RE_EXPAND_START)
        op = 1 - t; tx = 30 * t
      }
      infoRef.current.style.opacity   = String(Math.max(0, Math.min(1, op)))
      infoRef.current.style.transform = `translateX(${tx}px)`
    }

    // ── FA Cup 2020 year ──────────────────────────────────────────────────
    if (yearFaRef.current) {
      let op = 0, ty = 20
      if (v >= YEAR_FA_START && v <= YEAR_FA_END) {
        const t = (v - YEAR_FA_START) / (YEAR_FA_END - YEAR_FA_START)
        op = t; ty = 20 * (1 - t)
      } else if (v > YEAR_FA_END && v < RE_EXPAND_START) {
        op = 1; ty = 0
      } else if (v >= RE_EXPAND_START && v <= RE_EXPAND_END) {
        const t = (v - RE_EXPAND_START) / (RE_EXPAND_END - RE_EXPAND_START)
        op = 1 - t; ty = 20 * t
      }
      yearFaRef.current.style.opacity   = String(Math.max(0, Math.min(1, op)))
      yearFaRef.current.style.transform = `translateY(${ty}px)`
    }

    // ── Slice panels: appear, slide apart ────────────────────────────────
    if (leftSliceRef.current && rightSliceRef.current) {
      const sliceT   = v < SLICE_START ? 0 : Math.min(1, (v - SLICE_START) / (SLICE_END - SLICE_START))
      const panelOp  = v >= SLICE_START ? 1 : 0
      leftSliceRef.current.style.opacity    = String(panelOp)
      leftSliceRef.current.style.transform  = `translateY(-${sliceT * 110}%)`
      rightSliceRef.current.style.opacity   = String(panelOp)
      rightSliceRef.current.style.transform = `translateY(${sliceT * 110}%)`
    }

    // ── England background fades in during slice ──────────────────────────
    if (englandBgRef.current) {
      const op = v < SLICE_START ? 0 : Math.min(1, (v - SLICE_START) / (SLICE_END - SLICE_START))
      englandBgRef.current.style.opacity = String(op)
    }

    // ── ENGLAND CALL-UP text slides up ────────────────────────────────────
    if (engTextRef.current) {
      let op = 0, ty = 60
      if (v >= ENG_TEXT_START && v <= ENG_TEXT_END) {
        const t = (v - ENG_TEXT_START) / (ENG_TEXT_END - ENG_TEXT_START)
        op = t; ty = 60 * (1 - t)
      } else if (v > ENG_TEXT_END) { op = 1; ty = 0 }
      engTextRef.current.style.opacity   = String(Math.max(0, Math.min(1, op)))
      engTextRef.current.style.transform = `translateY(${ty}px)`
    }

    // ── England 2020 year ─────────────────────────────────────────────────
    if (engYearRef.current) {
      let op = 0, ty = 20
      if (v >= ENG_YEAR_START && v <= ENG_YEAR_END) {
        const t = (v - ENG_YEAR_START) / (ENG_YEAR_END - ENG_YEAR_START)
        op = t; ty = 20 * (1 - t)
      } else if (v > ENG_YEAR_END) { op = 1; ty = 0 }
      engYearRef.current.style.opacity   = String(Math.max(0, Math.min(1, op)))
      engYearRef.current.style.transform = `translateY(${ty}px)`
    }

  })

  // Shared video style for full-panel coverage
  const coverStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'max(100%, calc(100vh * 16 / 9))',
    height: 'max(100%, calc(100vw * 9 / 16))',
    objectFit: 'cover',
    pointerEvents: 'none',
  }

  return (
    <div ref={containerRef} style={{ height: '650vh' }} className="relative bg-[#7A1C19]">
      <div className="sticky top-0 h-screen overflow-hidden">

        <GrainOverlay />


        {/* ─ PROFESSIONAL DEBUT text ────────────────────────────────────────── */}
        <div ref={textLayerRef} className="absolute inset-0 z-30 pointer-events-none" style={{ opacity: 1 }}>
          <div className="absolute top-[80px] md:top-[104px] left-4 md:left-6 right-4 md:right-6">
            <h2
              className={`transition-all duration-700 ease-out ${
                hasEnteredView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ margin: '0 0 18px', padding: 0, lineHeight: 0.88 }}
            >
              <span style={{
                display: 'block',
                fontFamily: 'Kegilka, serif',
                fontSize: 'clamp(2.2rem, 5vw, 5rem)',
                lineHeight: 0.88,
                fontWeight: 400,
                color: '#ffffff',
              }}>
                {debut?.heading ?? 'PROFESSIONAL'}
              </span>
              <span style={{
                display: 'block',
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: 'clamp(2.2rem, 5vw, 5rem)',
                lineHeight: 0.88,
                fontWeight: 300,
                color: '#ffffff',
              }}>
                {debut?.subheading ?? 'DEBUT'}
              </span>
            </h2>
            <p
              className={`transition-all duration-700 ease-out delay-300 ${
                hasEnteredView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: 'var(--body-text-size)',
                lineHeight: 1.72,
                color: '#ffffff',
                margin: 0,
                maxWidth: 600,
              }}
            >
              {debut?.body ?? 'Makes his senior Arsenal debut on 29 November 2018 in the UEFA Europa League against Vorskla Poltava, aged 17. The journey officially begins.'}
            </p>
          </div>
          <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6">
            <span
              className={`text-7xl md:text-9xl text-transparent tracking-tighter block leading-none transition-all duration-700 ease-out delay-500 ${
                hasEnteredView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ fontFamily: 'Kegilka, serif', WebkitTextStroke: '2px white' }}
            >
              {debut?.year ?? '2018'}
            </span>
          </div>
        </div>

        {/* ─ VIDEO CONTAINER: animated rect that grows / shrinks ────────────── */}
        <motion.div
          className="absolute z-10 overflow-hidden"
          style={{ left: vidLeft, top: vidTop, width: vidWidth, height: vidHeight }}
          suppressHydrationWarning
        >
          <div ref={debutLayerRef} className="absolute inset-0" style={{ opacity: 1 }}>
            {hasEnteredView && (
              <video
                src={DEBUT_SRC}
                autoPlay muted loop playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>
          <div ref={facupLayerRef} className="absolute inset-0" style={{ opacity: 0 }}>
            {hasEnteredView && (
              <video
                src={FACUP_SRC}
                autoPlay muted loop playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ objectFit: 'cover' }}
              />
            )}
          </div>
        </motion.div>

        {/* ─ FA CUP WINNER text ─────────────────────────────────────────────── */}
        <div
          ref={infoRef}
          className="absolute z-30 pointer-events-none"
          style={{ opacity: 0, transform: 'translateX(30px)', left: textPos.left, top: textPos.top, maxWidth: 600 }}
          suppressHydrationWarning
        >
          <h2 style={{ margin: '0 0 18px', padding: 0, lineHeight: 0.88 }}>
            <span style={{
              display: 'block',
              fontFamily: 'Kegilka, serif',
              fontSize: 'clamp(2rem, 4.4vw, 4.4rem)',
              lineHeight: 0.88,
              fontWeight: 400,
              color: '#ffffff',
            }}>
              {facup?.heading ?? 'FA CUP'}
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: 'clamp(2rem, 4.4vw, 4.4rem)',
              lineHeight: 0.88,
              fontWeight: 300,
              color: '#ffffff',
            }}>
              {facup?.subheading ?? 'WINNER'}
            </span>
          </h2>
          <p style={{
            fontFamily: 'Mona Sans, sans-serif',
            fontSize: 'var(--body-text-size)',
            lineHeight: 1.72,
            color: '#ffffff',
            margin: 0,
            maxWidth: 600,
          }}>
            {facup?.body ?? "Arsenal lift their 14th FA Cup on 1 August 2020, defeating Chelsea 2-1 in front of a ghost Wembley. Aubameyang twice, the second a cool-headed penalty. Arteta's first trophy as manager. And Saka, 18 years old, on the pitch for every second of it."}
          </p>
        </div>

        {/* ─ FA Cup 2020 year ───────────────────────────────────────────────── */}
        <div
          ref={yearFaRef}
          className="absolute bottom-6 right-4 md:right-6 z-30 pointer-events-none select-none"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          <span className="text-7xl md:text-9xl text-transparent tracking-tighter" style={{ fontFamily: 'Kegilka, serif', WebkitTextStroke: '2px white' }}>
            {facup?.year ?? '2020'}
          </span>
        </div>

        {/* ─ Left slice panel — slides UP ───────────────────────────────────── */}
        <div
          ref={leftSliceRef}
          className="absolute inset-0 z-20"
          style={{ clipPath: 'inset(0 50% 0 0)', opacity: 0 }}
        >
          {hasEnteredView && (
            <video
              src={FACUP_SRC}
              autoPlay muted loop playsInline
              preload="auto"
              style={coverStyle}
            />
          )}
        </div>

        {/* ─ Right slice panel — slides DOWN ────────────────────────────────── */}
        <div
          ref={rightSliceRef}
          className="absolute inset-0 z-20"
          style={{ clipPath: 'inset(0 0 0 50%)', opacity: 0 }}
        >
          {hasEnteredView && (
            <video
              src={FACUP_SRC}
              autoPlay muted loop playsInline
              preload="auto"
              style={coverStyle}
            />
          )}
        </div>

        {/* ─ ENGLAND CALL-UP text ───────────────────────────────────────────── */}
        <div
          ref={engTextRef}
          className="absolute z-30 top-[80px] md:top-[104px] left-4 md:left-6 right-4 md:right-6 pointer-events-none"
          style={{ opacity: 0, transform: 'translateY(60px)' }}
        >
          <h2 style={{ margin: '0 0 18px', padding: 0, lineHeight: 0.88 }}>
            <span style={{
              display: 'block',
              fontFamily: 'Kegilka, serif',
              fontSize: 'clamp(2rem, 4.4vw, 4.4rem)',
              lineHeight: 0.88,
              fontWeight: 400,
              color: '#ffffff',
            }}>
              {england?.heading ?? 'ENGLAND'}
            </span>
            <span style={{
              display: 'block',
              fontFamily: 'Mona Sans, sans-serif',
              fontSize: 'clamp(2rem, 4.4vw, 4.4rem)',
              lineHeight: 0.88,
              fontWeight: 300,
              color: '#ffffff',
            }}>
              {england?.subheading ?? 'CALL-UP'}
            </span>
          </h2>
          <p style={{
            fontFamily: 'Mona Sans, sans-serif',
            fontSize: 'var(--body-text-size)',
            lineHeight: 1.72,
            color: '#ffffff',
            margin: 0,
            maxWidth: 600,
          }}>
            {england?.body ?? "Called up to the England senior squad for the first time in October 2020, aged 19. Saka stepped onto the international stage with an assist on debut and never looked back. One of the Three Lions' most important players, he would carry the weight of a nation at Euro 2020 and beyond."}
          </p>
        </div>

        {/* ─ England 2020 year ──────────────────────────────────────────────── */}
        <div
          ref={engYearRef}
          className="absolute bottom-6 left-4 md:left-6 z-30 pointer-events-none select-none"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          <span
            className="text-7xl md:text-9xl text-transparent tracking-tighter"
            style={{ fontFamily: 'Kegilka, serif', WebkitTextStroke: '2px #ffffff' }}
          >
            {england?.year ?? '2020'}
          </span>
        </div>

        {/* ─ First England goal — slides in from right ──────────────────────── */}
        <div
          ref={goalPanelRef}
          className="absolute inset-0 z-40 bg-[#09090b]"
          style={{ transform: 'translateX(100%)', willChange: 'transform' }}
        >
          {hasEnteredView && (
            <video
              src={ENGLAND_SRC}
              autoPlay muted loop playsInline
              preload="auto"
              style={coverStyle}
            />
          )}
        </div>


      </div>
    </div>
  )
}
