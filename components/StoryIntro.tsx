'use client'

import { useRef, useEffect, useState } from 'react'
import { useScroll, useTransform, motion, useMotionTemplate, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'
import GrainOverlay from './GrainOverlay'

const DASH = 6000

export default function StoryIntro() {
  const ref = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const panel1Ref = useRef<HTMLDivElement>(null)
  const panel2Ref = useRef<HTMLDivElement>(null)
  const measureRef = useRef<SVGTextElement>(null)
  const [letterX, setLetterX] = useState([120, 155, 190])
  const compactRef = useRef(false)

  useEffect(() => {
    const measure = () => {
      const el = measureRef.current
      if (!el) return
      try {
        const x0 = el.getStartPositionOfChar(0).x
        const x1 = el.getStartPositionOfChar(1).x
        const x2 = el.getStartPositionOfChar(2).x
        if (isFinite(x0) && x1 > x0 && x2 > x1) setLetterX([x0, x1, x2])
      } catch {}
    }
    measure()
    document.fonts.ready.then(measure)
  }, [])

  useEffect(() => {
    const updateCompact = () => {
      compactRef.current = window.innerWidth < 1024
    }
    updateCompact()
    window.addEventListener('resize', updateCompact)
    return () => window.removeEventListener('resize', updateCompact)
  }, [])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // ─── PHASE 1: THE STORY stroke-draw (0.00 → 0.30) ────────────────────────
  const tDash = useTransform(scrollYProgress, [0.02, 0.18], [2000, 0])
  const hDash = useTransform(scrollYProgress, [0.06, 0.22], [2000, 0])
  const eDash = useTransform(scrollYProgress, [0.04, 0.20], [2000, 0])

  const tFill = useTransform(scrollYProgress, [0.16, 0.26], [0, 1])
  const hFill = useTransform(scrollYProgress, [0.20, 0.30], [0, 1])
  const eFill = useTransform(scrollYProgress, [0.18, 0.28], [0, 1])

  const storyDashOffset = useTransform(scrollYProgress, [0.08, 0.28], [DASH, 0])
  const storyFillOpacity = useTransform(scrollYProgress, [0.24, 0.34], [0, 1])

  // ─── PHASE 2: Curtain reveal (0.34 → 0.55) ───────────────────────────────
  const insetX = useTransform(scrollYProgress, [0.34, 0.55], [50, 0])
  const clipPath = useMotionTemplate`inset(0% ${insetX}% 0% ${insetX}%)`

  // ─── Imperative scroll handler ────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const compact = compactRef.current
    // THE STORY text fades out as curtain opens (0.34 → 0.48)
    if (textRef.current) {
      let op = 1
      if (v >= 0.34 && v <= 0.48) {
        op = 1 - (v - 0.34) / (0.48 - 0.34)
      } else if (v > 0.48) {
        op = 0
      }
      textRef.current.style.opacity = String(Math.max(0, Math.min(1, op)))
    }

    // Panel 1: on compact screens it exits before panel 2 enters, avoiding text collisions.
    if (panel1Ref.current) {
      let op = 0
      let ty = '100vh'
      const inStart = compact ? 0.58 : 0.60
      const inEnd = compact ? 0.68 : 0.72
      const holdEnd = compact ? 0.74 : 0.80
      const outEnd = compact ? 0.80 : 0.88
      if (v < inStart) {
        op = 0; ty = '100vh'
      } else if (v <= inEnd) {
        const t = (v - inStart) / (inEnd - inStart)
        op = t; ty = `${100 * (1 - t)}vh`
      } else if (v <= holdEnd) {
        op = 1; ty = '0vh'
      } else if (v <= outEnd) {
        const t = (v - holdEnd) / (outEnd - holdEnd)
        op = 1 - t; ty = `${-100 * t}vh`
      } else {
        op = 0; ty = '-100vh'
      }
      panel1Ref.current.style.opacity = String(Math.max(0, Math.min(1, op)))
      panel1Ref.current.style.transform = `translateY(${ty})`
    }

    // Panel 2: starts later on compact screens so it gets a clean viewport.
    if (panel2Ref.current) {
      let op = 0
      let ty = '100vh'
      const inStart = compact ? 0.82 : 0.78
      const inEnd = compact ? 0.92 : 0.88
      if (v < inStart) {
        op = 0; ty = '100vh'
      } else if (v <= inEnd) {
        const t = (v - inStart) / (inEnd - inStart)
        op = t; ty = `${100 * (1 - t)}vh`
      } else {
        op = 1; ty = '0vh'
      }
      panel2Ref.current.style.opacity = String(Math.max(0, Math.min(1, op)))
      panel2Ref.current.style.transform = `translateY(${ty})`
    }
  })

  return (
    <div id="story" ref={ref} style={{ height: '600vh' }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#09090b]">
        <GrainOverlay />

        {/* ── Layer 1: Early Life image — revealed by curtain ── */}
        <motion.div
          style={{ clipPath }}
          className="absolute inset-0 z-[1]"
        >
          <Image
            src="/Ealry Life.png"
            alt="Ealing, London"
            fill
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </motion.div>

        {/* ── Layer 2: THE STORY SVG text ── */}
        <div
          ref={textRef}
          className="absolute inset-0 z-[2] flex items-center justify-center"
          style={{ opacity: 1 }}
        >
          <div className="w-full max-w-5xl px-4 md:px-6">
            <svg
              viewBox="0 -90 1000 300"
              className="w-full block overflow-visible"
              aria-label="The Story"
            >
              {/* Hidden reference text — measures exact letter positions after font loads */}
              <text
                ref={measureRef}
                x="120" y="-30"
                textAnchor="start"
                fontSize="50"
                visibility="hidden"
                style={{ fontFamily: 'Kegilka, serif', fontWeight: 400 }}
              >
                THE
              </text>

              {/* T — stroke then fill */}
              <motion.text x={letterX[0]} y="-30" textAnchor="start" fontSize="50"
                fill="none" stroke="white" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="2000"
                style={{ strokeDashoffset: tDash, fontFamily: 'Kegilka, serif', fontWeight: 400 }}>
                T
              </motion.text>
              <motion.text x={letterX[0]} y="-30" textAnchor="start" fontSize="50"
                fill="white"
                style={{ opacity: tFill, fontFamily: 'Kegilka, serif', fontWeight: 400 }}>
                T
              </motion.text>

              {/* H — stroke then fill */}
              <motion.text x={letterX[1]} y="-30" textAnchor="start" fontSize="50"
                fill="none" stroke="white" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="2000"
                style={{ strokeDashoffset: hDash, fontFamily: 'Kegilka, serif', fontWeight: 400 }}>
                H
              </motion.text>
              <motion.text x={letterX[1]} y="-30" textAnchor="start" fontSize="50"
                fill="white"
                style={{ opacity: hFill, fontFamily: 'Kegilka, serif', fontWeight: 400 }}>
                H
              </motion.text>

              {/* E — stroke then fill */}
              <motion.text x={letterX[2]} y="-30" textAnchor="start" fontSize="50"
                fill="none" stroke="white" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="2000"
                style={{ strokeDashoffset: eDash, fontFamily: 'Kegilka, serif', fontWeight: 400 }}>
                E
              </motion.text>
              <motion.text x={letterX[2]} y="-30" textAnchor="start" fontSize="50"
                fill="white"
                style={{ opacity: eFill, fontFamily: 'Kegilka, serif', fontWeight: 400 }}>
                E
              </motion.text>

              {/* STORY — stroke then fill */}
              <motion.text x="500" y="188" textAnchor="middle" fontSize="195"
                fill="none" stroke="white" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={DASH}
                style={{ strokeDashoffset: storyDashOffset, fontFamily: 'Kegilka, serif', fontWeight: 400 }}>
                STORY
              </motion.text>
              <motion.text x="500" y="188" textAnchor="middle" fontSize="195"
                fill="white"
                style={{ opacity: storyFillOpacity, fontFamily: 'Kegilka, serif', fontWeight: 400 }}>
                STORY
              </motion.text>
            </svg>
          </div>
        </div>

        {/* ── Layer 3: Panel 1 — Early Life heading + birth paragraph + 2001 ── */}
        <div
          ref={panel1Ref}
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{ opacity: 0, transform: 'translateY(100vh)' }}
        >
          <div className="absolute top-[80px] md:top-[104px] left-4 md:left-6 right-4 md:right-6">
            <h2 style={{ margin: '0 0 18px', padding: 0, lineHeight: 0.88 }}>
              <span style={{
                display: 'block',
                fontFamily: 'Kegilka, serif',
                fontSize: 'clamp(2.2rem, 5vw, 5rem)',
                lineHeight: 0.88,
                fontWeight: 400,
                color: '#ffffff',
              }}>
                EARLY
              </span>
              <span style={{
                display: 'block',
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: 'clamp(2.2rem, 5vw, 5rem)',
                lineHeight: 0.88,
                fontWeight: 300,
                color: '#ffffff',
              }}>
                LIFE
              </span>
            </h2>
            <p
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: 'var(--body-text-size)',
                lineHeight: 1.72,
                color: 'rgba(255,255,255,0.72)',
                margin: 0,
                maxWidth: 600,
              }}
            >
              Born on 5 September 2001 in Ealing, West London, to Nigerian parents
              from Ondo State. Bukayo Ayoyinka Temidayo Moses Saka was raised in a
              tight-knit, faith-driven household that shaped his humility, drive, and
              infectious warmth.
            </p>
          </div>

          <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6">
            <span
              style={{
                fontFamily: 'Kegilka, serif',
                fontSize: 'clamp(5rem, 13vw, 11rem)',
                color: 'transparent',
                WebkitTextStroke: '2px rgba(255,255,255,0.9)',
                display: 'block',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              2001
            </span>
          </div>
        </div>

        {/* ── Layer 3: Panel 2 — School + father Yomi quote ── */}
        <div
          ref={panel2Ref}
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{ opacity: 0, transform: 'translateY(100vh)' }}
        >
          <div className="absolute top-[80px] md:top-[104px] left-4 md:left-6 right-4 md:right-6">
            <p
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: 'var(--body-text-size)',
                lineHeight: 1.72,
                color: 'rgba(255,255,255,0.72)',
                margin: '0 0 14px',
                maxWidth: 600,
              }}
            >
              He attended Edward Betham Church of England Primary School before
              Greenford High School, where he gained high grades in his GCSEs,
              achieving four A&rsquo;s and three As.
            </p>
            <p
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: 'var(--body-text-size)',
                lineHeight: 1.72,
                color: 'rgba(255,255,255,0.72)',
                margin: 0,
                maxWidth: 600,
              }}
            >
              Prior to joining Arsenal, Saka played youth football for local club
              Greenford Celtic.
            </p>
          </div>

          <div
            className="absolute right-4 md:right-6 bottom-[60px] md:bottom-6"
            style={{ maxWidth: 280, textAlign: 'right' }}
          >
            <p
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: 'var(--body-text-size)',
                lineHeight: 1.72,
                color: 'rgba(255,255,255,0.68)',
                margin: '0 0 8px',
                fontStyle: 'italic',
              }}
            >
              &ldquo;He&rsquo;s a massive inspiration for me. From when I was young,
              he always kept me grounded, kept me humble.&rdquo;
            </p>
            <span
              style={{
                fontFamily: 'Mona Sans, sans-serif',
                fontSize: '0.52rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.38)',
              }}
            >
              Saka on his father, Yomi
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
