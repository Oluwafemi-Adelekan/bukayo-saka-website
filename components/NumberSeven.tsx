'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useScroll, useMotionValueEvent } from 'framer-motion'

// ProfessionalDebut's curtain already opened — this section holds the Saka image
// and slides the text in as the user scrolls.
const THE_START  = 0.06
const THE_END    = 0.22
const NUM_START  = 0.10
const NUM_END    = 0.28
const BODY_START = 0.14
const BODY_END   = 0.32
const YEAR_START = 0.18
const YEAR_END   = 0.38

export default function NumberSeven() {
  const containerRef = useRef<HTMLDivElement>(null)
  const theRef       = useRef<HTMLDivElement>(null)
  const headingRef   = useRef<HTMLDivElement>(null)
  const bodyRef      = useRef<HTMLDivElement>(null)
  const yearRef      = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // "THE" label
    if (theRef.current) {
      let op = 0, ty = 40
      if (v >= THE_START && v <= THE_END) {
        const t = (v - THE_START) / (THE_END - THE_START)
        op = t; ty = 40 * (1 - t)
      } else if (v > THE_END) { op = 1; ty = 0 }
      theRef.current.style.opacity   = String(Math.max(0, Math.min(1, op)))
      theRef.current.style.transform = `translateY(${ty}px)`
    }

    // "NUMBER 7" heading
    if (headingRef.current) {
      let op = 0, ty = 50
      if (v >= NUM_START && v <= NUM_END) {
        const t = (v - NUM_START) / (NUM_END - NUM_START)
        op = t; ty = 50 * (1 - t)
      } else if (v > NUM_END) { op = 1; ty = 0 }
      headingRef.current.style.opacity   = String(Math.max(0, Math.min(1, op)))
      headingRef.current.style.transform = `translateY(${ty}px)`
    }

    // Body copy
    if (bodyRef.current) {
      let op = 0, ty = 40
      if (v >= BODY_START && v <= BODY_END) {
        const t = (v - BODY_START) / (BODY_END - BODY_START)
        op = t; ty = 40 * (1 - t)
      } else if (v > BODY_END) { op = 1; ty = 0 }
      bodyRef.current.style.opacity   = String(Math.max(0, Math.min(1, op)))
      bodyRef.current.style.transform = `translateY(${ty}px)`
    }

    // Year outline — bottom-right
    if (yearRef.current) {
      let op = 0, ty = 60
      if (v >= YEAR_START && v <= YEAR_END) {
        const t = (v - YEAR_START) / (YEAR_END - YEAR_START)
        op = t; ty = 60 * (1 - t)
      } else if (v > YEAR_END) { op = 1; ty = 0 }
      yearRef.current.style.opacity   = String(Math.max(0, Math.min(1, op)))
      yearRef.current.style.transform = `translateY(${ty}px)`
    }
  })

  return (
    <div ref={containerRef} style={{ height: '400vh' }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Saka #7 image — continuous from ProfessionalDebut curtain reveal */}
        <div className="absolute inset-0">
          <Image
            src="/Saka no. 7.png"
            alt="Bukayo Saka wearing the number 7 shirt"
            fill
            className="object-cover"
            style={{ objectPosition: 'center top' }}
            quality={100}
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />
        </div>

        {/* Text block — top-left, staggered slide-up */}
        <div className="absolute z-10 top-[80px] md:top-[104px] left-4 md:left-6 max-w-xs md:max-w-sm pointer-events-none">
          <div ref={theRef} style={{ opacity: 0, transform: 'translateY(40px)' }}>
            <h3
              className="text-white text-xl md:text-2xl tracking-widest uppercase leading-none"
              style={{ fontFamily: 'Kegilka, serif' }}
            >
              THE
            </h3>
          </div>
          <div ref={headingRef} style={{ opacity: 0, transform: 'translateY(50px)' }}>
            <h2
              className="text-white text-xl md:text-2xl mb-3 tracking-widest uppercase whitespace-nowrap"
              style={{ fontFamily: 'Kegilka, serif' }}
            >
              NUMBER 7
            </h2>
          </div>
          <div ref={bodyRef} style={{ opacity: 0, transform: 'translateY(40px)' }}>
            <p
              className="text-white/70 text-[11px] md:text-xs leading-relaxed"
              style={{ fontFamily: 'Mona Sans, sans-serif' }}
            >
              Handed the iconic number seven shirt, Saka wore it with the quiet confidence
              of someone who had already earned it — a prodigy carrying the weight of a
              club&apos;s future on his back, and never once letting it show.
            </p>
          </div>
        </div>

        {/* Year outline — bottom-right */}
        <div
          ref={yearRef}
          className="absolute bottom-6 right-4 md:right-6 z-10 pointer-events-none select-none"
          style={{ opacity: 0, transform: 'translateY(60px)' }}
        >
          <span
            className="text-7xl md:text-9xl text-transparent tracking-tighter block leading-none"
            style={{ fontFamily: 'Kegilka, serif', WebkitTextStroke: '2px white' }}
          >
            2023
          </span>
        </div>

      </div>
    </div>
  )
}
