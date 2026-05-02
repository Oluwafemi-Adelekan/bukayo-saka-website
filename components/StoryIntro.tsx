'use client'

import { useRef, useEffect, useState } from 'react'
import { useScroll, useTransform, motion, useMotionTemplate, useMotionValueEvent } from 'framer-motion'

const DASH = 6000

export default function StoryIntro() {
  const ref = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<SVGTextElement>(null)
  // Initial values are fallback estimates; overwritten once font is measured
  const [letterX, setLetterX] = useState([120, 155, 190])

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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // ─── PHASE 1: TEXT DRAW (0.00 → 0.30) ───
  const tDash = useTransform(scrollYProgress, [0.02, 0.18], [2000, 0])
  const hDash = useTransform(scrollYProgress, [0.06, 0.22], [2000, 0])
  const eDash = useTransform(scrollYProgress, [0.04, 0.20], [2000, 0])

  const tFill = useTransform(scrollYProgress, [0.16, 0.26], [0, 1])
  const hFill = useTransform(scrollYProgress, [0.20, 0.30], [0, 1])
  const eFill = useTransform(scrollYProgress, [0.18, 0.28], [0, 1])

  const storyDashOffset = useTransform(scrollYProgress, [0.08, 0.28], [DASH, 0])
  const storyFillOpacity = useTransform(scrollYProgress, [0.24, 0.34], [0, 1])

  // ─── PHASE 2: CURTAIN REVEAL + TEXT FADE (0.34 → 0.55) ───
  const insetX = useTransform(scrollYProgress, [0.34, 0.55], [50, 0])
  const clipPath = useMotionTemplate`inset(0% ${insetX}% 0% ${insetX}%)`

  // Imperatively control text fade + info reveal via a single listener
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // Text fade: 0.34 → 0.48
    if (textRef.current) {
      let op = 1
      if (v >= 0.34 && v <= 0.48) {
        op = 1 - ((v - 0.34) / (0.48 - 0.34))
      } else if (v > 0.48) {
        op = 0
      }
      textRef.current.style.opacity = String(Math.max(0, Math.min(1, op)))
    }

    // Info reveal: 0.60 → 0.80
    if (infoRef.current) {
      let infoOp = 0
      let infoTranslate = 40
      if (v >= 0.60 && v <= 0.80) {
        const t = (v - 0.60) / (0.80 - 0.60)
        infoOp = t
        infoTranslate = 40 * (1 - t)
      } else if (v > 0.80) {
        infoOp = 1
        infoTranslate = 0
      }
      infoRef.current.style.opacity = String(Math.max(0, Math.min(1, infoOp)))
      infoRef.current.style.transform = `translateY(${infoTranslate}px)`
    }
  })

  return (
    <div ref={ref} style={{ height: '600vh' }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#09090b]">
        
        {/* LAYER 1: Image behind curtain */}
        <motion.div
          style={{ clipPath }}
          className="absolute inset-0 z-[1]"
        >
          <div className="relative w-full h-full">
            <img
              src="/Saka childhood image.png"
              alt="Young Bukayo Saka"
              className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
            />
            <div className="absolute inset-0 bg-[#EF0107] mix-blend-multiply opacity-80" />
            <div className="absolute inset-0 bg-black/30" />
            <div 
              className="absolute inset-0 mix-blend-overlay opacity-40 pointer-events-none"
              style={{ backgroundImage: 'url("/grain.png")', backgroundSize: '200px' }}
            />
          </div>
        </motion.div>

        {/* LAYER 2: Info overlay — controlled imperatively */}
        <div 
          ref={infoRef}
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{ opacity: 0, transform: 'translateY(40px)' }}
        >
          <div className="absolute top-[80px] md:top-[104px] left-4 md:left-6 max-w-xs md:max-w-sm">
            <h3 
              className="text-white text-xl md:text-2xl mb-3 tracking-widest uppercase" 
              style={{ fontFamily: 'Notable, serif' }}
            >
              EALING BORN
            </h3>
            <p 
              className="text-zinc-300 text-[11px] md:text-xs leading-relaxed" 
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            >
              Born on 5 September 2001 in Ealing, West London, to Nigerian
              parents from Ondo State. Raised in a tight-knit, faith-driven
              household that shaped his humility, drive, and infectious warmth.
            </p>
          </div>

          <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6">
            <span 
              className="text-7xl md:text-9xl text-transparent tracking-tighter" 
              style={{ 
                fontFamily: 'Notable, serif', 
                WebkitTextStroke: '2px white' 
              }}
            >
              2001
            </span>
          </div>
        </div>

        {/* LAYER 3: THE STORY text — controlled imperatively */}
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
              {/* Hidden reference — measures exact Notable character positions */}
              <text ref={measureRef} x="120" y="-30" textAnchor="start" fontSize="50" visibility="hidden" style={{ fontFamily: 'Notable, serif', fontWeight: 400 }}>THE</text>

              {/* THE - Stroke */}
              <motion.text x={letterX[0]} y="-30" textAnchor="start" fontSize="50" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2000" style={{ strokeDashoffset: tDash, fontFamily: 'Notable, serif', fontWeight: 400 }}>T</motion.text>
              <motion.text x={letterX[1]} y="-30" textAnchor="start" fontSize="50" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2000" style={{ strokeDashoffset: hDash, fontFamily: 'Notable, serif', fontWeight: 400 }}>H</motion.text>
              <motion.text x={letterX[2]} y="-30" textAnchor="start" fontSize="50" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2000" style={{ strokeDashoffset: eDash, fontFamily: 'Notable, serif', fontWeight: 400 }}>E</motion.text>

              {/* THE - Fill */}
              <motion.text x={letterX[0]} y="-30" textAnchor="start" fontSize="50" fill="white" style={{ opacity: tFill, fontFamily: 'Notable, serif', fontWeight: 400 }}>T</motion.text>
              <motion.text x={letterX[1]} y="-30" textAnchor="start" fontSize="50" fill="white" style={{ opacity: hFill, fontFamily: 'Notable, serif', fontWeight: 400 }}>H</motion.text>
              <motion.text x={letterX[2]} y="-30" textAnchor="start" fontSize="50" fill="white" style={{ opacity: eFill, fontFamily: 'Notable, serif', fontWeight: 400 }}>E</motion.text>

              {/* STORY - Stroke */}
              <motion.text x="500" y="188" textAnchor="middle" fontSize="195" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={DASH} style={{ strokeDashoffset: storyDashOffset, fontFamily: 'Notable, serif', fontWeight: 400 }}>STORY</motion.text>
              {/* STORY - Fill */}
              <motion.text x="500" y="188" textAnchor="middle" fontSize="195" fill="white" style={{ opacity: storyFillOpacity, fontFamily: 'Notable, serif', fontWeight: 400 }}>STORY</motion.text>
            </svg>
          </div>
        </div>

      </div>
    </div>
  )
}
